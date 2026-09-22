import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 652e02ee1dd15a4ab522f758
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：堆叠折线与底部虚线图例共存。
 * 保留条件：36 条原始数据、四组系列、lineH 图例虚线、标题。
 * 改写说明：仅内联静态 const 引用；数值、顺序及配置组合保留。
 * 覆盖边界：只比较源代码提供的静态最终状态；不推断历史缺陷或未提供的交互。
 */
export default {
  createSpec() {
    // 每次返回保留来源条件的新配置，避免两侧共享可变对象。
    return {
      type: 'line',
      data: {
        values: [
          {
            type: 'Nail polish',
            country: 'Africa',
            value: 4229
          },
          {
            type: 'Nail polish',
            country: 'EU',
            value: 4376
          },
          {
            type: 'Nail polish',
            country: 'China',
            value: 3054
          },
          {
            type: 'Nail polish',
            country: 'USA',
            value: 12814
          },
          {
            type: 'Eyebrow pencil',
            country: 'Africa',
            value: 3932
          },
          {
            type: 'Eyebrow pencil',
            country: 'EU',
            value: 3987
          },
          {
            type: 'Eyebrow pencil',
            country: 'China',
            value: 5067
          },
          {
            type: 'Eyebrow pencil',
            country: 'USA',
            value: 13012
          },
          {
            type: 'Rouge',
            country: 'Africa',
            value: 5221
          },
          {
            type: 'Rouge',
            country: 'EU',
            value: 3574
          },
          {
            type: 'Rouge',
            country: 'China',
            value: 7004
          },
          {
            type: 'Rouge',
            country: 'USA',
            value: 11624
          },
          {
            type: 'Lipstick',
            country: 'Africa',
            value: 9256
          },
          {
            type: 'Lipstick',
            country: 'EU',
            value: 4376
          },
          {
            type: 'Lipstick',
            country: 'China',
            value: 9054
          },
          {
            type: 'Lipstick',
            country: 'USA',
            value: 8814
          },
          {
            type: 'Eyeshadows',
            country: 'Africa',
            value: 3308
          },
          {
            type: 'Eyeshadows',
            country: 'EU',
            value: 4572
          },
          {
            type: 'Eyeshadows',
            country: 'China',
            value: 12043
          },
          {
            type: 'Eyeshadows',
            country: 'USA',
            value: 12998
          },
          {
            type: 'Eyeliner',
            country: 'Africa',
            value: 5432
          },
          {
            type: 'Eyeliner',
            country: 'EU',
            value: 3417
          },
          {
            type: 'Eyeliner',
            country: 'China',
            value: 15067
          },
          {
            type: 'Eyeliner',
            country: 'USA',
            value: 12321
          },
          {
            type: 'Foundation',
            country: 'Africa',
            value: 13701
          },
          {
            type: 'Foundation',
            country: 'EU',
            value: 5231
          },
          {
            type: 'Foundation',
            country: 'China',
            value: 10119
          },
          {
            type: 'Foundation',
            country: 'USA',
            value: 10342
          },
          {
            type: 'Lip gloss',
            country: 'Africa',
            value: 4008
          },
          {
            type: 'Lip gloss',
            country: 'EU',
            value: 4572
          },
          {
            type: 'Lip gloss',
            country: 'China',
            value: 12043
          },
          {
            type: 'Lip gloss',
            country: 'USA',
            value: 22998
          },
          {
            type: 'Mascara',
            country: 'Africa',
            value: 18712
          },
          {
            type: 'Mascara',
            country: 'EU',
            value: 6134
          },
          {
            type: 'Mascara',
            country: 'China',
            value: 10419
          },
          {
            type: 'Mascara',
            country: 'USA',
            value: 11261
          }
        ]
      },
      title: {
        visible: true,
        text: 'Stacked line chart'
      },
      stack: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [
        {
          visible: true,
          position: 'middle',
          orient: 'bottom',
          item: {
            shape: {
              style: {
                size: 20,
                symbolType: 'lineH',
                lineDash: [4, 4],
                lineWidth: 2
              }
            }
          }
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
