

## Usage

### Log some data
```javascript
import {log from '../log'};

log('request', {url:'http://www.reddit.com/'});
```

### Query data with a timestamp after 1/1/1995 GMT
```javascript
import {query} from '../log';

query('request', new Date('01-01-1995'), new Date())
.then(rows => console.log(rows));
```

### Set directory for logging, don't repeat rows,
### use MessagePack format and compress with Snappy
###after 1 hour
```javascript
import {config} from '../log';

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

