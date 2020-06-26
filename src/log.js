import fs from 'mz/fs';
import {inspect} from 'util';
import {stringify, parse} from 'JSONStream';
import safeStringify from 'json-stringify-safe';
import {createWriteStream, unlink,
        readFile, writeFile, createReadStream} from 'fs';
import {mapSync} from 'event-stream';
import {dirname} from 'path';
import {sync as mkdirp} from 'mkdirp';
import pathExists from 'path-exists';
import LRU from 'lru-cache';
import {extname} from 'path';
import moment from 'moment-timezone';
import queue from 'queue';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import pify from 'pify';
//import snappy from 'snappy';
import delay from 'delay';
import {ReadableStreamBuffer} from 'stream-buffers';
import {nowOrAgain,nowOrAgainPromise} from 'now-or-again';
import {v4} from 'uuid';
import timed from 'timed';
import onExit from 'signal-exit';
import collect from 'stream-collect';
import {StringDecoder} from 'string_decoder';
import timestring from 'timestring';
import {remove} from 'fs-promise';
import glob from 'glob';
import performanceNow from "performance-now";
import fsndjson from 'fs-ndjson'

const glob_ = pify(glob);

async function deleteOldFiles() {
  if (!cfg.deleteOldDays) return;
  for (let [type, olderThan] of Object.entries(cfg.deleteOldDays)) { 
    const end = moment().subtract(olderThan, 'days');
    const start = new Date('1980-01-01');
    const files = await whichFiles(type, start, end);
    for (let file of files) {
      await remove(file);
    }
  }
}

const DBG = process.env.DEBUG_TQL;

let opts = { max: 50000000
              , length: (n, key) => { return n.length }
              , dispose: (key, n) => { true; }
              , maxAge: 1000 * 60 * 60 }
const cache = LRU();

//const snappyCompressPromise = pify(snappy.compress);
const readFilePromise = pify(readFile);
const writeFilePromise = pify(writeFile);
const unlinkPromise = pify(unlink);
const dologPromise = pify(dolog);

let started = false;
let cfg = {path:process.cwd(), ext:'jsonl'};

let streams = {};
let lastAccessTime = {};
let lastWriteTime = {};
let lastUpdateTime = {};
let q = queue({concurrency:1});

let checkDelete = (cb) => {
  deleteOldFiles().catch(console.error);
  if (cb) cb();
}

checkDelete();

let lastCheckDelCall = 'never';

const chkaccess = (cb) => {
  for (let file in lastAccessTime) {
    let now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 900 &&
        now - lastWriteTime[file].getTime() > 1000) {
      streams[file].end();
      delete streams[file];
      delete lastAccessTime[file];
      lastWriteTime[file] = new Date();
    }
  }
  if (cb) cb();
}


function closeStreams() {
  for (let file in streams) {
    try {
      streams[file].end();
    } catch (e) { }
  }
}

function exitIfNoListeners() {
  console.log("timequerylog: SIGINT: trying to clean up fast.");
  if (process.listeners('SIGINT').length == 1)
    process.exit();
}

let _resExit = null;
let resolveCanExit = (resolveExit) => { _resExit = resolveExit; return _resExit; };
const _readyToExit = new Promise(resolveCanExit);

export function resetQueue() {
  q = queue({concurrency:1});
  started = false;
}

export async function drainQueue() {
  let len = 100;
  do {
    len = queueLength();
    await delay(10);
  } while (len > 0);
  for (let i=0; i<30;i++) {
    await delay(1);
  }
  await delay(10);
  resetQueue(); 
}


export function queueLength() {
  return q.length;
}

export function readyToExit() {
  return _readyToExit;
}

const cleanup = (code, signal) => {
  if (q.length>0) {
    console.log("timequerylog: queue length:",q.length);
    q.on('end', ()=> {
      console.log("timequerylog: closing streams");
      closeStreams();
      _resExit();
      exitIfNoListeners();
    });
  } else {
    closeStreams();
    _resExit();
    exitIfNoListeners();
  }
};

q.on('end', () => {
  setTimeout( () => {    
    nowOrAgain(chkaccess,'G');
    if (lastCheckDelCall == 'never') {
      lastCheckDelCall = Date.now();
      nowOrAgain(checkDelete,'G');
    } else if (Date.now()-lastCheckDelCall>60*1000*60*20) {
      lastCheckDelCall = Date.now();
      nowOrAgain(checkDelete,'G');
    }
  }, 1500);
});

//onExit(cleanup);
process.on('SIGINT', cleanup);

function dbg(m) {
  console.log(m);
}

export function config(conf) {
  Object.assign(cfg,conf);
  checkDelete();
}

