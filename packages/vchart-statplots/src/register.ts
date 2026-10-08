import { registerSwarmSeries } from './series/swarm/swarm';
import { registerHexbinSeries } from './series/hexbin/hexbin';
import { registerStripSeries } from './series/swarm/strip';
import { registerViolinSeries } from './series/violin/violin';

let registered = false;
/** 应用启动时调用；专用系列在这里统一注册。 */
export function registerStatPlots(): void {
  if (registered) {
    return;
  }
  registerViolinSeries();
  registerStripSeries();
  registerSwarmSeries();
  registerHexbinSeries();
  registered = true;
}
