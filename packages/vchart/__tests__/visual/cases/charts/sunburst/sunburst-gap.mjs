import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 646745e9cb5fa8011f4e045f
 * 验证目的：旭日图分层间隙和径向标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。

    const duration = 1000;
    const easing = 'cubicInOut';
    const data = [
      {
        name: 'Company A',
        children: [
          {
            name: 'Department A',
            children: [
              {
                name: 'Group 1',
                value: 1
              },
              {
                name: 'Group 2',
                value: 2
              }
            ]
          },
          {
            name: 'Department B',
            children: [
              {
                name: 'Group 3',
                children: [
                  {
                    name: '员工1',
                    value: 2
                  },
                  {
                    name: '员工2',
                    value: 1
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Company B',
        children: [
          {
            name: 'Department C',
            children: [
              {
                name: 'Group 4',
                value: 4
              },
              {
                name: 'Group 5',
                value: 5
              }
            ]
          },
          {
            name: 'Department D',
            children: [
              {
                name: 'Group 6',
                value: 6
              }
            ]
          }
        ]
      },
      {
        name: 'Company C',
        children: [
          {
            name: 'Department E',
            children: [
              {
                name: 'Group 7',
                value: 7
              },
              {
                name: 'Group 8',
                value: 8
              }
            ]
          },
          {
            name: 'Department F',
            children: [
              {
                name: 'Group 9',
                value: 9
              }
            ]
          }
        ]
      },
      {
        name: 'Company D',
        children: [
          {
            name: 'Department G',
            value: 10
          },
          {
            name: 'Department H',
            value: 5
          }
        ]
      }
    ];
    const spec = {
      type: 'sunburst',
      offsetX: 0,
      offsetY: 0,
      categoryField: 'name',
      valueField: 'value',
      outerRadius: 1,
      endAngle: 180,
      labelAutoVisible: {
        enable: true,
        circumference: 5
      },
      drill: true,
      labelLayout: {
        align: 'center',
        rotate: 'radial',
        offset: 0
      },
      gap: [5, 10],
      sunburst: {
        style: {
          visible: true,
          fillOpacity: datum => {
            return datum.isLeaf ? 0.4 : 0.8;
          }
        }
      },
      label: {
        style: {
          fillOpacity: datum => {
            return datum.isLeaf ? 0.4 : 0.8;
          }
        }
      },
      tooltip: {
        mark: {
          title: {
            value: val => {
              return val?.datum?.map(data => data.name).join(' / ');
            }
          }
        }
      },
      data: [
        {
          id: 'data',
          values: data
        }
      ],
      animation: true,
      animationUpdate: {
        easing: easing,
        duration: duration
      },
      animationExit: {
        easing: easing,
        duration: duration
      },
      animationEnter: {
        easing: easing,
        duration: duration
      }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page, { animation: false });
    await verifyRendered(page, 'series');
  }
};
