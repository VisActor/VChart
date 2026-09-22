import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 649d7f2452a1e9eec95f9f1b
 * 验证目的：瀑布图自动汇总与标签格式化。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'waterfall',
      data: [
        {
          id: 'id0',
          values: [
            { x: 'Q1-Primary', y: 10954, type: 'Primary' },
            { x: 'Q1-Secondary', y: 106187, type: 'Secondary' },
            { x: 'Q1-Tertiary', y: 153037, type: 'Tertiary' },
            { x: 'Q1', total: true, collect: 3 },
            { x: 'Q2-Primary', y: 18183, type: 'Primary' },
            { x: 'Q2-Secondary', y: 122450, type: 'Secondary' },
            { x: 'Q2-Tertiary', y: 151831, type: 'Tertiary' },
            { x: 'Q2', total: true, collect: 3 },
            { x: 'Q3-Primary', y: 25642, type: 'Primary' },
            { x: 'Q3-Secondary', y: 121553, type: 'Secondary' },
            { x: 'Q3-Tertiary', y: 160432, type: 'Tertiary' },
            { x: 'Q3', total: true, collect: 3 },
            { x: 'Q4-Primary', y: 33497, type: 'Primary' },
            { x: 'Q4-Secondary', y: 132601, type: 'Secondary' },
            { x: 'Q4-Tertiary', y: 169411, type: 'Tertiary' },
            { x: 'Q4', total: true, collect: 3 },
            { x: 'Annual', total: true }
          ]
        }
      ],
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      total: {
        type: 'field',
        tagField: 'total',
        startField: 'start',
        valueField: 'value',
        collectCountField: 'collect'
      },
      stackLabel: {
        valueType: 'change'
      },
      title: {
        visible: true,
        text: 'Quarterly GDP in 2022'
      },
      legends: { visible: true, orient: 'bottom' },
      axes: [
        { orient: 'left', title: { visible: true, text: 'Unit: 100 million yuan' } },
        {
          orient: 'bottom',
          label: {
            visible: true,
            formatMethod: text => {
              const arr = text.split('-');
              return arr[arr.length - 1];
            }
          },
          type: 'band',
          paddingInner: 0.4
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
