import {setIncr, incr, config, incrNow} from '../log';
import delay from 'delay';
import assert from 'assert';

config({path:'datalog'});

async function test() {
  let n = await incr('test2',undefined,true);
  console.log(n);
  n = await incr('test2');
  console.log(n);
  let m = await incr('test3',Date.now());
  console.log('m',m);
  m = await incr('test3');
  console.log('m',m);
  
  let imm = incrNow('test3');
  console.log('m',imm);

  const unixTime = Math.round(Date.now()/1000);
 
  await setIncr('test2', unixTime);
  console.log(unixTime, '==',await incr('test2'));
}

test().catch(console.error);
