import { useContext, useMemo } from 'react';
import StatsigContext from './StatsigContext';
import { StatsigUser } from '@statsig/core';

export type GateResult = {
  value: boolean;
};

type CheckGateOptions = {
  logExposure: boolean;
  user: StatsigUser | null;
};

export default function (
  gateName: string,
  options: CheckGateOptions = { logExposure: true, user: null },
): GateResult {
  const { client } = useContext(StatsigContext);

  const value = useMemo(() => {
    if ('updateUser' in client) {
      return client.checkGate(gateName);
    }

    if (options.user == null) {
      console.log(
        'StatsigUser not provided for Local Evaluation. Returning default value.',
      );
      return false;
    }

    return client.checkGate(options.user, gateName);
  }, [client.loadingStatus, options]);

  return {
    value,
  };
}
