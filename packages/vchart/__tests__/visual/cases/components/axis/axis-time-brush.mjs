import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 66d52aca42109e00f2e0713e
 * 验证目的：时间轴和 dataZoom 及刷选配置共存。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。

    const spec = {
      type: 'line',
      data: {
        values: [
          { time: 1720339200000, value: 7, legend: 'Excellent' },
          { time: 1720339800000, value: 37, legend: 'Excellent' },
          { time: 1720340400000, value: 10, legend: 'Excellent' },
          { time: 1720341000000, value: 37, legend: 'Excellent' },
          { time: 1720341600000, value: 37, legend: 'Excellent' },
          { time: 1720342200000, value: 37, legend: 'Excellent' },
          { time: 1720342800000, value: 3, legend: 'Excellent' },
          { time: 1720343400000, value: 37, legend: 'Excellent' },
          { time: 1720344000000, value: 3, legend: 'Excellent' },
          { time: 1720345800000, value: 3, legend: 'Excellent' },
          { time: 1720346400000, value: 37, legend: 'Excellent' },
          { time: 1720347000000, value: 37, legend: 'Excellent' },
          { time: 1720347600000, value: 3, legend: 'Excellent' },
          { time: 1720348200000, value: 37, legend: 'Excellent' }
        ]
      },
      xField: 'time',
      yField: 'value',
      axes: [
        {
          orient: 'bottom',
          type: 'time',
          layers: [
            {
              // 格式化x时间轴
              timeFormat: '%m/%d %H:%M'
            }
          ]
          // min:1720334200000,
          // max:1720349800000
        }
      ],
      brush: {
        visible: true,
        brushType: 'x',
        // 开启后默认关联所有axis/dataZoom
        zoomAfterBrush: true,
        zoomWhenEmpty: false,
        brushMoved: false, // 选框是否可被平移
        delayType: 'throttle',
        style: {
          shadowColor: '#1664FF1A',
          lineWidth: 0.5
        }
      },
      dataZoom: [
        {
          orient: 'bottom',
          showDetail: false,
          visible: true
        }
      ],
      crosshair: {
        xField: {
          visible: true,
          line: {
            type: 'line'
          }
        }
      },
      point: {
        style: {
          size: 4
        },
        state: {
          dimension_hover: {
            size: 10
          }
        }
      },
      tooltip: {
        dimension: {
          visible: (a, b, c) => {
            return a[0].value > 1720339200000 && a[0].value < 1720348200000;
          },
          title: {
            valueTimeFormat: '%Y-%m-%d  %H:%M:%S'
          },
          content: {
            key: datum => datum.legend,
            value: datum => {
              return datum.value;
            }
          }
        }
      },
      line: {
        style: {
          lineWidth: 2
        }
      },
      legends: { visible: true }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
