import {config, log, query, queryRecent,
        queryOpts} from '../log';
import moment from 'moment';
import {inspect} from 'util';
import delay from 'delay';

config({path:process.cwd()+'/datalog', noRepeat:{req:true}});

async function test() {
  log('req',{blah:100});
  log('req',{url:'http://google.com'});

  log('req',{cat:100}, new Date('2015-05-01T23:50:59.392Z'));
  log('req',{cat:100}, new Date('2015-05-01T23:51:53.312Z'));
  log('req',{dog:1000});
  log('req',{dog:1000});
  log('req',{dog:1000});

  log('event', {category: 'science', action:'new'});
  log('event', {category: 'general', action:'edit'});
  log('event', {category: 'general', action:'edit'});

  await delay(300);

  console.log('Running query');
  let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
  console.log('rows returned');
  console.log(inspect(rows));
  rows = await queryRecent('req',);
  console.log('queryRecent result:');
  console.log(inspect(rows));

  const matched = queryOpts({type:'req', start: moment('1995-12-25').toDate(),
                             end: new Date(), match: d => d.dog||d.cat});
  console.log('queryOpts:');
  matched.on('data', console.log);

  //let i = 0;
  //const csvStream = queryOpts({type:'event', csv: true, timeMS: true,
  //                             map: (r)=>{r.row = i++;return r}});
  //csvStream.pipe(process.stdout);
}

test().catch(console.error);

