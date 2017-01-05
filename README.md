JSONL (newline-separated JSON) (or MessagePack/Snappy) logging separated into a files per hour of day with simple query 
between start and end time with match function.

The idea is to make it more efficient to query logs for a specific time period 
or type of data/event by breaking up the files in a consistent way.
Using MessagePack and/or Snappy can significantly reduce the disk usage.

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

### Query data with a timestamp after 1/1/1995 GMT
```javascript
import {query} from 'timequerylog';

query('request', new Date('01-01-1995'), new Date())
.then(rows => console.log(rows));
```

### Set directory for logging, don't repeat rows,
### use MessagePack format and compress with Snappy
### after 1 hour
```javascript
import {config} from 'timequerylog';

config({path:process.cwd()+'/datalog', noRepeat: true,
        ext:'msp', snappy:1});
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

Set configuration options.  Defaults are: `{path: process.cwd(), noRepeat: false},
{ext:'jsonl'`}.`noRepeat:{[type]:true}` makes it ignore rows that are duplicates (besides time).
`ext:'msp'` makes it store data in MessagePack format. To compress (and automatically decompress)
with Snappy, use `snappy: 1`.

*queryOpts({type, start, end, match = (d=>true), csv=false,map, timeMS=false})*

This query function takes an options object and returns either an objectMode stream or a CSV stream.
If `end` is not specified the current time is used.  If `start` is not specified then `end`-30 minutes is
used. `map` is an optional function to modify rows. `timeMS` will return time as MS since epoch.

