import 'babel-core';
import {log, query} from '../log';
import moment from 'moment';
import {inspect} from 'util';

async function test() {
  log('req',{blah:100});
  log('req',{url:'http://google.com'});
  setTimeout(async ()=> {
    console.log('Running query');
    let st = moment("1995-12-25").toDate();
    let en = new Date();
    try {
      let rows = await query('req', st, en, d => d.url);
      console.log('rows returned');
      console.log(inspect(rows));
    } catch (e) {
      console.error(e);
    }
  }, 10);
}

test().then(f=>console.log('done')).catch(e=>console.error(e));

