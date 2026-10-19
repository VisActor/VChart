import { registerSwarmSeries } from './series/swarm/swarm';
import { registerHexbinSeries } from './series/hexbin/hexbin';
import { registerStripSeries } from './series/swarm/strip';
import { registerViolinSeries } from './series/violin/violin';
import { registerMissingnessSeries } from './series/missingness/missingness';
import { registerCustomMark } from '@visactor/vchart';
import { registerMatrixLayout } from './layout/matrix';
import { registerHexbinLayout } from './layout/hexbin';

let registered = false;
/** 应用启动时调用；专用系列、布局与装饰在这里统一注册。 */
export function registerStatPlots(): void {
  if (registered) {
    return;
  }
  registerViolinSeries();
  registerStripSeries();
  registerSwarmSeries();
  registerHexbinSeries();
  registerMissingnessSeries();
  registerMatrixLayout();
  registerHexbinLayout();
  registerCustomMark();
  registered = true;
}
