import 'babel-core';
import 'babel-polyfill';
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

export function config(cfg) {
  cfg = cfg;
}

export function whichFile(type, datetime) {
  let gmt = moment(datetime).utcOffset(0);
  return `${cfg.path}/${type}_GMT/${gmt.format('YYYY-MM-DD/hhA')}`; 
}

export function log(type,obj,time = new Date()) {
  q.push(cb => { dolog(type, obj, time, cb);});  
  q.start(e=> { 
    if (e) console.error('Error running queue: ', e)
  });
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
  let fname = whichFile(type, time);
  let toWrite = {time, type};
  for (let key in obj) toWrite[key] = obj[key];
  getWriteStream(fname, stream => {
    stream.write(toWrite);
    cb();
  }); 
}

export async function whichFiles(type, start, end) {
  // read all files in type_GMT/dt
  // sort by time
  // for each
  // check if date is between start and end
  // if so
  // add to results
  let st = moment(start).valueOf();
  let dirs = [];
  try {
    dirs = await fs.readdir(`${cfg.path}/${type}_GMT`);
  } catch (e) {
    return [];
  }
  dirs = dirs.sort( (a, b) => {
    const dt = d => moment(d,'YYYY-MM-DD');
    if (dt(a).valueOf() < dt(b).valueOf()) return -1;
    if (dt(a).valueOf() > dt(b).valueOf()) return 1;
    return 0;
  });
  dirs = dirs.filter( d => moment(d, 'YYYY-MM-DD').valueOf() >= st );
  if (dirs.length === 0) return [];
  console.log('dirs is ', dirs);
  for (let dir of dirs) {
    try {
      let files = await fs.readdir(`${cfg.path}/${type}_GMT/${dir}`);
       
    } catch (e) {
      return [];
    }
  }
  let result = [];
  //if (!(result.indexOf(fname)>=0)) result.push(fname);
  //console.log('whichfiles returning ', result);
  return result;
}

async function filterFile(fname, matchFunction) {
  console.log('filter file fname = ', fname);
  let data = await new Promise( res => {
    try {
      let results = [];
      let file = createReadStream(fname);
      let stream = parse();
      stream.pipe(es.mapSync( data => {
        if (data.start >= start && data.end <= end &&
            matchFunction(data)) {
          results.push(data)
          return data;
        }
      }));
      stream.on('end', () => { res(results)});
    } catch (e) {
      console.error(inspect(e));
    }
  });
  return data;
}
 
export async function query(type, start, end, matchFunction) {
  let files = await whichFiles(type, start, end);
  let results = [];
  for (let fname of files) {
    results.push(await filterFile(fname, matchFunction));
  }
  return results;
}

// query it
// try to 
// find order ids that are missing
// in pnl report
// show recent requests
// color-coded
