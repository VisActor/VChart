import type { IChartSpec } from '../../typings/spec/common';
import type { IPolarAxisSpec } from '../../component/axis/polar/interface';
import type { IGaugePointerSeriesSpec, IGaugeSeriesSpec } from '../../series/gauge';
import type { ILinearAxisSpec } from '../../component/axis/interface';
import type { ICircularProgressSeriesSpec } from '../../series/progress/circular/interface';
export interface IGaugeChartSpec extends IChartSpec, Omit<IGaugePointerSeriesSpec, 'data' | 'type' | 'morph'> {
    type: 'gauge';
    gauge?: Omit<IGaugeSeriesSpec, 'data'> | Omit<ICircularProgressSeriesSpec, 'data'>;
    axes?: (IPolarAxisSpec | ILinearAxisSpec)[];
}
