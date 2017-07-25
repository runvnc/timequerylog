import {log,config, getTypes, hrms,
        queryMultiArray} from '../log';
import delay from 'delay';

config({path:'datalog'});

async function test() {
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

  await delay(1000);
  console.log('active requests:', process._getActiveRequests());
  console.log('active handles:', process._getActiveHandles());
}

test().catch(console.error);
