import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface/type';
import { registerFunnel3dSeries } from '../../../series/funnel/3d/funnel-3d';
import { Factory } from '../../../core/factory';
import type { IFunnel3dChartSpec } from '../interface';
import type { AdaptiveSpec } from '../../../typings';
import { FunnelChartSpecTransformer } from '../funnel-transformer';
import { BaseChart } from '../../base';
import { register3DPlugin } from '../../../plugin/other';
import { modifyOuterLabels } from '../util';

export class Funnel3dChart<T extends IFunnel3dChartSpec = IFunnel3dChartSpec> extends BaseChart<
  AdaptiveSpec<T, 'type'>
> {
  static readonly type: string = ChartTypeEnum.funnel3d;
  static readonly seriesType: string = SeriesTypeEnum.funnel3d;
  static readonly transformerConstructor = FunnelChartSpecTransformer;
  readonly transformerConstructor = FunnelChartSpecTransformer;
  readonly type: string = ChartTypeEnum.funnel3d;
  readonly seriesType: string = SeriesTypeEnum.funnel3d;

  init(): void {
    super.init();

    // 漏斗图的outerlabel实现非常特殊，需要等label组件更新完成后才能更新，这里手动的改变顺序
    modifyOuterLabels(this.getCompiler().getRootMarks());
  }
}

export const registerFunnel3dChart = () => {
  register3DPlugin();
  registerFunnel3dSeries();
  Factory.registerChart(Funnel3dChart.type, Funnel3dChart);
};
