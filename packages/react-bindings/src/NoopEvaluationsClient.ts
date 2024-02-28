import {
  DynamicConfig,
  Experiment,
  FeatureGate,
  Layer,
  OnDeviceEvaluationsInterface,
  PrecomputedEvaluationsInterface,
  makeDynamicConfig,
  makeFeatureGate,
  makeLayer,
} from '@statsig/client-core';

const noop = (): void => {
  // noop
};

const defaultEvaluation = <T>(type: 'gate' | 'config' | 'layer') => {
  return (...args: unknown[]): T => {
    const name = typeof args[0] === 'string' ? args[0] : (args[1] as string);

    switch (type) {
      case 'gate':
        return makeFeatureGate(name, 'Error') as T;
      case 'config':
        return makeDynamicConfig(name, 'Error') as T;
      case 'layer':
        return makeLayer(name, 'Error') as T;
    }
  };
};

const client: OnDeviceEvaluationsInterface &
  PrecomputedEvaluationsInterface & { isNoop: true } = {
  isNoop: true,
  loadingStatus: 'Uninitialized',
  initialize: () => Promise.resolve(),
  shutdown: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  checkGate: () => false,
  getFeatureGate: defaultEvaluation<FeatureGate>('gate'),
  getDynamicConfig: defaultEvaluation<DynamicConfig>('config'),
  getExperiment: defaultEvaluation<Experiment>('config'),
  getLayer: defaultEvaluation<Layer>('layer'),
  logEvent: noop,
  on: noop,
  off: noop,
};

export const NoopEvaluationsClient = client;
