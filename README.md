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

*config(opts)*

Set configuration options.  Defaults are: `{path: process.cwd(), noRepeat: false}`.
`noRepeat:{[type]:true}` makes it ignore rows that are duplicates (besides time).

*queryOpts({type, start, end, match = (d=>true), csv=false,map, timeMS=false})*

This query function takes an options object and returns either an objectMode stream or a CSV stream.
If `end` is not specified the current time is used.  If `start` is not specified then `end`-30 minutes is
used. `map` is an optional function to modify rows. `timeMS` will return time as MS since epoch.

```javascript
import {log, config, query, 
        queryOpts, queryRecent} from '../log';
import moment from 'moment';
import {inspect} from 'util';
import delay from 'delay';

config({path:process.cwd()+'/datalog',noRepeat:{req:true}});

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

  await delay(300);

  console.log('Running query');
  let rows = await query('req', moment("1995-12-25").toDate(), new Date(), d=>d.url);
  console.log('rows returned');
  console.log(inspect(rows));
  rows = await queryRecent('req');
  console.log('queryRecent result:');
  console.log(inspect(rows));

  const matched = queryOpts({type:'req', start: moment('1995-12-25').toDate(),
                             end: new Date(), match: d => d.dog||d.cat});
  console.log('queryOpts:');
  matched.on('data', console.log);

  let i = 0;
  const csvStream = queryOpts({type:'event', csv: true, timeMS: true,
                               map: (r) => r.row=i++; return r});
  csvStream.pipe(process.stdout);
}

test().catch(console.error);

```
