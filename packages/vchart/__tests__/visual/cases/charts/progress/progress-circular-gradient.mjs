import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e03db
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：圆形进度渐变及内外留白。
 * 保留条件：原值 1、conical 渐变、roundCap、半径与 inner/outerPadding。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'circularProgress',
      data: [
        {
          id: 'id0',
          values: [
            {
              type: 'A',
              value: 1
            }
          ]
        }
      ],
      valueField: 'value',
      seriesField: 'type',
      radiusField: 'type',
      radius: 0.8,
      innerRadius: 0.6,
      roundCap: true,
      cornerRadius: 5,
      progress: {
        style: {
          innerPadding: 10,
          outerPadding: 10,
          cornerRadius: 20,
          fill: {
            gradient: 'conical',
            stops: [
              {
                offset: 0,
                color: '#4FC6B4'
              },
              {
                offset: 1,
                color: '#31679E'
              }
            ]
          }
        }
      }
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
