import { registerFunnelSeries } from './../../series/funnel/funnel';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { Factory } from '../../core/factory';
import type { IFunnelChartSpec } from './interface';
import { FunnelChartSpecTransformer } from './funnel-transformer';
import { BaseChart } from '../base';
import { modifyOuterLabels } from './util';

export class FunnelChart<T extends IFunnelChartSpec = IFunnelChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.funnel;
  static readonly seriesType: string = SeriesTypeEnum.funnel;
  static readonly transformerConstructor = FunnelChartSpecTransformer;
  readonly transformerConstructor = FunnelChartSpecTransformer;
  readonly type: string = ChartTypeEnum.funnel;
  readonly seriesType: string = SeriesTypeEnum.funnel;

  init(): void {
    super.init();

    // 漏斗图的outerlabel实现非常特殊，需要等label组件更新完成后才能更新，这里手动的改变顺序
    modifyOuterLabels(this.getCompiler().getRootMarks());
  }
}

export const registerFunnelChart = () => {
  registerFunnelSeries();
  Factory.registerChart(FunnelChart.type, FunnelChart);
};
