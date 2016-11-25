import fs from 'mz/fs';
import {inspect} from 'util';
import {stringify, parse} from 'JSONStream';
import {createWriteStream, unlink,
        readFile, writeFile, createReadStream} from 'fs';
import {mapSync} from 'event-stream';
import {dirname} from 'path';
import {sync as mkdirp} from 'mkdirp';
import pathExists from 'path-exists';
import {extname} from 'path';
import moment from 'moment-timezone';
import queue from 'queue';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import msgpack from 'msgpack-lite';
import pify from 'pify';
import snappy from 'snappy';
import delay from 'delay';
import {ReadableStreamBuffer} from 'stream-buffers';
import {nowOrAgainPromise} from 'now-or-again';

const readFilePromise = pify(readFile);
const writeFilePromise = pify(writeFile);
const unlinkPromise = pify(unlink);
const snappyCompressPromise = pify(snappy.compress);
const snappyUncompressPromise = pify(snappy.uncompress);

let started = false;
let cfg = {path:process.cwd(), ext:'jsonl'};
let streams = {};
let lastAccessTime = {};
let q = queue({concurrency:1});

setInterval( () => {
  for (let file in lastAccessTime) {
    let now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 900) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }
}, 1000); //15000

function shutdown() {
  for (let file in streams) {
    try {
      streams[file].end();
    } catch (e) {
    }
  }
}

process.on('beforeExit', shutdown);
process.on('exit', shutdown);
process.on('SIGINT', () => { shutdown(); process.exit() });

export function config(conf) {
  Object.assign(cfg,conf);
}

export function whichFile(type, datetime) {
  let ext = '.jsonl';
  if (cfg.ext) ext = '.'+cfg.ext;
  let gmt = moment(datetime).utcOffset(0);
  return `${cfg.path}/${type}_GMT/${gmt.format('YYYY-MM-DD/hhA')}${ext}`;
}

q.on('timeout', (next) => {
  console.error('queue timed out');
  next();
});

let lastData = {};

function getConfig(type, opt, default_) {
  if (!(cfg.hasOwnProperty(opt))) return default_;
  if (!(typeof cfg[opt] == 'object')) return cfg[opt];
  // use glob/minimatch to match cfg[opt]
  if (cfg.noRepeat.hasOwnProperty(type) &&
      cfg.noRepeat[type] === true) return true;
  return false;
}

function noRepeat(type) {
  if (!(cfg.hasOwnProperty('noRepeat'))) return false;
  if (cfg.noRepeat === true) return true;
  if (cfg.noRepeat.hasOwnProperty(type) &&
      cfg.noRepeat[type] === true) return true;
  return false;
}

