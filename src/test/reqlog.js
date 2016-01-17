import 'babel-core';
import {log, query} from '../reqlog';

console.log(1);

async function test() {
  log('req',{blah:10});
}

test().then(f=>console.log('done')).catch(e=>console.error(e));

