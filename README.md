JSON logging separated into a files per hour of day with simple query between start and end time with match function.

## Usage

*log(type, object, time = current time)*

Uses JSON stream to log some data to the file `./[type]_GMT/DATE/HOUR`.
Returns a promise.


*queryRecent(type)*

Return a promise with data from the last 30 minutes for `type`.  Searches JSON streamed files starting 
from directory `./[type]_GMT`.

*query(type, startDate, endDate, matchFunction)*

Returns a promise with data for `type` between `startDate` and `endDate` where `matchFunction`
returns true. Searches JSON streamed files starting from directory `./[type]_GMT`.


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
