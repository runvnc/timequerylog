import timestring from 'timestring';
import {config, log, latest, query} from '../log';
import delay from 'delay';
import moment from 'moment-timezone';

config({path:'datalog'});

async function testDelOld() {
  const _101DaysAgo = moment().subtract(101, 'days').toDate();  
  const _99DaysAgo = moment().subtract(99, 'days').toDate();
  console.log(_101DaysAgo);
  log('request', {url:"http://deleteme.com/1"}, _101DaysAgo);
  log('request', {url:"http://keepme.com/2"}, _99DaysAgo);
  await delay(1000);
  config({deleteOldDays: { request: 100 } });
  await delay(5000);
  let left = await query('request', _101DaysAgo, new Date());
  console.log(left);
}

testDelOld().catch(console.error);
