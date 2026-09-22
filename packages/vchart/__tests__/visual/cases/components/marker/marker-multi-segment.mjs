import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 655c9331ce24cd5a7fc9796b
 * 验证目的：多段标注线连接方向及扩展距离。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const spec = {
      type: 'bar',
      padding: [12, 80, 12, 12],
      data: [
        {
          id: 'barData',
          values: [
            { type: 'Autocracies', year: '1930', value: 129 },
            { type: 'Autocracies', year: '1940', value: 133 },
            { type: 'Autocracies', year: '1950', value: 130 },
            { type: 'Autocracies', year: '1960', value: 126 },
            { type: 'Autocracies', year: '1970', value: 117 },
            { type: 'Autocracies', year: '1980', value: 114 },
            { type: 'Autocracies', year: '1990', value: 111 },
            { type: 'Autocracies', year: '2000', value: 89 },
            { type: 'Autocracies', year: '2010', value: 80 },
            { type: 'Autocracies', year: '2018', value: 80 },
            { type: 'Democracies', year: '1930', value: 22 },
            { type: 'Democracies', year: '1940', value: 13 },
            { type: 'Democracies', year: '1950', value: 25 },
            { type: 'Democracies', year: '1960', value: 29 },
            { type: 'Democracies', year: '1970', value: 38 },
            { type: 'Democracies', year: '1980', value: 41 },
            { type: 'Democracies', year: '1990', value: 57 },
            { type: 'Democracies', year: '2000', value: 87 },
            { type: 'Democracies', year: '2010', value: 98 },
            { type: 'Democracies', year: '2018', value: 99 }
          ]
        }
      ],
      xField: 'year',
      yField: 'value',
      seriesField: 'type',
      stack: true,
      legends: {
        visible: true,
        orient: 'top',
        position: 'start'
      },
      markLine: {
        type: 'type-step',
        coordinates: [
          { type: 'Autocracies', year: '1930', value: 129 },
          { type: 'Autocracies', year: '2018', value: 80 }
        ],
        connectDirection: 'right',
        expandDistance: 80,
        line: {
          multiSegment: true,
          mainSegmentIndex: 1,
          style: [
            {
              lineDash: [2, 2],
              stroke: '#000',
              lineWidth: 2
            },
            {
              stroke: '#000',
              lineWidth: 2
            },
            {
              lineDash: [2, 2],
              stroke: '#000',
              lineWidth: 2
            }
          ]
        },
        label: {
          position: 'middle',
          text: `${(((80 - 129) / 80) * 100).toFixed(0)}%`,
          labelBackground: {
            padding: { left: 4, right: 4, top: 4, bottom: 4 },
            style: {
              fill: '#fff',
              fillOpacity: 1,
              stroke: '#000',
              lineWidth: 1,
              cornerRadius: 4
            }
          },
          style: {
            fill: '#000'
          },
          refY: 0
        },
        endSymbol: {
          size: 12,
          refX: -4
        }
      }
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
