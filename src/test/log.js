import 'babel-core';
import {log, query} from '../log';

console.log(1);

async function test() {
  log('req',{blah:10});
  log('req',{url:'http://google.com'});
}

test().then(f=>console.log('done')).catch(e=>console.error(e));