export function whichFile(type, datetime) {
  let ext = '.jsonl';
  if (cfg.ext) ext = '.'+cfg.ext;
  //console.log('type =',type,'ext =',ext);
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

let c = 0;
let completed = 0;
let out = [];
let currentLogging = null;
let memlog = [];

process.on('tql', async () => {
  await currentLogging;
  c++;
  const {type, currentState, time} = out.pop();
  const cstr = c.toString();
  const newLogging = dologPromise(type, currentState, time);
  currentLogging = newLogging;
  await newLogging;
  completed++;
});

export function log(type,obj,time = new Date()) {
  //if (cfg.ignore && cfg.ignore == true) return;

  lastUpdateTime[type] = time;
  if (!obj.hasOwnProperty('time')) 
    obj.time = time;
  else
    time = obj.time;
  if (noRepeat(type)) {
    let copyTime = null;
    copyTime = new Date(obj.time.getTime());
    delete obj['time'];
    if (lastData.hasOwnProperty(type) && equal(lastData[type], obj)) {
      //obj.time = copyTime;      
      return;
    }
    lastData[type] = cloneDeep(obj);
    obj.time = copyTime;
  }
  const currentState = safeStringify(obj);
  delete obj['time'];
  q.push(cb => { 
    dolog(type, currentState, time, cb);
  });
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
  lastWriteTime[fname] = new Date();

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
    if (f.indexOf('.snappy')>0) return false;
    if (compressing[f]) return false;
    compressing[f] = true;
    const buffer = await readFilePromise(f);
    const compressed = await snappyCompressPromise(buffer);
    await writeFilePromise(f+'.snappy', compressed);
    await unlinkPromise(f);
  } catch (e) {
    console.error('Error in snappy compress:',e);
    compressing[f] = false;
    return true;
  }
  compressing[f] = false;
  return true;
}

const oldestSnappy = {};
let lastCompress = 0;

async function compressOld({type, time}) {
  if (compressing[type]) return;
  if (Date.now()-lastCompress < 1000) return;

  try {
    compressing[type] = true;
    lastCompress = Date.now();
    const end = moment(time).tz('UCT').subtract(1,'hours').toDate();;
    let start = new Date('1979-01-01');
    if (oldestSnappy[type]) start = oldestSnappy[type];
    let files = await whichFiles(type, start, end);
    files = files.filter( fname => !(fname.includes('.snappy')));
    for (let file of files) {
      let didIt = snappyCompress(type, file);
      if (didIt) oldestSnappy[type] = moment(end).subtract(2,'hours');
    }
    //await delay(500);
    compressing[type] = false;
  } catch (e) {
    console.error(e);
    compressing[type] = false;
    throw new Error('timequerylog problem compressing old files: '+e.message);
  }
}

