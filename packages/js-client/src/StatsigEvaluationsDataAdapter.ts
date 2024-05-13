import {
  DataAdapterAsyncOptions,
  DataAdapterCachePrefix,
  DataAdapterCore,
  DataAdapterResult,
  EvaluationsDataAdapter,
  StatsigUser,
  _getStorageKey,
} from '@statsig/client-core';

import Network from './Network';
import { StatsigOptions } from './StatsigOptions';

export class StatsigEvaluationsDataAdapter
  extends DataAdapterCore
  implements EvaluationsDataAdapter
{
  private _network: Network | null = null;
  protected override _options: StatsigOptions | null = null;

  constructor() {
    super('EvaluationsDataAdapter', 'evaluations');
  }

  override attach(sdkKey: string, options: StatsigOptions | null): void {
    super.attach(sdkKey, options);
    this._network = new Network(options ?? {});
  }

  getDataAsync(
    current: DataAdapterResult | null,
    user: StatsigUser,
    options?: DataAdapterAsyncOptions,
  ): Promise<DataAdapterResult | null> {
    return this._getDataAsyncImpl(current, user, options);
  }

  prefetchData(
    user: StatsigUser,
    options?: DataAdapterAsyncOptions,
  ): Promise<void> {
    return this._prefetchDataImpl(user, options);
  }

  protected override async _fetchFromNetwork(
    current: string | null,
    user?: StatsigUser,
    options?: DataAdapterAsyncOptions,
  ): Promise<string | null> {
    const result = await this._network?.fetchEvaluations(
      this._getSdkKey(),
      current,
      options?.priority,
      user,
    );
    return result ?? null;
  }

  protected override _getCacheKey(user?: StatsigUser): string {
    const key = _getStorageKey(
      this._getSdkKey(),
      user,
      this._options?.customUserCacheKeyFunc,
    );
    return `${DataAdapterCachePrefix}.${this._cacheSuffix}.${key}`;
  }
}
