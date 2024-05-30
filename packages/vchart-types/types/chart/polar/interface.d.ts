import type { IPolarAxisSpec } from '../../component/axis/polar/interface';
import type { IPolarCrosshairSpec } from '../../component/crosshair/interface';
import type { IChartSpec, ILayoutRect, IPoint } from '../../typings';
export interface IPolarChartSpec extends IChartSpec {
    axes?: IPolarAxisSpec[];
    crosshair?: IPolarCrosshairSpec | IPolarCrosshairSpec[];
    layoutRadius?: 'auto' | number | ((layoutRect: ILayoutRect, center: IPoint) => number);
}