function dolog(type, obj, time = new Date(), cb) {
  try {
    obj = JSON.parse(obj);
    let fname = whichFile(type, time);
    let toWrite = {time, type};
    for (let key in obj) toWrite[key] = obj[key];
    getWriteStreamExt(fname).then(stream => {
      stream.write(toWrite);
      if (cfg.snappy) {
        console.error("Snappy compression no longer supported, sorry (did not work correctly)" +
		      "Please remove 'snappy' config option from timequerylog and retry");
        //compressOld({type, time}).then(cb);
      } else {
        cb(null,null);
      }
    });
  } catch (e) {
    console.error(e);
    cb(null,null);
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
  result = result.filter( fname => !(extname(fname) != '.snappy' && result.includes(fname+'.snappy')) );
  return result;
}

function finishGetReadStreamExt(ext, input) {
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

function checkCache(fname, cb) {
  let cached = cache.get(fname);
  if (cached) {
   cb(cached);
   return;
  }
  fs.stat(fname, (er2, stat) => {
    const buf = new Buffer(stat.size);
    fs.open(fname, 'r', (er, fd) => {
      fs.read(fd, buf, 0, stat.size, 0, (e, bytes, buf2) => {
        snappy.uncompress(buf2, (err, uncompressed) => {
          cache.set(fname, uncompressed);
          cb(uncompressed);
        });
      });
    });
  });
}

const utf8Decoder = new StringDecoder('utf8');

function jsonlToArray(buffer) {
  let jsonl = utf8Decoder.end(buffer);
  let lines = jsonl.split("\n");
  let arr = [];
  for (let n=0; n<lines.length; n++)
    arr.push(JSON.parse(lines[n]));
  return arr;
}

function getReadStreamExt(fname, cb) {
  let ext = extname(fname), input = null;
  if (ext.indexOf('.snappy')>=0) {
    checkCache(fname, (uncompressed) => {
      cb(jsonlToArray(uncompressed));
      //input = new ReadableStreamBuffer({frequency:1,chunkSize:16000});
      //input.put(uncompressed);
      //input.stop();
      //fname = fname.replace('.snappy','');
      //ext = extname(fname);
      //cb(finishGetReadStreamExt(ext, input));
    });
  } else {
    input = createReadStream(fname);
    cb(finishGetReadStreamExt(ext, input));
  }
}

function matchRows({data, start, end, matchFunction}) {
  let results = [];
  for (let i=0; i<data.length; i++) {
    let r = data[i];
    r.time = new Date(r.time);
    if (r.time >= start && r.time <= end &&
       matchFunction(r))
      results.push(r);
  }
  return results;
}

async function filterFile(fname, start, end, matchFunction) {
  let data = await new Promise( res => {
    try {
      let results = [];
      let n = 0;
      getReadStreamExt(fname, (data) => {
        if (data.length)
          res(matchRows({data, start, end, matchFunction}));
        else {
          data.pipe(mapSync( row => {
            row.time = new Date(row.time);
            if (row.time >= start && row.time <= end &&
                matchFunction(row)) {
               results.push(row)
             return row;
            }
          }));
          data.on('end', () => { res(results);});
        }
      });
    } catch (e) {
      console.error('Error in filterFile:');
      console.error(inspect(e));
    }
  });
  return data;
}

async function fastFilterFile(fname, start, end, matchFunction) {
  let data = await fsndjson.readFile(fname)
  if (matchFunction == -1) return data
  let l = data.length

  let res = []

  for (let i=0; i<l; i++) {
    const row = data[i]
    row.time = new Date(row.time)
    if (row.time >= start && row.time <= end &&
        matchFunction(row))
      res.push(row)   
  }
  return res
}


export async function query(type, start, end, matchFunction = (d => true)) {
  let files = await whichFiles(type, start, end);
  let results = [];
  for (let fname of files) {
    try {
      let filtered = await filterFile(fname, start, end, matchFunction);
      for (let item of filtered) {
        results.push(item);
      }
    } catch (e) {
      console.trace(e);
      throw e;
    }
  }
  return results;
}

import {Readable} from 'stream';

class ChunkStream extends Readable {
  constructor(options) {
    options.objectMode = true;
    super(options);
    Object.assign(this, options);
    this.done = 0
    this.r = 0
  }
  
  next = async () => {
    if (this.files.length == 0) {
      this.push(null)
      return
    }
    let fname = this.files.shift()
    let {start, end, matchFunction} = this 
    let filtered = await fastFilterFile(fname, start, end, matchFunction);
    for (let item of filtered) {
      this.push(item)
    }
  } 
 
  _read = () => {
    this.next().catch(console.error)
  }  

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


class QueryStream extends Readable {
  constructor(options) {
    options.objectMode = true;
    super(options);
    Object.assign(this, options);
    this.initFinished = false;
    this.fileNum = 0;
  }

  init = async () => {
    this.files = await whichFiles(this.type, this.start, this.end);
    this.fileNum = 0;
    this.rowNum = 0;
    this.data = null;
    this.fileData = [];
    this.initFinished = true;
  }

  checkPreload = async () => {
    return;
    if (this.fileData.length > this.fileNum+8) return;
    let preloads = [];
    let xx = 0;
    for (let n=this.fileNum; n<this.files.length && n<this.fileNum+3; n++) {
      preloads.push( (async () => {
        xx++;
        this.fileData.push(await filterFile(this.files[n], this.start,
                                            this.end, this.match));
      })());
    }
    if (preloads.length ==0) {
      //console.log('no preloads.',{fileNum:this.fileNum,files:this.files.length});
    } else {
      await Promise.all(preloads);
    }
  }

  loadFile = async (f) => {
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
      let st = Date.now();
      if (this.fileData.length > this.fileNum) {
        this.data = this.fileData[this.fileNum++];
        if (this.data.length === 0) return await this.loadFile();
        return this.data;
      } else {
        result =  await filterFile(this.files[this.fileNum++], this.start,
                                   this.end, this.match);
        if (this.fileData.length == 0) await this.checkPreload();
        //console.log('filterFile elapsed',Date.now()-st,'ms');
        if (result.length === 0) return await this.loadFile();
      }
    } catch (e) {
      console.error('filterfile err in loadfile',e);
    }
    this.data = result;
    return result;
  }

  nextRow = async () => {
    try {
      if (!this.data) return null;
      if (this.rowNum >= this.data.length) {
        this.data = await this.loadFile();
        if (!this.data) return null;
      }
      const row = this.data[this.rowNum];
      this.rowNum++;
      return row;
    } catch (e) {
      console.error('nextRow issue', e);
    }
  }

  _read = () => {
    let id = v4();
    this.reading = new Promise( async (res) => {
      if (this.reading) {
        return true;
        await this.reading;
      }
      let canPush = true;
      let i = 0;
      do {
        try {
          if (!this.data) {
            this.data = await this.loadFile();
            this.row = await this.nextRow();
          } else {
            this.row = this.data[this.rowNum++];
          }
        } catch (e) { console.trace(e) };
        if (this.row === undefined) this.row = null;
        if (!(this.row===null)) {
          if (this.timeMS && this.row.time.getTime) this.row.time = this.row.time.getTime();
          if (this.map) this.row = this.map(this.row);
        } else {
        }
        canPush = this.push(this.row);
        if (this.data && (this.rowNum == this.data.length)) this.data = await this.loadFile();
      } while (this.row && canPush);
      return true;
    }).catch(console.error);
  }


}

export async function latest(type) {
  let start = new Date('01-01-1980');
  if (lastUpdateTime[type]) start = lastUpdateTime[type];
  let end = Date.now();
  let files = await whichFiles(type, start, end);
  if (!files || (files && files.length == 0)) return;
  let match = r => true;
  let data = await filterFile(files[files.length-1], start, end, match);
  let last = null;
  if (data) last = data[data.length-1];
  if (last) {
   //delete last.time;
   delete last.type;
   return last;
  }
}

export async function queryOpts(options) {
  let {type, start, end, match} = options;
  if (!match) options.match = (d=>true);
  options.matchFunction = options.match
  if (!end) options.end = new Date();
  if (!start) options.start = moment(end).subtract(30, 'minutes').toDate();
  options.files = await whichFiles(type, start, end);
  console.log({whichFiles:JSON.stringify(options.files)})
  const qs = new ChunkStream(options)
  if (options.csv) {
    const csvWriter = require('csv-write-stream');
    const obj2csv = csvWriter();
    qs.pipe(obj2csv);
    return obj2csv;
  } else {
    console.log('E')
    return qs;
  }
}

export async function getTypes(globPat) {
  let matchDirs = [];
  try {
    matchDirs = await glob_(`${cfg.path}/${globPat}_GMT`);
  } catch (e) {
    throw new Error('timequerylog error globbing for '+glob);
  }
  return matchDirs.map( dir => {
    dir = dir.replace(cfg.path,'');
    return dir.substr(1, dir.length-5);
  }); 
}

export function hrms() {
  return performanceNow() * 1000;
}

function byJSDate(a, b){
  if (a.time < b.time) return -1;
  if (a.time > b.time) return 1;
  if (a.hrtime && b.hrtime) {
    if (a.hrtime < b.hrtime) return -1;
    if (a.hrtime > b.hrtime) return 1;
    return 0;
  }
  return 0;
}

export async function queryMultiArray({typeGlob, start, end, match}) {
  if (!match) match = (d=>true);
  if (!end) end = new Date();
  if (!start) start = moment(end).subtract(30, 'minutes').toDate();
  const types = await getTypes(typeGlob);
  let all = [], calls = [];
  for (let type of types) {
    calls.push(query(type, start, end, match));
  }
  let results = await Promise.all(calls);
  for (let result of results)
    all = all.concat(result);
  all.sort(byJSDate);
  return all;
}

const incrs = {};

export async function incr(key, init = 0, load = false) {
  const fname = `${cfg.path}/${key}_INCR`;
  if (incrs[key]) {
    incrs[key];
    if (!load) incrs[key]++;
    await writeFilePromise(fname, incrs[key]);
    return incrs[key];
  } else {
    const exists = await pathExists(fname);
    if (!exists) {
      incrs[key] = init*1;
      await writeFilePromise(fname, init+"");
      return incrs[key];
    } else {
      let curr = 1*(await readFilePromise(fname));
      if (!load) curr += 1;
      incrs[key] = curr;
      await writeFilePromise(fname, curr+"");
      return curr;
    }
  }
}

export async function setIncr(key, val) {
  const fname = `${cfg.path}/${key}_INCR`;
  incrs[key] = val - 1;
  await writeFilePromise(fname, incrs[key]);
}

export function incrNow(key, init = 0) {
  if (incrs.hasOwnProperty(key)) {
    const result = incrs[key]+1;

    incr(key, init)
    .catch( (e) => {
      throw new Error("incrNow error: "+key+" "+e.message) 
    });
    return result;
  } else {
    throw new Error("incrNow error: not loaded. Call incr first. "+key);
  }
}

