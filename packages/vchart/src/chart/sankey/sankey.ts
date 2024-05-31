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
import { isArray, isFunction } from '@visactor/vutils';

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
    const keys = !activeDatum ? null : Object.keys(activeDatum);
    this.getRegionsInQuerier(region).forEach(r => {
      if (!activeDatum) {
        r.interaction.clearEventElement(stateKey, true);
        return;
      }
      let hasPick = false;
      r.getSeries().forEach(s => {
        let activeNodeOrLink = null;

        s.getMarksWithoutRoot().forEach(m => {
          if (m.type === 'text') {
            return;
          }

          let pickElement = null;
          const mark = m.getProduct();
          if (!mark) {
            return;
          }
          if (!filter || (isFunction(filter) && filter(s, m))) {
            pickElement = mark.elements.find((e: any) =>
              keys.every(k => {
                let datum = e.getDatum()?.datum;

                if (isArray(datum)) {
                  // data of link
                  datum = datum[0];
                }

                // eslint-disable-next-line eqeqeq
                return activeDatum[k] == datum?.[k];
              })
            );
          }
          if (pickElement) {
            hasPick = true;
            r.interaction.startInteraction(stateKey, pickElement);

            if (mark.id().includes('node') || mark.id().includes('link')) {
              activeNodeOrLink = pickElement;
            }
          }
        });

        if (activeNodeOrLink) {
          (s as any)._handleEmphasisElement?.({ item: activeNodeOrLink });
        }
      });
      if (checkReverse && hasPick) {
        r.interaction.reverseEventElement(stateKey);
      }
    });
  }
}

export const registerSankeyChart = () => {
  registerSankeySeries();
  Factory.registerChart(SankeyChart.type, SankeyChart);
};
