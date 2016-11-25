import {config, log, query, queryRecent,
        queryOpts} from '../log';
import moment from 'moment';
import {inspect} from 'util';
import delay from 'delay';

config({path:process.cwd()+'/datalog', noRepeat:{req:true},
        ext:'msp', snappy:1});

async function test() {
/*  log('req',{blah:100});
  log('req',{url:'http://google.com'});

  log('req',{cat:100}, new Date('2015-05-01T23:50:59.392Z'));
  log('req',{cat:100}, new Date('2015-05-01T23:51:53.312Z'));
  log('req',{dog:1000});
  log('req',{dog:1000});
  log('req',{dog:1000});
 */
/*  log('event', {category: 'science', action:'new'}, new Date('2015-05-01 00:00:00 GMT'));
  await delay(4500);
  log('event', {category: 'general', action:'edit'});
  log('event', {category: 'general', action:'update'});

  await delay(3300);*/

  /*console.log('Running query');
  let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
  console.log('rows returned');
  console.log(inspect(rows));
  rows = await queryRecent('req',);
  console.log('queryRecent result:');
  console.log(inspect(rows));

  const matched = queryOpts({type:'req', start: moment('1995-12-25').toDate(),
                             end: new Date(), match: d => d.dog||d.cat});
  console.log('queryOpts:');
  matched.on('data', console.log); */
  console.log(1);

  let i = 0;
  const csvStream = queryOpts({type:'event', csv: true, timeMS: true,
                               start: moment('1995-12-25').toDate(),
                               map: (r)=>{r.row = i++;return r}});
  csvStream.pipe(process.stdout);
  console.log(2);
}

test().catch(console.error);

