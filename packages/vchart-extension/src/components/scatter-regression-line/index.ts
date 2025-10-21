/**
 * @description vchart 自定义组件，用于实现柱图、线图以及面积图的系列标签
 * @author zhangweixing
 */

import { AbstractComponent } from '@visactor/vrender-components';
import {
  array,
  get,
  isEmpty,
  regressionLinear,
  regressionLogistic,
  regressionLowess,
  regressionPolynomial
} from '@visactor/vutils';
import type { Datum, ICartesianSeries, ISpec } from '@visactor/vchart';
import { Factory, SeriesTypeEnum } from '@visactor/vchart';
import { type IGraphic, type IText, createText, createLine, createArea } from '@visactor/vrender-core';
import type { ScatterRegressionLineAttrs, ScatterRegressionLineSpec } from './type';
import type { RegressionLineData } from '../regression-line/type';

export const SCATTER_REGRESSION_LINE = 'scatterRegressionLine';

export const getRegressionByType = (
  type: 'linear' | 'logisitc' | 'lowess' | 'polynomial',
  data: any[],
  x: (d: any) => number = d => d.x,
  y: (d: any) => number = d => d.y,
  degree?: number
) => {
  switch (type) {
    case 'logisitc':
      return regressionLogistic(data, x, y);
    case 'lowess':
      return regressionLowess(data, x, y);
    case 'polynomial':
      return regressionPolynomial(data, x, y, { degree });
    default:
      return regressionLinear(data, x, y);
  }
};

export class ScatterRegressionLine extends AbstractComponent<Required<ScatterRegressionLineAttrs>> {
  name = SCATTER_REGRESSION_LINE;
  protected render() {
    this.removeAllChild();
    const { data, label, line = {}, confidenceInterval = {} } = this.attribute as ScatterRegressionLineAttrs;
    if (isEmpty(data)) {
      return;
    }

    data.forEach(d => {
      if (line.visible !== false) {
        const lineShape = createLine({
          points: d.line,
          lineWidth: 1,
          ...line.style
        });
        lineShape.name = 'scatter-regression-line';
        this.add(lineShape);
      }

      if (confidenceInterval.visible !== false) {
        const areaShape = createArea({
          points: d.area,
          ...confidenceInterval.style
        });
        areaShape.name = 'scatter-regression-area';
        this.add(areaShape);
      }
    });
  }
}

export const registerScatterRegressionLine = () => {
  Factory.registerGraphicComponent(
    SCATTER_REGRESSION_LINE,
    (attrs: Required<ScatterRegressionLineAttrs>) => new ScatterRegressionLine(attrs) as unknown as IGraphic
  );
};

/**
 * 获取系列标签的 spec 配置
 * @param position 显示位置
 * @param config 系列标签的样式配置
 * @returns
 */
export function getScatterRegressionLineConfig(
  type: 'linear' | 'logisitc' | 'lowess' | 'polynomial',
  config: Omit<ScatterRegressionLineSpec, 'visible' | 'type'>
) {
  const { color, line, confidenceInterval } = config;
  return {
    type: 'component',
    componentType: SCATTER_REGRESSION_LINE,
    interactive: false,
    style: {
      data: (datum: any, ctx: any) => {
        const vchart = ctx.vchart;
        const chart = vchart.getChart();
        const series = chart.getAllSeries().filter((s: any) => s.type === SeriesTypeEnum.scatter) as ICartesianSeries[];
        const regressionData: RegressionLineData[] = [];

        // 必须存在散点图系列
        if (series && series.length) {
          series.forEach(s => {
            const region = s.getRegion().getLayoutStartPoint();

            const data = s.getViewData().latestData;
            const fieldX = s.fieldX?.[0];
            const fieldY = s.fieldY?.[0];

            if (!fieldX || !fieldY || !data || data.length <= 2) {
              return;
            }
            const { evaluateGrid, confidenceInterval } = getRegressionByType(
              type,
              data,
              (datum: Datum) => datum?.[fieldX],
              (datum: Datum) => datum?.[fieldY],
              config.polynomialDegree
            );
            const N = Math.min(3, Math.floor(data.length / 4));
            const lineData = evaluateGrid(N);
            const confidenceData = confidenceInterval(N);

            regressionData.push({
              line: lineData.map((ld: Datum) => {
                const d = { [fieldX]: ld.x, [fieldY]: ld.y };
                return {
                  x: s.dataToPositionX(d) + region.x,
                  y: s.dataToPositionY(d) + region.y
                };
              }),
              area: confidenceData.map((c: Datum) => {
                const d = { [fieldX]: c.x, [fieldY]: c.lower };
                return {
                  x: s.dataToPositionX(d) + region.x,
                  y: s.dataToPositionY(d) + region.y,
                  y1: s.dataToPositionY({ [fieldY]: c.upper }) + region.y
                };
              })
            });
          });
        }

        return regressionData;
      },
      line: {
        ...line,
        style: {
          stroke: color,
          ...line?.style
        }
      },
      confidenceInterval: {
        ...confidenceInterval,
        style: {
          fill: color,
          fillOpacity: 0.2,
          ...confidenceInterval?.style
        }
      }
    }
  };
}

export function appendScatterRegressionLineConfig(chartSpec: ISpec, spec?: ScatterRegressionLineSpec) {
  (chartSpec as any).customMark = array((chartSpec as any).customMark).filter(
    (obj: any) => obj.componentType !== SCATTER_REGRESSION_LINE
  );

  if (!spec) {
    spec =
      get(chartSpec, SCATTER_REGRESSION_LINE) ??
      get(
        chartSpec.series?.find(s => s.type === SeriesTypeEnum.scatter),
        SCATTER_REGRESSION_LINE
      ) ??
      {};
  }
  if (spec.visible !== false) {
    const { type, ...rest } = spec;
    (chartSpec as any).customMark.push(getScatterRegressionLineConfig(type, rest));
  }
}
