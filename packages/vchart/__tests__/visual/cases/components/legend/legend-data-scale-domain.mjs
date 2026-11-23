import { verifyRendered } from '../../../helpers.mjs';

/**
 * 验证目的：连续颜色图例在数据定义域更新后与热力图颜色比例尺一致。
 * 来源：https://github.com/VisActor/VChart/issues/4587
 * 关键配置：保留原始 spec 和 64 条数据，color.domain 引用数据字段，图例未设置 field。
 * 最终检查：断言首帧、更新数据、恢复原始数据时图例实际渲染的上下界；截取原始数据的图像。
 */
export default {
  createSpec() {
    return {
      type: 'heatmap',
      data: [
        {
          id: 'source',
          values: [
            { value: 0.9999999999999999, x: 'king', y: 'king', cellLabel: '1.00' },
            { value: 0.9481454000897851, x: 'queen', y: 'king', cellLabel: '0.95' },
            { value: -0.044570250014228305, x: 'man', y: 'king', cellLabel: '-0.04' },
            { value: -0.02178984092873844, x: 'woman', y: 'king', cellLabel: '-0.02' },
            { value: 0.13468657157658426, x: 'apple', y: 'king', cellLabel: '0.13' },
            { value: 0.1552692522997243, x: 'fruit', y: 'king', cellLabel: '0.16' },
            { value: -0.17930900863832056, x: 'car', y: 'king', cellLabel: '-0.18' },
            { value: -0.20864652668170133, x: 'vehicle', y: 'king', cellLabel: '-0.21' },
            { value: 0.9481454000897851, x: 'king', y: 'queen', cellLabel: '0.95' },
            { value: 0.9999999999999999, x: 'queen', y: 'queen', cellLabel: '1.00' },
            { value: -0.0467663416214084, x: 'man', y: 'queen', cellLabel: '-0.05' },
            { value: -0.02514544886613811, x: 'woman', y: 'queen', cellLabel: '-0.03' },
            { value: 0.14115175580317543, x: 'apple', y: 'queen', cellLabel: '0.14' },
            { value: 0.1429057494278651, x: 'fruit', y: 'queen', cellLabel: '0.14' },
            { value: -0.13111337209672308, x: 'car', y: 'queen', cellLabel: '-0.13' },
            { value: -0.1601308906056667, x: 'vehicle', y: 'queen', cellLabel: '-0.16' },
            { value: -0.044570250014228305, x: 'king', y: 'man', cellLabel: '-0.04' },
            { value: -0.0467663416214084, x: 'queen', y: 'man', cellLabel: '-0.05' },
            { value: 1.0, x: 'man', y: 'man', cellLabel: '1.00' },
            { value: 0.957064398179386, x: 'woman', y: 'man', cellLabel: '0.96' },
            { value: -0.15264164641306655, x: 'apple', y: 'man', cellLabel: '-0.15' },
            { value: -0.13315096761473463, x: 'fruit', y: 'man', cellLabel: '-0.13' },
            { value: -0.03151734150063394, x: 'car', y: 'man', cellLabel: '-0.03' },
            { value: 0.01877134749784129, x: 'vehicle', y: 'man', cellLabel: '0.02' },
            { value: -0.02178984092873844, x: 'king', y: 'woman', cellLabel: '-0.02' },
            { value: -0.02514544886613811, x: 'queen', y: 'woman', cellLabel: '-0.03' },
            { value: 0.957064398179386, x: 'man', y: 'woman', cellLabel: '0.96' },
            { value: 1.0000000000000004, x: 'woman', y: 'woman', cellLabel: '1.00' },
            { value: -0.18703811303370182, x: 'apple', y: 'woman', cellLabel: '-0.19' },
            { value: -0.17496445300392752, x: 'fruit', y: 'woman', cellLabel: '-0.17' },
            { value: -0.04822741183633233, x: 'car', y: 'woman', cellLabel: '-0.05' },
            { value: 0.006220414583163436, x: 'vehicle', y: 'woman', cellLabel: '0.01' },
            { value: 0.13468657157658426, x: 'king', y: 'apple', cellLabel: '0.13' },
            { value: 0.14115175580317543, x: 'queen', y: 'apple', cellLabel: '0.14' },
            { value: -0.15264164641306655, x: 'man', y: 'apple', cellLabel: '-0.15' },
            { value: -0.18703811303370182, x: 'woman', y: 'apple', cellLabel: '-0.19' },
            { value: 0.9999999999999997, x: 'apple', y: 'apple', cellLabel: '1.00' },
            { value: 0.9368452258903234, x: 'fruit', y: 'apple', cellLabel: '0.94' },
            { value: 0.14857105741189747, x: 'car', y: 'apple', cellLabel: '0.15' },
            { value: 0.14882724094180463, x: 'vehicle', y: 'apple', cellLabel: '0.15' },
            { value: 0.1552692522997243, x: 'king', y: 'fruit', cellLabel: '0.16' },
            { value: 0.1429057494278651, x: 'queen', y: 'fruit', cellLabel: '0.14' },
            { value: -0.13315096761473463, x: 'man', y: 'fruit', cellLabel: '-0.13' },
            { value: -0.17496445300392752, x: 'woman', y: 'fruit', cellLabel: '-0.17' },
            { value: 0.9368452258903234, x: 'apple', y: 'fruit', cellLabel: '0.94' },
            { value: 0.9999999999999998, x: 'fruit', y: 'fruit', cellLabel: '1.00' },
            { value: 0.14833163124559304, x: 'car', y: 'fruit', cellLabel: '0.15' },
            { value: 0.1486665403008972, x: 'vehicle', y: 'fruit', cellLabel: '0.15' },
            { value: -0.17930900863832056, x: 'king', y: 'car', cellLabel: '-0.18' },
            { value: -0.13111337209672308, x: 'queen', y: 'car', cellLabel: '-0.13' },
            { value: -0.03151734150063394, x: 'man', y: 'car', cellLabel: '-0.03' },
            { value: -0.04822741183633233, x: 'woman', y: 'car', cellLabel: '-0.05' },
            { value: 0.14857105741189747, x: 'apple', y: 'car', cellLabel: '0.15' },
            { value: 0.14833163124559304, x: 'fruit', y: 'car', cellLabel: '0.15' },
            { value: 1.0, x: 'car', y: 'car', cellLabel: '1.00' },
            { value: 0.965257063623875, x: 'vehicle', y: 'car', cellLabel: '0.97' },
            { value: -0.20864652668170133, x: 'king', y: 'vehicle', cellLabel: '-0.21' },
            { value: -0.1601308906056667, x: 'queen', y: 'vehicle', cellLabel: '-0.16' },
            { value: 0.01877134749784129, x: 'man', y: 'vehicle', cellLabel: '0.02' },
            { value: 0.006220414583163436, x: 'woman', y: 'vehicle', cellLabel: '0.01' },
            { value: 0.14882724094180463, x: 'apple', y: 'vehicle', cellLabel: '0.15' },
            { value: 0.1486665403008972, x: 'fruit', y: 'vehicle', cellLabel: '0.15' },
            { value: 0.965257063623875, x: 'car', y: 'vehicle', cellLabel: '0.97' },
            { value: 1.0000000000000002, x: 'vehicle', y: 'vehicle', cellLabel: '1.00' }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      valueField: 'value',
      color: {
        type: 'linear',
        domain: [{ dataId: 'source', fields: ['value'] }],
        range: ['#3b4cc0', '#6282ea', '#8db0fe', '#b9d0f9', '#dddcdc', '#f5c4ac', '#f4987a', '#dd5f4b', '#b40426']
      },
      legends: {
        visible: true,
        type: 'color',
        title: { visible: true, text: 'Cosine similarity' },
        handlerText: { precision: 2 }
      },
      axes: [
        { bandPadding: 0, orient: 'bottom', type: 'band' },
        { bandPadding: 0, orient: 'left', type: 'band' }
      ],
      label: {
        smartInvert: { interactInvertType: 'background' },
        visible: true,
        formatter: '{cellLabel}'
      },
      title: { text: 'Token Embedding Cosine Similarity' }
    };
  },
  async exercise(page) {
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const values = chart.getSpec().data[0].values;
      const getLegendRange = () => {
        const legend = chart
          .getChart()
          .getAllComponents()
          .find(component => component.type === 'colorLegend')
          .getVRenderComponents()[0];
        const { min, max } = legend.attribute;
        return [min, max];
      };

      // 缩放所有数据值，使更新前后的上下界都不同。恢复原始数据用于截图。
      const initial = getLegendRange();
      chart.updateDataSync(
        'source',
        values.map(row => ({ ...row, value: row.value / 2, cellLabel: (row.value / 2).toFixed(2) }))
      );
      const updated = getLegendRange();
      chart.updateDataSync('source', values);
      window.__legendScaleRanges = { initial, updated, restored: getLegendRange() };
    });
  },
  async verify(page) {
    await verifyRendered(page, 'series');
    await page.evaluate(async () => {
      const original = [-0.20864652668170133, 1.0000000000000004];
      const expected = { initial: original, updated: original.map(value => value / 2), restored: original };

      for (const [stage, range] of Object.entries(expected)) {
        const actual = window.__legendScaleRanges[stage];
        if (actual[0] !== range[0] || actual[1] !== range[1]) {
          const { assertionError } = await import('/suite/assertions.mjs');
          throw assertionError(`颜色图例 ${stage} 的范围为 [${actual}]，预期为 [${range}]`);
        }
      }
    });
  }
};
