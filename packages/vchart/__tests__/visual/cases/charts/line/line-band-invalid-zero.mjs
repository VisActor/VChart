import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e037d
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：双离散轴折线保留 invalidType=zero 配置。
 * 保留条件：common、双 band 轴、字母 y 值、600×600；原文没有缺失数据。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'common',
      autoFit: true,
      data: [
        {
          id: 'id0',
          values: [
            {
              x: 1,
              y: 'a'
            },
            {
              x: 2,
              y: 'b'
            }
          ]
        }
      ],
      width: 600,
      height: 600,
      series: [
        {
          type: 'line',
          dataIndex: 0,
          xField: 'x',
          yField: 'y',
          invalidType: 'zero'
        }
      ],
      axes: [
        {
          orient: 'left',
          type: 'band'
        },
        {
          orient: 'bottom',
          type: 'band'
        }
      ]
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
