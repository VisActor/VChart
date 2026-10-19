import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 655ad3359ea0da0095642846
 * 验证目的：散点标注线富文本标签。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'scatter',
      padding: [12, 20, 12, 12],
      xField: 'x',
      yField: 'y',
      sizeField: 'z',
      size: {
        type: 'linear',
        range: [20, 80]
      },
      axes: [
        { orient: 'bottom', type: 'linear', min: 60, max: 95 },
        { orient: 'left', type: 'linear', min: 0, max: 200 }
      ],
      point: {
        style: {
          fillOpacity: 0.25,
          lineWidth: 1,
          stroke: '#6690F2',
          fill: '#6690F2'
        }
      },
      label: {
        visible: true,
        position: 'center',
        overlap: {
          avoidBaseMark: false
        },
        style: {
          stroke: '#fff',
          lineWidth: 1
        }
      },
      markLine: [
        {
          x: 65,
          label: {
            visible: true,
            position: 'end',
            type: 'rich',
            text: [
              {
                text: 'RICHTEXT',
                fontWeight: 'bold',
                fontSize: 25,
                fill: '#3f51b5'
              },
              {
                text: 'Alternative',
                fontStyle: 'italic',
                textDecoration: 'underline',
                fill: '#3f51b5'
              }
            ],
            style: {
              textAlign: 'left',
              textBaseline: 'top',
              fill: '#000',
              dx: 10
            },
            labelBackground: {
              visible: false
            }
          },
          line: {
            style: {
              stroke: '#000',
              lineDash: [0]
            }
          }
        },
        {
          y: 50,
          label: {
            visible: true,
            position: 'end',
            text: 'Safe sugar intake 50g/day',
            style: {
              textAlign: 'right',
              textBaseline: 'bottom',
              fill: '#000'
            },
            labelBackground: {
              visible: false
            }
          },
          line: {
            style: {
              stroke: '#000',
              lineDash: [0]
            }
          }
        }
      ],
      tooltip: {
        mark: {
          title: {
            value: datum => datum.country
          }
        }
      },
      data: {
        id: 'data',
        values: [
          { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
          { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
          { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
          { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
          { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
          { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
          { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
          { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
          { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
          { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
          { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
          { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
          { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
          { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
          { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
        ]
      }
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (
        !window.__visualChart
          .getStage()
          .findAll(g => g.type === 'richtext' && g.attribute.visible !== false && g.globalAABBBounds.width() > 0, true)
          .length
      )
        throw new Error('富文本未实际绘制');
    });
  }
};
