import fs from 'mz/fs';
import {inspect} from 'util';
import {stringify, parse} from 'JSONStream';
import {createWriteStream, createReadStream} from 'fs';
import {mapSync} from 'event-stream';
import {dirname} from 'path';
import {sync as mkdirp} from 'mkdirp';
import pathExists from 'path-exists';
import moment from 'moment';
import queue from 'queue';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';


let started = false;
let cfg = {path:process.cwd()};
let streams = {};
let lastAccessTime = {};
let q = queue({concurrency:1});

setInterval( () => {
  for (let file in lastAccessTime) {
    let now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 31000) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }
}, 15000);

process.on('beforeExit', () => {
  for (let file in streams) {
    streams[file].end();
  }
});

export function config(conf) {
  Object.assign(cfg,conf);
}

export function whichFile(type, datetime) {
  let gmt = moment(datetime).utcOffset(0);
  return `${cfg.path}/${type}_GMT/${gmt.format('YYYY-MM-DD/hhA')}`;
}

q.on('timeout', (next) => {
  console.error('queue timed out');
  next();
});

let lastData = {};

export function log(type,obj,time = new Date()) {
  if (cfg.noRepeat) {
    let hadTime = obj.hasOwnProperty('time');
    let copyTime = null;
    if (hadTime) copyTime = new Date(obj.time.getTime());
    if (hadTime) delete obj['time'];
    if (lastData.hasOwnProperty(type) && equal(lastData[type], obj)) {
      if (hadTime) obj.time = copyTime;
      return;
    }
    lastData[type] = cloneDeep(obj);
    if (hadTime) obj.time = copyTime;
  }
  q.push(cb => { dolog(type, obj, time, cb);});
  if (!started) {
    started = true;
    q.start(e=> {
      started = false;
      if (e) console.error('Error running queue: ', e)
    });
  }
}

function getWriteStream(fname, cb) {
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return cb(streams[fname]);
  }
  pathExists(dirname(fname)).then(exists => {
    if (!exists) mkdirp(dirname(fname));

    pathExists(fname).then(fexists => {
      let finish = (continueJSON) => {
        let fileStream = createWriteStream(fname,{flags:'a'});
        let jsonStream = null;
        jsonStream = stringify(false);
        if (continueJSON) {
          fileStream.write('\n');
        }
        jsonStream.pipe(fileStream);
        streams[fname] = jsonStream;
        lastAccessTime[fname] = new Date();
        return cb(jsonStream);
      }

      if (fexists) {
        finish(true);
      } else {
        finish(false);
      }
    });
  });
}

function dolog(type, obj, time = new Date(), cb) {
  try {
    let fname = whichFile(type, time);
    let toWrite = {time, type};
    for (let key in obj) toWrite[key] = obj[key];
    getWriteStream(fname, stream => {
      stream.write(toWrite);
      cb();
    });
  } catch (e) {
    console.error(e);
  }
}

function byDate(a, b) {
  const dt = d => moment(d,'YYYY-MM-DD');
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

function byTime(a, b) {
  const dt = d => moment(`2015-12-01 ${d}`, 'YYYY-MM-DD hhA');
  if (dt(a).valueOf() < dt(b).valueOf()) return -1;
  if (dt(a).valueOf() > dt(b).valueOf()) return 1;
  return 0;
}

export async function whichFiles(type, start, end) {
  let startDate = moment(start).utcOffset(0).startOf('day').valueOf();
  let endDate = moment(end).utcOffset(0).endOf('day').valueOf();
  let st = moment(start).utcOffset(0).startOf('hour').valueOf();
  let en = moment(end).valueOf();
  let dirs = [];
  try { dirs = await fs.readdir(`${cfg.path}/${type}_GMT`); }
  catch (e) { console.error('timequerylog error reading dirlist: '+e.message+' cfg.path is '+cfg.path);return []; }

  dirs = dirs.sort(byDate) ;

  let newDirs = dirs.filter( d => {
    let val = moment(d+' +0000', 'YYYY-MM-DD Z').valueOf();
    return val >= startDate && val <= endDate;
  });
  if (newDirs.length === 0) {
    console.error('No logs found in date/time range: all dirs found='+JSON.stringify(dirs)+
                  ' st='+startDate+' en='+endDate+' matching dirs='+JSON.stringify(newDirs));
    return []
  };
  dirs = newDirs;
  let result = [];
  for (let dir of dirs) {
    try {
      let files = await fs.readdir(`${cfg.path}/${type}_GMT/${dir}`);
      files = files.sort(byTime);
      files = files.filter( file => {
        let timeMS = moment(`${dir} ${file} +0000`,'YYYY-MM-DD hhA Z').valueOf();
        return timeMS >= st && timeMS <= en;
      });
      let paths = files.map( f => `${cfg.path}/${type}_GMT/${dir}/${f}` );
      Array.prototype.push.apply(result, paths);
    } catch (e) { console.error('Error filtering log files:'+e.message); return []; }
  }
  return result;
}

async function filterFile(fname, start, end, matchFunction) {
  let data = await new Promise( res => {
    try {
      let results = [];
      let file = createReadStream(fname);
      let stream = parse();
      file.pipe(stream);
      stream.pipe(mapSync( data => {
        data.time = new Date(data.time);
        if (data.time >= start && data.time <= end &&
            matchFunction(data)) {
          results.push(data)
          return data;
        }
      }));
      stream.on('end', () => { res(results);});
    } catch (e) {
      console.error(inspect(e));
    }
  });
  return data;
}

export async function query(type, start, end, matchFunction = (d => true)) {
  let files = await whichFiles(type, start, end);
  let results = [];
  for (let fname of files) {
    Array.prototype.push.apply(results, await filterFile(fname, start, end, matchFunction));
  }
  return results;
}

function fmt(dt) {
  return moment(dt).format('YYYY-MM-DD hh:mm:ss A');
}

export async function queryRecent(type) {
  let end = new Date();
  let start = moment(end).subtract(30, 'minutes').toDate();
  let results = await query(type, start, end);
  return results;
}

import {Readable} from 'stream';

class QueryStream extends Readable {
  constructor(options) {
    super(options);
    Object.assign(this, options);
    this.init(options).catch(consol.error);
  }

  init = async (options) => {
    this.files = await whichFiles(type, start, end);
    this.fileNum = 0;
    this.rowNum = 0;
    this.data = [];
  }

  loadFile = async () => {
    if (this.fileNum) >= this.files.length) {
      return null;
    }
    return await filterFile(this.files[this.fileNum++], this.start,
                            this.end, this.matchFunction);
  }

  nextRow = async () => {
    this.reading = true;
    if (!this.data) return null;
    if (this.rowNum >= this.data.length) {
      this.fileNum++;
      this.data = await this.loadFile();
      if (!this.data) return null;
    }
    const row = this.data[this.rowNum];
    this.rowNum++;
    return row;
  }

  _read = () => {
    return new Promise( async (resolve) => {
      let canPush = true;
      do {
        if (!(this.data)) this.data = this.loadFile();
        this.row = await this.nextRow();
        canPush = this.push(row);
      } while (this.row && canPush);
    }).resolve();
  }

}

export function queryOpts(options) {

  const {type, start, end, matchFunction} = options;
  if (!options.matchFunction) options.matchFunction = (d=>true);
  return new QueryStream(options);
}
