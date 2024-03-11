import { Text, View } from 'react-native';

import { OnDeviceEvaluationsClient } from '@statsig/on-device-evaluations';
import {
  StatsigProviderRN,
  useExperiment,
  useGate,
  warmCachingFromAsyncStorage,
} from '@statsig/react-native-bindings';

import { DEMO_CLIENT_KEY } from './Constants';

const user = { userID: 'a-user' };

const client = new OnDeviceEvaluationsClient(DEMO_CLIENT_KEY);
const warming = warmCachingFromAsyncStorage(client);

function Content() {
  const gate = useGate('a_gate', { user });
  const experiment = useExperiment('an_experiment', { user });

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: 'bold' }}>On Device Evaluations Example</Text>
      <Text>OnDeviceEvaluationsClient status: {client.loadingStatus}</Text>
      <Text>
        a_gate: {gate.value ? 'Pass' : 'Fail'} ({gate.details.reason})
      </Text>
      <Text>an_experiment: {JSON.stringify(experiment.value)}</Text>
    </View>
  );
}

export default function OnDeviceEvaluationsExample(): JSX.Element {
  return (
    <StatsigProviderRN client={client} cacheWarming={warming}>
      <Content />
    </StatsigProviderRN>
  );
}
