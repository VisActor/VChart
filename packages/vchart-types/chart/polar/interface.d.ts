import type { IPolarAxisSpec } from '../../component/axis/polar/interface';
import type { IPolarCrosshairSpec } from '../../component/crosshair/interface';
import type { IChartSpec } from '../../typings';
export interface IPolarChartSpec extends IChartSpec {
  axes?: IPolarAxisSpec[];
  crosshair?: IPolarCrosshairSpec | IPolarCrosshairSpec[];
}
