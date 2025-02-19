import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISankeyChartSpec } from './interface';
import { registerSankeySeries } from '../../series/sankey/sankey';
import { Factory } from '../../core/factory';
import { SankeyChartSpecTransformer } from './sankey-transformer';
import type { Datum, MaybeArray } from '../../typings/common';
import type { ISeries } from '../../series/interface';
import type { IMark, IMarkGraphic } from '../../mark/interface/common';
import type { IRegionQuerier } from '../../typings/params';
import { isArray, isFunction } from '@visactor/vutils';
import { loadScrollbar } from '@visactor/vrender-components';
import { getDatumOfGraphic } from '../../util';

export class SankeyChart<T extends ISankeyChartSpec = ISankeyChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.sankey;
  static readonly seriesType: string = SeriesTypeEnum.sankey;
  static readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly type: string = ChartTypeEnum.sankey;
  readonly seriesType: string = SeriesTypeEnum.sankey;

  protected _setStateInDatum(
    stateKey: string,
    datum: MaybeArray<Datum> | null,
    filter?: (series: ISeries, mark: IMark) => boolean,
    region?: IRegionQuerier
  ) {
    const activeDatum = (isArray(datum) ? (datum as Datum[])[0] : datum) as Datum;
    if (!activeDatum) {
      this._interaction.clearByState(stateKey);
      return;
    }
    let activeNodeOrLink: IMarkGraphic = null;
    let activeMark: IMark = null;
    let activeSeries: ISeries = null;
    // 桑基图暂时只支持单选
    const keys = !activeDatum ? null : Object.keys(activeDatum);
    this.getRegionsInQuerier(region).forEach(r => {
      if (activeNodeOrLink) {
        return;
      }

      r.getSeries().forEach(s => {
        if (activeNodeOrLink) {
          return;
        }
        s.getMarksWithoutRoot().forEach(m => {
          if (m.type === 'text' || activeNodeOrLink) {
            return;
          }

          let pickElement = null;
          const graphics = m.getGraphics();
          if (!graphics || !graphics.length) {
            return;
          }
          if (!filter || (isFunction(filter) && filter(s, m))) {
            pickElement = graphics.find((e: any) =>
              keys.every(k => {
                let datum = (getDatumOfGraphic(e) as Datum)?.datum;

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
            if (m.getProductId().includes('node') || m.getProductId().includes('link')) {
              activeNodeOrLink = pickElement;
              activeMark = m;
              activeSeries = s;
            }
          }
        });
      });
    });

    if (activeNodeOrLink) {
      this._interaction.updateStateOfGraphics(stateKey, [activeNodeOrLink]);
      (activeSeries as any)._handleEmphasisElement?.({ item: activeNodeOrLink, mark: activeMark });
    }
  }
}

export const registerSankeyChart = () => {
  loadScrollbar();
  registerSankeySeries();

  Factory.registerChart(SankeyChart.type, SankeyChart);
};