export function log(type,obj,time = new Date()) {
  obj.time = time;
  if (noRepeat(type)) {
    let copyTime = null;
    copyTime = new Date(obj.time.getTime());
    delete obj['time'];
    if (lastData.hasOwnProperty(type) && equal(lastData[type], obj)) {
      obj.time = copyTime;
      return;
    }
    lastData[type] = cloneDeep(obj);
    obj.time = copyTime;
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

async function getWriteStreamExt(fname) {
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return streams[fname];
  }
  const exists = await pathExists(dirname(fname));
  if (!exists) mkdirp(dirname(fname));

  const fexists = await pathExists(fname);
  let encodeStream = null;
  let fileStream = createWriteStream(fname,{flags:'a'});

  switch (extname(fname)) {
    case '.msp':
      encodeStream = msgpack.createEncodeStream();
      break;
    default:
      encodeStream = stringify(false);
      if (fexists) {
        fileStream.write('\n');
      }
  }
  encodeStream.pipe(fileStream);
  streams[fname] = encodeStream;
  lastAccessTime[fname] = new Date();
  return encodeStream;
}

const compressing = {};

async function snappyCompress(type,f) {
  try {
    console.log('trying to compress type',type, ' file', f);
    if (f.indexOf('.snappy')>0) return;
    if (compressing[f]) return;
    compressing[f] = true;
    const buffer = await readFilePromise(f);
    console.log('buffer is..',buffer);
    const compressed = await snappyCompressPromise(buffer);
    console.log('writing compressed.');
    await writeFilePromise(f+'.snappy', compressed);
    await unlinkPromise(f);
  } catch (e) {
    console.error('Error in snappy compress:',e);
    compressing[f] = false;
  }
  compressing[f] = false;
}

const oldestSnappy = {};

async function compressOld({type, time}) {
  try {
    console.log('compressOld called type = ', type, 'time = ', time);
    const end = moment(time).tz('UCT').subtract(1,'hours').toDate();;
    let start = new Date('1979-01-01');
    console.log('start =',start.toUTCString(), 'end =', end.toUTCString());
    if (oldestSnappy[type]) start = oldestSnappy[type];
    const files = await whichFiles(type, start, end);
    console.log('calling snapp compress on files ', files);
    Promise.all(files.map(f=>snappyCompress(type, f)));
    oldestSnappy[type] = end;
    console.log('waiting..');
    await delay(300);
    console.log('returning from compressOld');
  } catch (e) {
    console.log('blah');
    console.error(e);
    throw new Error('timequerylog problem compressing old files: '+e.message);
  }
}

function dolog(type, obj, time = new Date(), cb) {
  try {
    let fname = whichFile(type, time);
    let toWrite = {time, type};
    for (let key in obj) toWrite[key] = obj[key];
    getWriteStreamExt(fname).then(stream => {
      stream.write(toWrite);
      if (cfg.snappy) {
        console.log('calling now or again');
        nowOrAgainPromise(type,compressOld,{type, time}).catch(console.error);
      }
      cb(null);
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
  console.log('q');
  let startDate = moment(start).utcOffset(0).startOf('day').valueOf();
  let endDate = moment(end).utcOffset(0).endOf('day').valueOf();
  let st = moment(start).utcOffset(0).startOf('hour').valueOf();
  let en = moment(end).valueOf();
  let dirs = [];
  try { dirs = await fs.readdir(`${cfg.path}/${type}_GMT`); }
  catch (e) { console.error('timequerylog error reading dirlist: '+e.message+' cfg.path is '+cfg.path);return []; }

  dirs = dirs.sort(byDate) ;
  console.log(dirs);
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
      console.log(paths);
      Array.prototype.push.apply(result, paths);
    } catch (e) { console.error('Error filtering log files:'+e.message); return []; }
  }
  result = result.filter( fname => !(extname(fname) != '.snappy' && result.includes(fname+'.snappy')) );
  return result;
}

async function getReadStreamExt(fname) {
  let ext = extname(fname), input = null;
  if (ext.indexOf('.snappy')>=0) {
      const hourLogs = await readFilePromise(fname);
      const uncompressed = await snappyUncompressPromise(hourLogs);
      input = new ReadableStreamBuffer({frequency:1,chunkSize:128000});
      input.put(uncompressed);
      input.stop();
      fname = fname.replace('.snappy','');
      ext = extname(fname);
  } else {
    console.log('ext is ',ext);
    input = createReadStream(fname);
  }
  let ret = null;
  switch (ext) {
    case '.msp':
      ret = msgpack.createDecodeStream();
      input.pipe(ret);
      return ret;
      break;
    default:
      ret = parse();
      input.pipe(ret);
      return ret;
  }
}

async function filterFile(fname, start, end, matchFunction) {
  console.log('n');
  let data = await new Promise( async res => {
    try {
      let results = [];
      console.log('a');
      let stream = await getReadStreamExt(fname);
      console.log('b');
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
      console.error('Error in filterFile:');
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
    options.objectMode = true;
    super(options);
    Object.assign(this, options);
    this.initFinished = false;
    this.fileNum = 0;
  }

  init = async () => {
    console.log('INITIALIXING');
    console.log('A');
    this.files = await whichFiles(this.type, this.start, this.end);
    console.log('B');
    console.log('this.files is', this.files);
    this.fileNum = 0;
    this.rowNum = 0;
    this.data = [];
    this.initFinished = true;
  }

  loadFile = async (f) => {
    console.log(this.files);
    if (!this.files) await this.init();
    if (this.data && this.rowNum < this.data.length) {
      return this.data;
    }
    if (this.files && this.fileNum >= this.files.length) {
      return null;
    }
    if (this.data) {
      this.rowNum = 0;
    }
    let result = null;
    try {
      result =  await filterFile(this.files[this.fileNum++], this.start,
                                 this.end, this.match);
    } catch (e) {
      console.error('filterfile err in loadfile',e);
    }
    this.data = result;
    return result;
  }

  nextRow = async () => {
    if (!this.data) return null;
    if (this.rowNum >= this.data.length) {
      this.data = await this.loadFile();
      if (!this.data) return null;
    }
    const row = this.data[this.rowNum];
    this.rowNum++;
    return row;
  }

  _read = () => {
    console.log('read');
    this.reading = new Promise( async (res) => {
      if (this.reading) await this.reading;
      console.log('actually reading');
      let canPush = true;
      do {
        try {
          this.data = await this.loadFile();
        } catch (e) { console.trace(e) };
        this.row = await this.nextRow();
        if (this.row) {
          if (this.timeMS) this.row.time = this.row.time.getTime();
          if (this.map) this.row = this.map(this.row);
        }
        canPush = this.push(this.row);
      } while (this.row && canPush);
    }).catch(console.error);
  }

}

export function queryOpts(options) {
  console.log('received query');
  let {type, start, end, match} = options;
  if (!match) options.match = (d=>true);
  if (!end) options.end = new Date();
  if (!start) options.start = moment(end).subtract(30, 'minutes').toDate();

  const qs = new QueryStream(options);

  if (options.csv) {
    const csvWriter = require('csv-write-stream');
    const obj2csv = csvWriter();
    qs.pipe(obj2csv);
    return obj2csv;
  } else {
    console.log('returning quer stream');
    return qs;
  }
}

