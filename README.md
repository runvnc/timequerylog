Note: May require babel-polyfill or babel-runtime to be included in your project.

JSON logging separated into a files per hour of day with simple query between start and end time with match function.

## Usage

```javascript
import {log, query, queryRecent} from '../log';
import moment from 'moment';
import {inspect} from 'util';
import delay from 'delay';

async function test() {
  log('req',{blah:100});
  log('req',{url:'http://google.com'});

  await delay(300);

  console.log('Running query');
  let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
  console.log('rows returned');
  console.log(inspect(rows));
  rows = await queryRecent('req');
  console.log('queryRecent result:');
  console.log(inspect(rows));
}

test().catch(console.error);

```
