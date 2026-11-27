import type { IText } from '@visactor/vrender-core';
import type { IMarkPointSpec } from '../../../src/component/marker/mark-point/interface';
import { ThemeManager } from '../../../src/theme';
import { VChart } from '../../../src/vchart-all';
import { createCanvas, removeDom } from '../../util/dom';

function getLabelFills(chart: VChart, label: string) {
  return chart
    .getStage()
    .findAll(node => {
      const graphic = node as IText;
      return graphic.type === 'text' && graphic.attribute.text === label;
    }, true)
    .map(node => (node as IText).attribute.fill);
}

const themeNames = ['mark-point-test-light', 'mark-point-test-dark'];

describe('markPoint theme', () => {
  let canvas: HTMLCanvasElement;
  let chart: VChart;
  let initialTheme: string;

  function createChart(markPoint: IMarkPointSpec[], theme?: string) {
    chart = new VChart(
      {
        type: 'line',
        animation: false,
        data: {
          values: [
            { x: 'A', y: 1 },
            { x: 'B', y: 3 },
            { x: 'C', y: 2 }
          ]
        },
        xField: 'x',
        yField: 'y',
        markPoint
      },
      { renderCanvas: canvas, theme }
    );
    chart.renderSync();
  }

  function defaultMarker(): IMarkPointSpec {
    return {
      coordinate: { x: 'A', y: 1 },
      itemContent: { type: 'text', offsetY: -20, text: { text: 'default' } }
    };
  }

  beforeEach(() => {
    initialTheme = ThemeManager.getCurrentThemeName();
    canvas = createCanvas();
    canvas.width = 500;
    canvas.height = 400;
  });

  afterEach(() => {
    chart?.release();
    removeDom(canvas);
    ThemeManager.setCurrentTheme(initialTheme);
    themeNames.forEach(name => ThemeManager.removeTheme(name));
  });

  it('uses the current theme when first rendered in dark mode', () => {
    createChart([defaultMarker()], 'dark');

    expect(getLabelFills(chart, 'default')).toEqual(['#fdfdfd']);
  });

  it('refreshes the default text color without replacing the chart or overriding explicit colors', async () => {
    createChart([
      defaultMarker(),
      {
        coordinate: { x: 'B', y: 3 },
        itemContent: { type: 'text', offsetY: -20, text: { text: 'legacy', style: { fill: '#e03131' } } }
      },
      {
        coordinate: { x: 'C', y: 2 },
        itemContent: { type: 'text', offsetY: -20, text: { text: 'unified' }, style: { fill: '#087f5b' } }
      }
    ]);

    const chartModel = chart.getChart();
    const markers = chartModel.getAllComponents().filter(component => component.type === 'markPoint');
    for (const [theme, color] of [
      ['light', '#21252c'],
      ['dark', '#fdfdfd'],
      ['light', '#21252c']
    ]) {
      await chart.setCurrentTheme(theme);

      expect(chart.getChart()).toBe(chartModel);
      const currentMarkers = chartModel.getAllComponents().filter(component => component.type === 'markPoint');
      expect(currentMarkers).toHaveLength(3);
      currentMarkers.forEach((marker, index) => expect(marker).toBe(markers[index]));
      expect(getLabelFills(chart, 'default')).toEqual([color]);
      expect(getLabelFills(chart, 'legacy')).toEqual(['#e03131']);
      expect(getLabelFills(chart, 'unified')).toEqual(['#087f5b']);
    }
  });

  it('keeps formatted text in the rendered label after switching themes', async () => {
    createChart([
      {
        ...defaultMarker(),
        itemContent: {
          type: 'text',
          offsetY: -20,
          text: {
            text: 'fallback',
            formatMethod: (_markData, seriesData) => `${seriesData.length} rows`
          }
        }
      }
    ]);

    expect(getLabelFills(chart, '3 rows')).toEqual(['#21252c']);

    await chart.setCurrentTheme('dark');
    expect(getLabelFills(chart, '3 rows')).toEqual(['#fdfdfd']);
  });

  it('refreshes the rendered text style when the marker theme supplies the color', async () => {
    (['light', 'dark'] as const).forEach((type, index) => {
      const name = themeNames[index];
      ThemeManager.registerTheme(name, {
        name,
        type,
        component: {
          markPoint: {
            itemContent: {
              text: { style: { fill: { type: 'palette', key: 'primaryFontColor' } } }
            }
          }
        }
      });
    });
    ThemeManager.setCurrentTheme(themeNames[0]);
    createChart([defaultMarker()]);
    expect(getLabelFills(chart, 'default')).toEqual(['#21252c']);

    await chart.setCurrentTheme(themeNames[1]);
    expect(getLabelFills(chart, 'default')).toEqual(['#fdfdfd']);
  });
});
