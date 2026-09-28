import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e031f
 * 验证目的：雷达图多系列与角度和半径轴。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。

    const spec = {
      type: 'radar',
      data: [
        {
          id: 'radar',
          values: [
            { theta: '0', type: 'A', r: '827' },
            { theta: '1', type: 'A', r: '608' },
            { theta: '2', type: 'A', r: '643' },
            { theta: '3', type: 'A', r: '899' },
            { theta: '4', type: 'A', r: '612' },
            { theta: '5', type: 'A', r: '715' },
            { theta: '6', type: 'A', r: '800' },
            { theta: '7', type: 'A', r: '674' },
            { theta: '8', type: 'A', r: '601' },
            { theta: '9', type: 'A', r: '620' },
            { theta: '0', type: 'B', r: '776' },
            { theta: '1', type: 'B', r: '816' },
            { theta: '2', type: 'B', r: '881' },
            { theta: '3', type: 'B', r: '767' },
            { theta: '4', type: 'B', r: '748' },
            { theta: '5', type: 'B', r: '682' },
            { theta: '6', type: 'B', r: '811' },
            { theta: '7', type: 'B', r: '712' },
            { theta: '8', type: 'B', r: '783' },
            { theta: '9', type: 'B', r: '624' }
          ]
        }
      ],
      categoryField: 'theta',
      valueField: 'r',
      seriesField: 'type',
      line: {
        style: {
          lineWidth: 8
        }
      },
      // center: { x: 200, y: 300 },
      startAngle: 90,
      axes: [
        {
          orient: 'angle',
          domainLine: { visible: true, smooth: false },
          tick: { visible: true },
          grid: { visible: true },
          label: { visible: true }
        },
        {
          orient: 'radius',
          label: { visible: true },
          domainLine: { visible: true, smooth: false },
          tick: { visible: true },
          grid: { visible: true, smooth: false, style: { stroke: 'red', zIndex: 110 } }
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
