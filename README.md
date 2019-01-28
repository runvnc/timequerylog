(See also `tql-cli` command line tool.)

JSONL (newline-separated JSON) logging separated into a files per hour of day with simple query 
between start and end time with match function.

The idea is to make it more efficient to query logs for a specific time period 
or type of data/event by breaking up the files in a consistent way.

You may want to use sub-types to break out data to improve efficiency when the 
sub-type data doesn't always need to be queried immediately.
For example, instead of logging all details of an `error` type you may log 
a main `error` type with the core details of errors and a separate `error-details` 
type including info such as stack traces.

## Usage

### Log some data
```javascript
import {log} from 'timequerylog';

log('request', {url:'http://www.reddit.com/'});
```

### Read last record for a type

```javascript
import {latest} from 'timequerylog';
latest('request').then(row => console.log(row));
```

### Query data with a timestamp after 1/1/1995 GMT
```javascript
import {query} from 'timequerylog';

query('request', new Date('01-01-1995'), new Date())
.then(rows => console.log(rows));
```

### Set directory for logging, don't repeat rows
```javascript
import {config} from 'timequerylog';

config({path:process.cwd()+'/datalog', noRepeat: true});
```

### Log using a different time than the present
```javascript
log('req',{cat:100}, new Date('2015-05-01T23:50:59.392Z'));
```

### Query logs from last 30 minutes matching function
```javascript
query('req', null, null, d => d.amount > 1000).then(console.log);
```

### Return logs as an object mode stream
```javascript
const matched = queryOpts({type:'request', start: new Date('2016-10-22 10:00 AM'),
                           end: new Date('2016-10-23')});
matched.on('data', console.log);
```

### Match, map results, convert time to MS since epoch, and return CSV text stream
```javascript
  let i = 0;
  const csvStream = queryOpts({type:'event', csv: true, timeMS: true,
                               match: r => r.category == 'update',
                               start: new Date('1995-12-25'),
                               map: (r)=>{r.row = i++;return r}});
  csvStream.pipe(process.stdout);
```

### Increment
```javascript
  let n = await incr('test'); // n = 1
  n = await incr('test'); // n = 2
  let m = await incr('test2',Date.now()) 
  // if m was not previously incremented
  // then m is Date.now()
  // otherwise previous m + 1

  const unixTime = Math.round(Date.now()/1000));
  // actually saves unixTime - 1
  await setIncr('test2', unixTime);
  n = await incr('test2');
  // n == unixTime

  // need to load first with async call
  let load = incr('test3',Date.now());
  // loaded into memory, can now incr in memory
  // and save after immediate return
  let imm = incrNow('test3');
  // if the process is killed suddenly
  // without Node.js events completing, may not save
  // updated value..

```

### getTypes, queryMultiArray, high res time (hrms)
```javascript
async function testMulti() {
  console.log("Current high-res time:", hrms());

  const types = await getTypes('*');
  console.log(types);
  const req = await getTypes('r*');
  console.log(req);
 
  log('testhr', {n:'tom',hrtime:hrms()});
  log('testhr', {n:'bob',hrtime:hrms()});
  await delay(10);
  const args = { typeGlob: '*', start: new Date('1980-01-01'),
                 end: Date.now() };
  const results = await queryMultiArray(args);
  console.log(results);
}
```



# Functions/Options

*log(type, object, time = current time)*

Uses JSON stream to log some data to the file `./[type]_GMT/DATE/HOUR`.
Returns a promise.

*queryRecent(type)*

Return a promise with data from the last 30 minutes for `type`.  Searches JSON streamed files starting 
from directory `./[type]_GMT`.

*query(type, startDate, endDate, matchFunction)*

Returns a promise with data for `type` between `startDate` and `endDate` where `matchFunction`
returns true. Searches JSONL files starting from directory `./[type]_GMT`.

*config(opts)*

Set configuration options.  Defaults are: `{path: process.cwd(), noRepeat: false},`
`noRepeat:{[type]:true}` makes it ignore rows that are duplicates (besides time).

To delete files older than X days, specify 
`config({path:'datalog'}, deleteOldDays: {event: 100}}`) -- 
deletes old 'event' type files 100 days or older.

*queryOpts({type, start, end, match = (d=>true), csv=false,map, timeMS=false})*

This query function takes an options object and returns either an objectMode stream or a CSV stream.
If `end` is not specified the current time is used.  If `start` is not specified then `end`-30 minutes is
used. `map` is an optional function to modify rows. `timeMS` will return time as MS since epoch.

*incr(key, init=0)* or *incrNow(key, init) (non-promise version)*

Increment `key` and return new value. Stored in file `key_INCR`. Optionally init at some number.
If you await`incr(key,undefined,true)` first to load you can use the immediate (non-async) `incrNow` to update the value in memory without waiting for the file save to complete storing the new number.

*setIncr(key, val)*

Set counter for `key` to `val-1` so next call to `incr(key)` returns `val`.
