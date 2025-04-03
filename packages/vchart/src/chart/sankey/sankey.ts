import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISankeyChartSpec } from './interface';
import { registerSankeySeries } from '../../series/sankey/sankey';
import { Factory } from '../../core/factory';
import { SankeyChartSpecTransformer } from './sankey-transformer';
import type { Datum, MaybeArray } from '../../typings/common';
import type { ISeries } from '../../series/interface';
import type { IMark } from '../../mark/interface/common';
import type { IRegionQuerier } from '../../typings/params';
import { isArray } from '@visactor/vutils';
import { loadScrollbar } from '@visactor/vrender-components';

export class SankeyChart<T extends ISankeyChartSpec = ISankeyChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.sankey;
  static readonly seriesType: string = SeriesTypeEnum.sankey;
  static readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly type: string = ChartTypeEnum.sankey;
  readonly seriesType: string = SeriesTypeEnum.sankey;

  protected _setStateInDatum(
    stateKey: string,
    checkReverse: boolean,
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) {
    // 桑基图暂时只支持单选
    const activeDatum = isArray(datum) ? datum[0] : datum;
    const markFilter = (series: ISeries, mark: IMark) => {
      return mark.type !== 'text' && mark.getProduct() && (!filter || filter(series, mark));
    };

    this.filterGraphicsByDatum(activeDatum, {
      filter: markFilter,
      region,
      getDatum: e => {
        let d = e.getDatum()?.datum;

        if (isArray(d)) {
          // data of link
          d = d[0];
        }
        return d;
      },
      callback: (element, mark, s, r) => {
        const id = mark.getProduct()?.id();
        if (id && (id.includes('node') || id.includes('link'))) {
          (s as any)._handleEmphasisElement?.({ item: element });
        }
      },
      regionCallback: (elements, r) => {
        if (!activeDatum) {
          r.interaction.clearEventElement(stateKey, true);
          return;
        } else if (elements.length) {
          elements.forEach(e => {
            r.interaction.startInteraction(stateKey, e);
          });

          if (checkReverse) {
            r.interaction.reverseEventElement(stateKey);
          }
        }
      }
    });
  }
}

export const registerSankeyChart = () => {
  loadScrollbar();
  registerSankeySeries();

  Factory.registerChart(SankeyChart.type, SankeyChart);
};
