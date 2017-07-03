import {config, getTypes, hrms,
        queryMultiArray} from '../log';

config({path:'datalog'});

async function test() {
  console.log("Current high-res time:", hrms());

  const types = await getTypes('*');
  console.log(types);
  const req = await getTypes('r*');
  console.log(req);
 
  const args = { typeGlob: '*', start: new Date('1980-01-01'),
                 end: Date.now() };
  const results = await queryMultiArray(args);
  console.log(results);
}

test().catch(console.error);
