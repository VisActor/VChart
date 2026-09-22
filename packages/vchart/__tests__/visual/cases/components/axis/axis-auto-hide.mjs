import { verifySpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 65387a631d24511d73c92b74
 * 迁移方式：保留原始配置及数据，适配本地测试宿主。
 * 验证目的：窄图表中三个长时间标签自动隐藏。
 * 保留条件：width=200、sampling=false、greedy、flush、原始时间文本。
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
            time: '2023-10-24 11:11:11',
            value: 8
          },
          {
            time: '2023-10-25 11:11:11',
            value: 9
          },
          {
            time: '2023-10-26 11:11:11',
            value: 15
          }
        ]
      },
      axes: [
        {
          type: 'band',
          orient: 'bottom',
          visible: true,
          sampling: false,
          label: {
            visible: true,
            space: 4,
            style: {
              fontSize: 12,
              fill: '#6F6F6F',
              angle: 0,
              fontWeight: 'normal',
              direction: 'horizontal'
            },
            autoHide: true,
            autoHideMethod: 'greedy',
            flush: true
          },
          hover: true,
          background: {
            visible: true,
            state: {
              hover: {
                fillOpacity: 0.08,
                fill: '#141414'
              },
              hover_reverse: {
                fillOpacity: 0.08,
                fill: '#141414'
              }
            }
          }
        }
      ],
      xField: 'time',
      yField: 'value',
      width: 200
    };
  },
  async verify(page) {
    // 核对完整来源配置及实际绘制；布局差异交由截图比较。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
