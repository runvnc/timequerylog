import 'babel-core';
import 'babel-polyfill';
import {inspect} from 'util';
import {stringify, parse} from 'JSONStream';
import {createWriteStream} from 'fs';
import {dirname} from 'path';
import {sync as mkdirp} from 'mkdirp';
import pathExists from 'path-exists';
import moment from 'moment';
import queue from 'queue';

let cfg = {path:process.cwd()};
let streams = {};
let lastAccessTime = {};
let q = queue({concurrency:1});

setInterval( () => {
  for (let file in lastAccessTime) {
    let now = new Date().getTime();
    if (now - lastAccessTime[file].getTime() > 20000) {
      streams[file].close();
      delete streams[file];
      delete lastAccessTime[file];
    }
  }  
}, 15000);

export function config(cfg) {
  cfg = cfg;
}

export function whichFile(type, datetime) {
  let gmt = moment(datetime).utcOffset(0);
  return `${cfg.path}/${type}_GMT/${gmt.format('YY-MM-DD/hhA')}`; 
}

export function log(type,obj,time = new Date()) {
  q.push(cb => { dolog(type, obj, time, cb);});  
  q.start(e=> { console.error('Error running queue: ', e)});
}

function getWriteStream(fname, cb) {
  console.log(fname);
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return cb(streams[fname]);
  }
  console.log('not found streams is', inspect(streams));
  pathExists(dirname(fname), exists => {
    if (!exists) mkdirp(dirname(fname)); 
    let fileStream = createWriteStream(fname); 
    let jsonStream = stringify();
    jsonStream.pipe(fileStream);
    streams[fname] = jsonStream;
    lastAccessTime[fname] = new Date();
    return cb(jsonStream);
  });
}

function dolog(type, obj, time = new Date(), cb) {
  let fname = whichFile(type, time);
  let toWrite = {time, type};
  for (let key in obj) toWrite[key] = obj[key];
  getWriteStream(fname, stream => {
    stream.write(toWrite);
    cb();
  }); 
}

export function whichFiles(type, start, end) {
  let endMS = moment(end).valueOf;
  let st = moment(start);
  let result = [];
  for (let offset = 0; st.add(offset,'m').valueOf() <= endMS; offset+=30) {
    let fname = whichFile(st.add(offset,'m').toDate());
    if (!(fname in result)) result.push(fname);
  }
  return result;
}

export async function query(type, start, end, matchFunction) {
  // return an array for simplicity? 
  // could also return a stream
  // get a list of days
  // and a list of hours in that time period
  //
}

// query it
// try to 
// find order ids that are missing
// in pnl report
// show recent requests
// color-coded
