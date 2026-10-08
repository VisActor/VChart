import { MarkTypeEnum } from '@visactor/vchart';
import type { Datum, IChart, ICustomMarkGroupSpec } from '@visactor/vchart';
import type { CorrelationMatrixSpec } from './types';
import type { continuousColorScale } from '../../common/colors';
import { paletteColor } from '../../common/theme';

const titles = { pearson: 'Pearson r', spearman: 'Spearman ρ', kendall: 'Kendall τ' };
const ticks = [-1, -0.5, 0, 0.5, 1];
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
export function createCorrelationColorBar(
  spec: CorrelationMatrixSpec,
  scale: ReturnType<typeof continuousColorScale>
): ICustomMarkGroupSpec {
  const color = paletteColor(spec.theme, 'primaryFontColor');
  const stops = scale.range.map((color, i) => ({ offset: (scale.domain[i] + 1) / 2, color }));
  return {
    type: MarkTypeEnum.group,
    name: 'correlation-colorbar',
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
        name: 'correlation-colorbar-title',
        style: {
          text: titles[spec.method],
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
        name: 'correlation-colorbar-rail',
        style: {
          x: 0,
          y: titleHeight,
          width: barWidth,
          height: (_datum: Datum, context: MarkContext) => barHeight(context),
          fill: { gradient: 'linear', x0: 0, y0: 1, x1: 0, y1: 0, stops },
          pickable: false
        }
      },
      ...ticks.flatMap(value => [
        {
          type: 'rule' as const,
          name: 'correlation-colorbar-rule',
          style: {
            x: barWidth,
            x1: barWidth + 4,
            y: (_datum: Datum, context: MarkContext) => titleHeight + ((1 - value) / 2) * barHeight(context),
            y1: (_datum: Datum, context: MarkContext) => titleHeight + ((1 - value) / 2) * barHeight(context),
            stroke: color,
            lineWidth: 1,
            pickable: false
          }
        },
        {
          type: 'text' as const,
          name: 'correlation-colorbar-tick',
          style: {
            text: String(value).replace('-', '−'),
            x: barWidth + 10,
            y: (_datum: Datum, context: MarkContext) => titleHeight + ((1 - value) / 2) * barHeight(context),
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
