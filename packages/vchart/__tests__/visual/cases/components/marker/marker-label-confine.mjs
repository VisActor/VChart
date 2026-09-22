import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 6501760241adc800895c20f4
 * 验证目的：标注线标签边界约束与端点符号。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'line',
      data: {
        id: 'line',
        values: [
          {
            time: '2:00',
            value: 8
          },
          {
            time: '4:00',
            value: 9
          },
          {
            time: '6:00',
            value: 11
          },
          {
            time: '8:00',
            value: 14
          },
          {
            time: '10:00',
            value: 16
          },
          {
            time: '12:00',
            value: 17
          },
          {
            time: '14:00',
            value: 17
          },
          {
            time: '16:00',
            value: 16
          },
          {
            time: '18:00',
            value: 15
          }
        ]
      },
      xField: 'time',
      yField: 'value',
      markLine: [
        {
          y: data => {
            console.log('y', data);
            return 20;
          },
          startSymbol: {
            visible: true,
            symbolType: 'triangleDown',
            style: {
              size: 10,
              fill: '#f3a016'
            }
          },
          endSymbol: {
            visible: false
          },
          autoRange: true,
          label: {
            visible: true,
            text: 'This is a label',
            confine: true,
            style: {
              dx: -4,
              dy: 0,
              fontSize: 12,
              fontWeight: 'normal',
              fill: '#fff',
              cursor: 'pointer'
            },
            position: 'insideStartTop',
            labelBackground: {
              visible: true,
              padding: {
                left: 5,
                right: 5,
                top: 2,
                bottom: 2
              },
              style: {
                fill: '#2F3B52',
                fillOpacity: 0.9,
                dx: -4,
                dy: 0
              }
            }
          },
          line: {
            style: {
              stroke: '#f3a016',
              lineWidth: 2,
              lineDash: [3, 3],
              cursor: 'pointer'
            }
          },
          relativeSeriesId: 'mainSeries',
          id: '7d14708c-de9d-49a1-919a-26c65ff95b42',
          interactive: true
        }
      ]
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await verifyRendered(page, 'mark-line');
  }
};
