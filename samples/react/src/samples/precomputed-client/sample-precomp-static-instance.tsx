/* eslint-disable @typescript-eslint/no-unused-vars */
// <snippet>
import { StatsigClient } from '@statsig/js-client';

// </snippet>
import { STATSIG_CLIENT_KEY as YOUR_CLIENT_KEY } from '../../Contants';

// prettier-ignore
export default async function Sample(): Promise<void> {
// <snippet>
const user = { userID: 'a-user' };
const client = new StatsigClient(YOUR_CLIENT_KEY, user);
client.initializeSync();

// then later, at some other point in your code base
if (StatsigClient.instance().checkGate('a_gate')) {
  // show new  feature
}

// Note: When multiple instances are present you can use the SDK key to fetch a specific instance
const aSpecificClient = StatsigClient.instance(YOUR_CLIENT_KEY);
// </snippet>
}
