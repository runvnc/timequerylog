import {config, log, query, queryRecent} from '../log';
import moment from 'moment';
import {inspect} from 'util';
import delay from 'delay';

config({path:process.cwd(), noRepeat:true});

async function test() {
  log('req',{blah:100});
  log('req',{url:'http://google.com'});

  log('req',{cat:100, time: new Date('2015-05-01T23:50:59.392Z')});
  log('req',{cat:100, time: new Date('2015-05-01T23:51:53.312Z')});
  log('req',{dog:1000});
  log('req',{dog:1000});
  log('req',{dog:1000});

  await delay(300);

  console.log('Running query');
  let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
  console.log('rows returned');
  console.log(inspect(rows));
  rows = await queryRecent('req',);
  console.log('queryRecent result:');
  console.log(inspect(rows));
}

test().catch(console.error);

