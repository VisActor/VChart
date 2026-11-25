import { verifyRendered, verifySourceSpec } from '../../helpers.mjs';
import { interactionFrame } from '../../interaction-helpers.mjs';

/**
 * 验证目的：火山蓝切换到亮色后，复用的柱图图元与直接创建亮色时的样式一致。
 * 场景条件：火山蓝使用渐变填充及描边，额外配置亮色主题未定义的圆角。
 * 最终检查：切换前后的样式有实际变化，图表、系列 mark 和柱图图元均被复用。
 */
export default {
  createSpec() {
    return {
      type: 'bar',
      data: {
        values: [
          { category: 'A', value: 9, group: 'Alpha' },
          { category: 'B', value: 15, group: 'Beta' },
          { category: 'C', value: 12, group: 'Alpha' }
        ]
      },
      xField: 'category',
      yField: 'value',
      seriesField: 'group',
      bar: { style: { fillOpacity: 0.8 } }
    };
  },
  async exercise(page) {
    await page.evaluate(async () => {
      const { VChart, __visualChart: vchart } = window;
      const chart = vchart.getChart();
      const mark = chart.getAllSeries()[0].getSeriesMark();
      const readStyles = () =>
        mark.getGraphics().map(({ attribute: { fill, stroke, lineWidth, cornerRadius, fillOpacity } }) => ({
          fill,
          stroke,
          lineWidth,
          cornerRadius,
          fillOpacity
        }));
      // 测试宿主直接以默认亮色创建图表，在切换前记录亮色参考样式。
      const lightStyles = readStyles();
      const graphics = mark.getGraphics().slice();
      const gradient = (datum, context) => ({
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 1,
        stops: [
          { offset: 0, color: context.seriesColor(datum.group) },
          { offset: 1, color: 'transparent' }
        ]
      });
      VChart.ThemeManager.registerTheme('volcanoBlue', {
        background: '#0C0929',
        colorScheme: { default: ['#5B8FF9', '#70D6A3'] },
        series: {
          bar: { bar: { style: { fill: gradient, stroke: gradient, lineWidth: 2, cornerRadius: 6 } } }
        }
      });
      await vchart.setCurrentTheme('volcanoBlue');
      window.__volcanoToLight = { chart, mark, graphics, lightStyles, volcanoStyles: readStyles() };
      await vchart.setCurrentTheme('light');
    });
    await interactionFrame(page);
  },
  async verify(page) {
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const { __visualChart: vchart, __volcanoToLight: samples } = window;
      const chart = vchart.getChart();
      const mark = chart.getAllSeries()[0].getSeriesMark();
      const graphics = mark.getGraphics();
      if (
        samples.lightStyles.length !== 3 ||
        samples.volcanoStyles.length !== 3 ||
        samples.volcanoStyles.some(
          ({ fill, stroke, lineWidth, cornerRadius, fillOpacity }) =>
            fill?.gradient !== 'linear' ||
            stroke?.gradient !== 'linear' ||
            lineWidth !== 2 ||
            cornerRadius !== 6 ||
            fillOpacity !== 0.8
        )
      ) {
        throw assertionError('火山蓝主题未实际应用渐变、描边和圆角，或覆盖了 spec 中的透明度');
      }
      if (
        vchart.getCurrentThemeName() !== 'light' ||
        chart !== samples.chart ||
        mark !== samples.mark ||
        graphics.length !== samples.graphics.length ||
        graphics.some((graphic, index) => graphic !== samples.graphics[index])
      ) {
        throw assertionError('切换到 light 时应复用原图表、mark 和柱图图元');
      }
      const actual = graphics.map(({ attribute: { fill, stroke, lineWidth, cornerRadius, fillOpacity } }) => ({
        fill,
        stroke,
        lineWidth,
        cornerRadius,
        fillOpacity
      }));
      if (JSON.stringify(actual) !== JSON.stringify(samples.lightStyles)) {
        throw assertionError(
          `切回 light 的柱子样式与直接创建 light 时不同。预期 ${JSON.stringify(
            samples.lightStyles
          )}，实际 ${JSON.stringify(actual)}`
        );
      }
    });
  }
};
