import { compileStatPlot } from '../../src/compile';
test('fieldLabels names axes and tooltip quantities consistently', () => {
  const chart = compileStatPlot({
    type: 'countPlot',
    statistic: 'proportion',
    fieldLabels: { category: '客户类型', count: '客户数', proportion: '客户占比' },
    data: [
      { category: 'A', count: 3 },
      { category: 'B', count: 7 }
    ]
  }) as any;
  expect(chart.axes[0].title.text).toBe('客户类型');
  expect(chart.axes[1].title.text).toBe('客户占比');
  expect(chart.series[0].tooltip.mark.content.map((item: any) => item.key)).toEqual(['客户类型', '客户数', '客户占比']);
});
test('histogram count and displayed statistic labels reach the tooltip', () => {
  const chart = compileStatPlot({
    type: 'histogram',
    statistic: 'density',
    fieldLabels: { count: '样本数', density: '采样密度' },
    data: [{ binStart: 0, binEnd: 2, count: 4 }]
  }) as any;
  expect(chart.axes[1].title.text).toBe('采样密度');
  expect(chart.series[0].tooltip.mark.content.map((item: any) => item.key)).toEqual([
    'binStart',
    'binEnd',
    '样本数',
    '采样密度'
  ]);
});
test('embedding axis overrides preserve the original method and dimensions', () => {
  const dimensions = {
    x: { name: 'PC1', explainedVarianceRatio: 0.5 },
    y: { name: 'PC2', explainedVarianceRatio: 0.2 }
  };
  const chart = compileStatPlot({
    type: 'embeddingPlot',
    method: 'pca',
    dimensions,
    fieldLabels: { x: '主成分一' },
    data: [{ id: '1', x: 1, y: 2 }]
  }) as any;
  expect(chart.axes[0].title.text).toBe('主成分一');
  expect(chart.axes[1].title.text).toBe('PC2 (20.0%)');
  expect(dimensions.x.explainedVarianceRatio).toBe(0.5);
});
test('confusion matrix uses proportion labels for defined and undefined cells', () => {
  const chart = compileStatPlot({
    type: 'confusionMatrix',
    normalization: 'actual',
    fieldLabels: { count: '样本数', proportion: '实际类别内占比' },
    data: [
      { actual: 'A', predicted: 'A', count: 8 },
      { actual: 'A', predicted: 'B', count: 2 },
      { actual: 'B', predicted: 'A', count: 0 },
      { actual: 'B', predicted: 'B', count: 0 }
    ]
  }) as any;
  for (const series of chart.series) {
    expect(series.tooltip.mark.content.map((item: any) => item.key)).toEqual([
      'actual',
      'predicted',
      '样本数',
      '实际类别内占比'
    ]);
  }
  expect(chart.series[1].data.values).toHaveLength(2);
});
