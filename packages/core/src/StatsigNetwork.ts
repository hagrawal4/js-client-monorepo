// import { Monitored } from './Monitoring';
import { StoreValues } from './SpecStore';
import { StatsigEvent } from './StatsigEvent';
import { SDK_TYPE, SDK_VERSION } from './StatsigMetadata';
import { StatsigOptions } from './StatsigOptions';
import { StatsigUser } from './StatsigUser';

type StoreValues204 = {
  has_updates: false;
};

export default class StatsigNetwork {
  private _headers: Record<string, string>;

  constructor(
    sdkKey: string,
    private _options: StatsigOptions,
  ) {
    this._headers = {
      'Content-Type': 'application/json',
      'STATSIG-API-KEY': sdkKey,
      'STATSIG-SDK-TYPE': SDK_TYPE,
      'STATSIG-SDK-VERSION': SDK_VERSION,
    };
  }

  async fetchEvaluations(
    user: StatsigUser,
  ): Promise<StoreValues | StoreValues204> {
    const foo = await this._sendPostRequest(`${this._options.api}/initialize`, {
      user,
      hash: 'djb2',
    });

    return foo as StoreValues;
  }

  async sendEvents(events: StatsigEvent[]) {
    return await this._sendPostRequest('https://api.statsig.com/v1/rgstr', {
      events,
    });
  }

  private async _sendPostRequest<T>(
    url: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this._headers,
    });
    const text = await response.text();
    return JSON.parse(text) as T;
  }
}
