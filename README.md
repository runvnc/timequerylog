Note: Requires babel-polyfill to be included in your project.

JSON logging separated into a files per hour of day with simple query between start and end time with match function.

## Usage

```javascript

import 'babel-core';
import {log, query, queryRecent} from 'timequerylog';
import moment from 'moment';

async function test() {
  log('req',{blah:100});
  log('req',{url:'http://google.com'});

  setTimeout(async ()=> {
    let st = moment("1995-12-25").toDate();
    let en = new Date();

    try {
      let rows1 = await query('req', st, en, d => d.url);
      rows2 = await query('req', st, en);
      rows3 = await queryRecent('req');
      console.log(rows1, rows2, rows3);
    } catch (e) {
      console.error(e);
    }
  }, 10);
}

test().then(f=>console.log('done')).catch(e=>console.error(e));

```
