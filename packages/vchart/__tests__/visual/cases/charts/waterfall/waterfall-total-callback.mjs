import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0443
 * 验证目的：瀑布图总计计算回调。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'common',
      seriesField: 'type',
      data: [
        {
          id: 'id0',
          values: [
            { x: 'Subtotal', total: true },
            { x: '0', y: 20, type: 'A' },
            { x: '1', y: 20, type: 'A' },
            { x: '2', y: 20, type: 'A' },
            { x: '3', y: 20, type: 'A' },
            { x: '4', y: 20, type: 'A' },
            { x: '5', y: 20, type: 'A' },
            { x: '0', y: 11, type: 'B' },
            { x: '1', y: 20, type: 'B' },
            { x: '2', y: 20, type: 'B' },
            { x: '3', y: 20, type: 'B' },
            { x: '4', y: 20, type: 'B' },
            { x: '5', y: 20, type: 'B' },
            { x: 'Total', total: true }
          ]
        }
      ],
      series: [
        {
          type: 'waterfall',
          dataIndex: 0,
          xField: 'x',
          yField: 'y',
          seriesField: 'type',
          total: {
            type: 'custom',
            tagField: 'total',
            product: (datum, current) => {
              if (datum.x === 'Subtotal') {
                return {
                  start: 0,
                  end: 100
                };
              }
              return {
                start: 0,
                end: current.end
              };
            }
          }
        }
      ],
      axes: [
        { orient: 'left', range: { min: 0 } },
        { orient: 'bottom', label: { visible: true }, type: 'band', paddingInner: 0.4 }
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
