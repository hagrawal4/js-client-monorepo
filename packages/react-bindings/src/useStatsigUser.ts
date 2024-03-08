import { StatsigUser } from '@statsig/client-core';

import useStatsigPrecomputedEvaluationsClient from './useStatsigPrecomputedEvaluationsClient';

export type UseStatsigUserResult = {
  user: StatsigUser;
  updateUser: (fn: (prevState: StatsigUser) => StatsigUser) => void;
};

export default function (): UseStatsigUserResult {
  const client = useStatsigPrecomputedEvaluationsClient();

  return {
    user: client.getCurrentUser(),
    updateUser: (fn: (prevState: StatsigUser) => StatsigUser) => {
      const user = fn(client.getCurrentUser());
      client.updateUser(user);
    },
  };
}
