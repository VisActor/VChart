import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 64e845be707420a88d0e68ef
 * 验证目的：面积图数据点外描边。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'area',
      point: {
        style: {
          size: 10,
          outerBorder: {
            distance: 0,
            lineWidth: 4,
            strokeOpacity: 0.2
          }
        }
      },
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
        text: 'Stacked area chart of cosmetic products sales'
      },
      xField: 'type',
      yField: 'value',
      seriesField: 'country',
      legends: [
        {
          visible: true,
          position: 'middle',
          orient: 'bottom'
        }
      ],
      crosshair: {
        xField: {
          visible: true
        }
      },
      seriesMark: 'point'
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
