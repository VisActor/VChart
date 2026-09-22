import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65558da7b53f99008e8e6ddc
 * 验证目的：dataZoom 预览图的初始范围和布局。
 * 保留条件：title, xField, yField, seriesField, legends, crosshair, axes, dataZoom；原始数值、数据顺序和配置组合。
 * 迁移说明：替换测试宿主；限定 width=400，使来源的 auto/minBandSize 条件实际显示 dataZoom。
 * 覆盖边界：只验证保存源码的静态最终状态，不宣称交互或历史缺陷已复现。
 */
export default {
  createSpec() {
    // 返回独立配置，保留来源数据及相互关联的设置。
    return {
      type: 'area',
      width: 400,
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
          visible: true,
          label: {
            visible: true
          }
        },
        yField: {
          visible: true,
          label: {
            visible: true
          }
        }
      },
      axes: [
        {
          orient: 'bottom',
          type: 'band',
          minBandSize: 50,
          maxBandSize: 100,
          autoRegionSize: true
        },
        {
          orient: 'left',
          type: 'linear'
        },
        {
          orient: 'right',
          type: 'linear'
        }
      ],
      dataZoom: [
        {
          orient: 'bottom',
          start: 0,
          filterMode: 'axis',
          axisIndex: 0,
          auto: true,
          ignoreBandSize: true
        }
      ]
    };
  },
  async verify(page) {
    // verifySpec 递归检查全部显式配置和数据；verifyRendered 检查每个系列实际有效几何。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      const component = window.__visualChart.getStage().find(g => g.name === 'dataZoom', true);
      if (!component || component.attribute.visible === false || component.globalAABBBounds.width() <= 0)
        throw new Error('自动 dataZoom 未显示');
    });
  }
};
