import {incr,config} from '../log';
import delay from 'delay';
import assert from 'assert';

config({path:'datalog'});

async function test() {
  let n = await incr('test2');
  console.log(n);
  n = await incr('test2');
  console.log(n);
  let m = await incr('test3',Date.now());
  console.log(m);
  m = await incr('test3');
  console.log(m);
}

test().catch(console.error);
