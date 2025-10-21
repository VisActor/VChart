/**
 * @description vchart 自定义组件，用于实现柱图、线图以及面积图的系列标签
 * @author zhangweixing
 */

import { AbstractComponent } from '@visactor/vrender-components';
import { array, get, isEmpty, regressionPolynomial } from '@visactor/vutils';
import type { Datum, ICartesianSeries, ISpec } from '@visactor/vchart';
import { Direction, Factory, SeriesTypeEnum, STACK_FIELD_END } from '@visactor/vchart';
import { type IGraphic, createLine, createArea } from '@visactor/vrender-core';
import type { BarRegressionLineAttrs, BarRegressionLineSpec } from './type';
import type { RegressionLineData } from '../regression-line/type';

export const BAR_REGRESSION_LINE = 'barRegressionLine';

export class BarRegressionLine extends AbstractComponent<Required<BarRegressionLineAttrs>> {
  name = BAR_REGRESSION_LINE;
  protected render() {
    this.removeAllChild();
    const { data, label, line = {}, confidenceInterval = {} } = this.attribute as BarRegressionLineAttrs;
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
        lineShape.name = 'bar-regression-line';
        this.add(lineShape);
      }

      if (confidenceInterval.visible !== false) {
        const areaShape = createArea({
          points: d.area,
          ...confidenceInterval.style
        });
        areaShape.name = 'bar-regression-area';
        this.add(areaShape);
      }
    });
  }
}

export const registerBarRegressionLine = () => {
  Factory.registerGraphicComponent(
    BAR_REGRESSION_LINE,
    (attrs: Required<BarRegressionLineAttrs>) => new BarRegressionLine(attrs) as unknown as IGraphic
  );
};

/**
 * 获取系列标签的 spec 配置
 * @param position 显示位置
 * @param config 系列标签的样式配置
 * @returns
 */
export function getBarRegressionLineConfig(config: Omit<BarRegressionLineSpec, 'visible'>) {
  const { color, line, confidenceInterval } = config;
  return {
    type: 'component',
    componentType: BAR_REGRESSION_LINE,
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

            const data = s.getViewData().latestData;
            const fieldX = s.fieldX?.[0];
            const fieldY = s.fieldY?.[0];
            const isHorizontal = s.direction === Direction.horizontal;
            const groups = s.getRawDataStatisticsByField(fieldX).values;

            if (isHorizontal || !fieldX || !fieldY || !data || data.length <= 2 || groups.length <= 2) {
              return;
            }
            const { evaluateGrid, confidenceInterval } = regressionPolynomial(
              data,
              (datum: Datum) => groups.indexOf(datum?.[fieldX]),
              (datum: Datum) => datum?.[fieldY],
              { degree: config.degree }
            );
            const N = groups.length;
            const lineData = evaluateGrid(N);
            const confidenceData = confidenceInterval(N);
            const halfBandWidth = s.getXAxisHelper().getBandwidth(0) / 2;

            regressionData.push({
              line: lineData.map((ld: Datum) => {
                const d = { [fieldX]: groups[ld.x], [fieldY]: ld.y };
                return {
                  x: s.dataToPositionX(d) + region.x + halfBandWidth,
                  y: s.dataToPositionY(d) + region.y
                };
              }),
              area: confidenceData.map((c: Datum) => {
                const d = { [fieldX]: groups[c.x], [fieldY]: c.lower };
                return {
                  x: s.dataToPositionX(d) + region.x + halfBandWidth,
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

export function appendBarRegressionLineConfig(chartSpec: ISpec, spec?: BarRegressionLineSpec) {
  (chartSpec as any).customMark = array((chartSpec as any).customMark).filter(
    (obj: any) => obj.componentType !== BAR_REGRESSION_LINE
  );

  if (!spec) {
    spec =
      get(chartSpec, BAR_REGRESSION_LINE) ??
      get(
        chartSpec.series?.find(s => s.type === SeriesTypeEnum.bar),
        BAR_REGRESSION_LINE
      ) ??
      {};
  }
  if (spec.visible !== false) {
    const { visible, ...rest } = spec;
    (chartSpec as any).customMark.push(getBarRegressionLineConfig(rest));
  }
}
