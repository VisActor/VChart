/**
 * @description vchart 自定义组件，用于实现柱图、线图以及面积图的系列标签
 * @author zhangweixing
 */

import { AbstractComponent } from '@visactor/vrender-components';
import { array, get, isEmpty, kde, ecdf, last } from '@visactor/vutils';
import type { Datum, ICartesianSeries, ISpec } from '@visactor/vchart';
import { Factory, SeriesTypeEnum } from '@visactor/vchart';
import { type IGraphic, type IText, createText, createLine, createArea } from '@visactor/vrender-core';
import type { HistogramRegressionLineAttrs, HistogramRegressionLineSpec } from './type';
import type { RegressionLineData } from '../regression-line/type';

export const HISTOGRAM_REGRESSION_LINE = 'histogramRegressionLine';

export const getRegressionByType = (type: 'kde' | 'ecdf', data: number[]) => {
  switch (type) {
    case 'kde':
      return kde(data);
    case 'ecdf':
      return ecdf(data);
  }
};

export class HistogramRegressionLine extends AbstractComponent<Required<HistogramRegressionLineAttrs>> {
  name = HISTOGRAM_REGRESSION_LINE;
  protected render() {
    this.removeAllChild();
    const { data, line = {} } = this.attribute as HistogramRegressionLineAttrs;
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
        lineShape.name = 'histogram-regression-line';
        this.add(lineShape);
      }
    });
  }
}

export const registerHistogramRegressionLine = () => {
  Factory.registerGraphicComponent(
    HISTOGRAM_REGRESSION_LINE,
    (attrs: Required<HistogramRegressionLineAttrs>) => new HistogramRegressionLine(attrs) as unknown as IGraphic
  );
};

/**
 * 获取系列标签的 spec 配置
 * @param position 显示位置
 * @param config 系列标签的样式配置
 * @returns
 */
export function getHistogramRegressionLineConfig(
  type: 'kde' | 'ecdf',
  config: Omit<HistogramRegressionLineSpec, 'visible' | 'type'>
) {
  const { line } = config;
  return {
    type: 'component',
    componentType: HISTOGRAM_REGRESSION_LINE,
    interactive: false,
    zIndex: 500, // 高于柱子
    style: {
      data: (datum: any, ctx: any) => {
        const vchart = ctx.vchart;
        const chart = vchart.getChart();
        const series = chart.getAllSeries().filter((s: any) => s.type === SeriesTypeEnum.bar) as ICartesianSeries[];
        const regressionData: RegressionLineData[] = [];

        // 必须存在散点图系列
        if (series && series.length) {
          series.forEach(s => {
            const region = s.getRegion().getLayoutStartPoint();

            const rawData = (s as any)._rawData;
            const data = rawData?.rawData;
            const binTransform = rawData.transformsArr?.find((t: any) => t.type === 'bin');
            const fieldX = s.fieldX?.[0];
            const scaleY = s.getYAxisHelper().getScale(0);

            if (!data || !data.length || !binTransform || !binTransform.options?.field || !scaleY) {
              return;
            }
            const simpleData = data.map((entry: Datum) => entry[binTransform.options.field]);
            const { evaluateGrid } = getRegressionByType(type, simpleData);
            const N = Math.min(3, Math.floor(simpleData.length / 4));
            const lineData = evaluateGrid(N);
            const yRange = scaleY.range();
            const y0 = yRange[0];
            const y1 = last(yRange);
            const getY = (r: number) => y0 + (y1 - y0) * r;

            regressionData.push({
              line: lineData.map((ld: Datum) => {
                const d = { [fieldX]: ld.x };
                return {
                  x: s.dataToPositionX(d) + region.x,
                  y: getY(ld.y) + region.y
                };
              })
            });
          });
        }

        return regressionData;
      },
      line
    }
  };
}

export function appendHistogramRegressionLineConfig(chartSpec: ISpec, spec?: HistogramRegressionLineSpec) {
  (chartSpec as any).customMark = array((chartSpec as any).customMark).filter(
    (obj: any) => obj.componentType !== HISTOGRAM_REGRESSION_LINE
  );

  if (!spec) {
    spec =
      get(chartSpec, HISTOGRAM_REGRESSION_LINE) ??
      get(
        chartSpec.series?.find(s => s.type === SeriesTypeEnum.bar),
        HISTOGRAM_REGRESSION_LINE
      ) ??
      {};
  }
  if (spec.visible !== false) {
    const { type, ...rest } = spec;
    (chartSpec as any).customMark.push(getHistogramRegressionLineConfig(type, rest));
  }
}
