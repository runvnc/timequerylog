import {config, latest} from '../log';

config({path:process.cwd()+'/datalodg',
        snappy:1});


async function test() {
  let data = await latest('event');
  console.log(data);
}

test().catch(console.error);
