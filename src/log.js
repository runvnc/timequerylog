import 'babel-core';
import 'babel-polyfill';
import {stringify, parse} from 'JSONStream';
import moment from 'moment';

let cfg = {path:process.cwd()};
let streams = {};
let lastAccessTime = {};

setInterval( () => {
  for (let file in lastAccessTime) {
    let now = new Date().getTime();
    if (now - lastAccessTime.getTime() > 20000) {
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
  return `${cfg.path}/${type_GMT}/${moment(datetime).format('YY-MM-DD/hhA')}`; 
}

export function log(type,obj,time = new Date()) {
  queue.push(cb => { dolog({type, obj, time}, cb);});  
}

function getWriteStream(fname, cb) {
  if (streams[fname]) {
    lastAccessTime[fname] = new Date();
    return streams[fname];
  }
  let fileStream = createWriteStream(fname); 
  let jsonStream = stringify();
  jsonStream.pipe(fileStream);
  streams[fname] = jsonStream;
  lastAccessTime[fname] = new Date();
  return jsonStream;
}

function dolog(type, obj, time = new Date(), cb) {
  let fname = whichFile(type, time);
  let toWrite = {time, type};
  for (let key of obj) toWrite[key] = obj[key];
  getWriteStream(fname, stream => {
    stream.write(toWrite);
    cb();
  }); 
}

/*
function dolog(type, obj, time = new Date(), cb) {
  let fname = whichFile(type, time);
  let found = await exists(fname);
  let str = JSON.stringify(obj);
  if (!found) {
    await appendFile(fname, `[${str}']'`);
    return;   
  }
  let status = await stat(fname);
  console.log(status);  
}
*/

export function whichFiles(type, start, end) {

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
