import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';

/**
 * BugServer case IDs: 649d7ef552a1e9eec95f9e94
 * 验证目的：圆打包分层留白和按深度显示标签。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：仅验证静态最终状态，动画关闭，不代表下钻或悬停已验证。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。
    const data = [
      {
        name: 'root',
        children: [
          {
            name: 'Country A',
            children: [
              {
                name: 'Northeast',
                children: [
                  {
                    name: 'Office supplies',
                    value: 824
                  },
                  {
                    name: 'Furniture',
                    value: 920
                  },
                  {
                    name: 'Electronics',
                    value: 936
                  }
                ]
              },
              {
                name: 'Central South',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1270
                  },
                  {
                    name: 'Furniture',
                    value: 1399
                  },
                  {
                    name: 'Electronics',
                    value: 1466
                  }
                ]
              },
              {
                name: 'East',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1408
                  },
                  {
                    name: 'Furniture',
                    value: 1676
                  },
                  {
                    name: 'Electronics',
                    value: 1559
                  }
                ]
              },
              {
                name: 'North',
                children: [
                  {
                    name: 'Office supplies',
                    value: 745
                  },
                  {
                    name: 'Furniture',
                    value: 919
                  },
                  {
                    name: 'Electronics',
                    value: 781
                  }
                ]
              },
              {
                name: 'Northwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 267
                  },
                  {
                    name: 'Furniture',
                    value: 316
                  },
                  {
                    name: 'Electronics',
                    value: 230
                  }
                ]
              },
              {
                name: 'Southwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 347
                  },
                  {
                    name: 'Furniture',
                    value: 501
                  },
                  {
                    name: 'Electronics',
                    value: 453
                  }
                ]
              }
            ]
          },
          {
            name: 'Country B',
            children: [
              {
                name: 'Northeast',
                children: [
                  {
                    name: 'Office supplies',
                    value: 824
                  },
                  {
                    name: 'Furniture',
                    value: 920
                  },
                  {
                    name: 'Electronics',
                    value: 936
                  }
                ]
              },
              {
                name: 'Central South',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1270
                  },
                  {
                    name: 'Furniture',
                    value: 1399
                  },
                  {
                    name: 'Electronics',
                    value: 1466
                  }
                ]
              },
              {
                name: 'East',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1408
                  },
                  {
                    name: 'Furniture',
                    value: 1676
                  },
                  {
                    name: 'Electronics',
                    value: 1559
                  }
                ]
              },
              {
                name: 'North',
                children: [
                  {
                    name: 'Office supplies',
                    value: 745
                  },
                  {
                    name: 'Furniture',
                    value: 919
                  },
                  {
                    name: 'Electronics',
                    value: 781
                  }
                ]
              },
              {
                name: 'Northwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 267
                  },
                  {
                    name: 'Furniture',
                    value: 316
                  },
                  {
                    name: 'Electronics',
                    value: 230
                  }
                ]
              },
              {
                name: 'Southwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 347
                  },
                  {
                    name: 'Furniture',
                    value: 501
                  },
                  {
                    name: 'Electronics',
                    value: 453
                  }
                ]
              }
            ]
          },
          {
            name: 'Country C',
            children: [
              {
                name: 'Northeast',
                children: [
                  {
                    name: 'Office supplies',
                    value: 824
                  },
                  {
                    name: 'Furniture',
                    value: 920
                  },
                  {
                    name: 'Electronics',
                    value: 936
                  }
                ]
              },
              {
                name: 'Central South',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1270
                  },
                  {
                    name: 'Furniture',
                    value: 1399
                  },
                  {
                    name: 'Electronics',
                    value: 1466
                  }
                ]
              },
              {
                name: 'East',
                children: [
                  {
                    name: 'Office supplies',
                    value: 1408
                  },
                  {
                    name: 'Furniture',
                    value: 1676
                  },
                  {
                    name: 'Electronics',
                    value: 1559
                  }
                ]
              },
              {
                name: 'North',
                children: [
                  {
                    name: 'Office supplies',
                    value: 745
                  },
                  {
                    name: 'Furniture',
                    value: 919
                  },
                  {
                    name: 'Electronics',
                    value: 781
                  }
                ]
              },
              {
                name: 'Northwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 267
                  },
                  {
                    name: 'Furniture',
                    value: 316
                  },
                  {
                    name: 'Electronics',
                    value: 230
                  }
                ]
              },
              {
                name: 'Southwest',
                children: [
                  {
                    name: 'Office supplies',
                    value: 347
                  },
                  {
                    name: 'Furniture',
                    value: 501
                  },
                  {
                    name: 'Electronics',
                    value: 453
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const spec = {
      data: [
        {
          id: 'data',
          values: data
        }
      ],
      type: 'circlePacking',
      categoryField: 'name',
      valueField: 'value',
      drill: true,
      circlePacking: {
        style: {
          fillOpacity: d => (d.isLeaf ? 0.75 : 0.25)
        }
      },
      layoutPadding: [0, 10, 10],
      label: {
        style: {
          fontSize: 10,
          visible: d => {
            return d.depth === 1;
          }
        }
      },
      animationEnter: {
        easing: 'cubicInOut'
      },
      animationExit: {
        easing: 'cubicInOut'
      },
      animationUpdate: {
        easing: 'cubicInOut'
      },
      tooltip: {
        mark: {
          title: {
            value: val => {
              return val?.datum?.map(data => data.name).join(' / ');
            }
          }
        }
      }
    };

    return spec;
  },
  async verify(page) {
    // 完整配置和回调由 verifySourceSpec 检查，另验证最终绘制或操作结果。
    await verifySourceSpec(page);
    await verifyRendered(page, 'series');
  }
};
