import { StatsigUser } from 'statsig-node';

import { getStatsigValues } from '../../../../utils/statsig-server';

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as { user: StatsigUser };
  const values = await getStatsigValues(body.user);
  return new Response(values);
}
