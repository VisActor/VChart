import { MarkTypeEnum } from '@visactor/vchart';
import type { Datum, IChart, ICustomMarkGroupSpec } from '@visactor/vchart';
import type { BaseSpec } from './types';
import type { continuousColorScale } from './colors';
import { paletteColor } from './theme';

export interface MatrixColorBarOptions {
  name: 'correlation-colorbar' | 'confusion-colorbar';
  title: string;
  ticks: readonly number[];
  formatTick: (value: number) => string;
}
const titleHeight = 24;
const barWidth = 12;
type MarkContext = Record<string, unknown>;

function getRegion(context: MarkContext) {
  return (context.chart as IChart).getAllRegions()[0];
}

function barHeight(context: MarkContext): number {
  const height = getRegion(context).getLayoutRect().height;
  return Math.min(height * 0.6, Math.max(0, height - titleHeight));
}

/** 静态装饰共用矩阵的色标；坐标依赖最终 region，resize 无需额外更新。 */
export function createMatrixColorBar(
  spec: BaseSpec,
  scale: ReturnType<typeof continuousColorScale>,
  options: MatrixColorBarOptions
): ICustomMarkGroupSpec {
  const color = paletteColor(spec.theme, 'primaryFontColor');
  const min = scale.domain[0];
  const max = scale.domain[scale.domain.length - 1];
  const stops = scale.range.map((color, i) => ({ offset: (scale.domain[i] - min) / (max - min), color }));
  return {
    type: MarkTypeEnum.group,
    name: options.name,
    style: {
      pickable: false,
      childrenPickable: false,
      x: (_datum: Datum, context: MarkContext) => {
        const region = getRegion(context);
        return region.getLayoutStartPoint().x + region.getLayoutRect().width + 16;
      },
      y: (_datum: Datum, context: MarkContext) => {
        const region = getRegion(context);
        return region.getLayoutStartPoint().y + (region.getLayoutRect().height - barHeight(context) - titleHeight) / 2;
      },
      visible: (_datum: Datum, context: MarkContext) => getRegion(context).getLayoutRect().height > titleHeight
    },
    children: [
      {
        type: 'text',
        name: `${options.name}-title`,
        style: {
          text: options.title,
          maxLineWidth: 80,
          ellipsis: true,
          x: 0,
          y: 0,
          fill: color,
          fontSize: 11,
          textAlign: 'left',
          textBaseline: 'top',
          pickable: false
        }
      },
      {
        type: 'rect',
        name: `${options.name}-rail`,
        style: {
          x: 0,
          y: titleHeight,
          width: barWidth,
          height: (_datum: Datum, context: MarkContext) => barHeight(context),
          fill: { gradient: 'linear', x0: 0, y0: 1, x1: 0, y1: 0, stops },
          pickable: false
        }
      },
      ...options.ticks.flatMap(value => [
        {
          type: 'rule' as const,
          name: `${options.name}-rule`,
          style: {
            x: barWidth,
            x1: barWidth + 4,
            y: (_datum: Datum, context: MarkContext) =>
              titleHeight + ((max - value) / (max - min)) * barHeight(context),
            y1: (_datum: Datum, context: MarkContext) =>
              titleHeight + ((max - value) / (max - min)) * barHeight(context),
            stroke: color,
            lineWidth: 1,
            pickable: false
          }
        },
        {
          type: 'text' as const,
          name: `${options.name}-tick`,
          style: {
            text: options.formatTick(value),
            x: barWidth + 10,
            y: (_datum: Datum, context: MarkContext) =>
              titleHeight + ((max - value) / (max - min)) * barHeight(context),
            fill: color,
            fontSize: 11,
            textAlign: 'left' as const,
            textBaseline: 'middle' as const,
            pickable: false
          }
        }
      ])
    ]
  };
}
