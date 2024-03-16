import fetchMock from 'jest-fetch-mock';

import {
  DynamicConfig,
  FeatureGate,
  Layer,
  StatsigClientEventData,
} from '@statsig/client-core';
import { StatsigClient } from '@statsig/js-client';
import { LocalOverrideAdapter } from '@statsig/js-local-overrides';

describe('Local Overrides - StatsigClient', () => {
  const user = { userID: 'a-user' };

  let client: StatsigClient;
  let overrideAdapter: LocalOverrideAdapter;
  let emissions: StatsigClientEventData[];

  beforeAll(() => {
    fetchMock.enableMocks();
    fetchMock.mockResponse('{}');

    overrideAdapter = new LocalOverrideAdapter();
    client = new StatsigClient('', user, { overrideAdapter });

    client.on('*', (data) => {
      if (data.event.endsWith('_evaluation')) {
        emissions.push(data);
      }
    });

    client.initializeSync();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  describe('FeatureGate Overrides', () => {
    let gate: FeatureGate;

    beforeAll(() => {
      fetchMock.mock.calls = [];
      emissions = [];

      overrideAdapter.overrideGate('a_gate', true);
      gate = client.getFeatureGate('a_gate');

      void client.flush();
    });

    it('got the overridden value', () => {
      expect(gate.value).toBe(true);
    });

    it('has the eval reason to "LocalOverride"', () => {
      expect(gate.details.reason).toBe('LocalOverride');
    });

    it('emits the correct client event', () => {
      const emission = emissions[0] as any;
      expect(emission.event).toBe('gate_evaluation');
      expect(emission.gate.details.reason).toBe('LocalOverride');
      expect(emission.gate.value).toBe(true);
    });

    it('logged an event with reason set to "LocalOverride"', () => {
      const [url, payload] = fetchMock.mock.calls[0];
      expect(url).toContain('https://api.statsig.com/v1/rgstr');

      const body = JSON.parse(String(payload?.body)) as any;
      const event = body.events[0];
      expect(event.metadata.gate).toBe('a_gate');
      expect(event.metadata.reason).toBe('LocalOverride');
    });
  });

  describe('DynamicConfig Overrides', () => {
    let config: DynamicConfig;

    beforeAll(() => {
      fetchMock.mock.calls = [];
      emissions = [];

      overrideAdapter.overrideDynamicConfig('a_config', { a_string: 'foo' });
      config = client.getDynamicConfig('a_config');

      void client.flush();
    });

    it('got the overridden value', () => {
      expect(config.value).toEqual({ a_string: 'foo' });
    });

    it('has the eval reason to "LocalOverride"', () => {
      expect(config.details.reason).toBe('LocalOverride');
    });

    it('emits the correct client event', () => {
      const emission = emissions[0] as any;
      expect(emission.event).toBe('dynamic_config_evaluation');
      expect(emission.dynamicConfig.details.reason).toBe('LocalOverride');
      expect(emission.dynamicConfig.value).toEqual({ a_string: 'foo' });
    });

    it('logged an event with reason set to "LocalOverride"', () => {
      const [url, payload] = fetchMock.mock.calls[0];
      expect(url).toContain('https://api.statsig.com/v1/rgstr');

      const body = JSON.parse(String(payload?.body)) as any;
      const event = body.events[0];
      expect(event.metadata.config).toBe('a_config');
      expect(event.metadata.reason).toBe('LocalOverride');
    });
  });

  describe('Layer Overrides', () => {
    let layer: Layer;
    let layerValue: unknown;

    beforeAll(() => {
      fetchMock.mock.calls = [];
      emissions = [];

      overrideAdapter.overrideLayer('a_layer', { a_string: 'foo' });
      layer = client.getLayer('a_layer');
      layerValue = layer.getValue('a_string');

      void client.flush();
    });

    it('got the overridden value', () => {
      expect(layerValue).toEqual('foo');
    });

    it('has the eval reason to "LocalOverride"', () => {
      expect(layer.details.reason).toBe('LocalOverride');
    });

    it('emits the correct client event', () => {
      const emission = emissions[0] as any;
      expect(emission.event).toBe('layer_evaluation');
      expect(emission.layer.details.reason).toBe('LocalOverride');
      expect(emission.layer._value).toEqual({ a_string: 'foo' });
    });

    it('logged an event with reason set to "LocalOverride"', () => {
      const [url, payload] = fetchMock.mock.calls[0];
      expect(url).toContain('https://api.statsig.com/v1/rgstr');

      const body = JSON.parse(String(payload?.body)) as any;
      const event = body.events[0];
      expect(event.metadata.config).toBe('a_layer');
      expect(event.metadata.reason).toBe('LocalOverride');
    });
  });
});
