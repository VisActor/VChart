import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 656ed91cd91546008d295158
 * 验证目的：依据轴域和数据计算线、区、点坐标。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'line',
      data: {
        id: 'data2',
        values: [
          { x: 1, y: 80 },
          { x: 2, y: 40 },
          { x: 3, y: 10 },
          { x: 4, y: 20 }
        ]
      },
      xField: 'x',
      yField: 'y',
      markLine: [
        {
          coordinates: [
            {
              x: (data, startData, endData, series) => {
                const scale = series.getXAxisHelper().getScale(0);
                console.log(scale.domain());
                return scale.domain()[1];
              },
              y: (data, startData, endData, series) => {
                const scale = series.getYAxisHelper().getScale();
                console.log(scale.domain());
                return scale.domain()[1];
              }
            },
            { x: '4', y: 10 }
          ]
        }
      ],
      markArea: [
        {
          coordinates: [
            { x: data => data[0].x, y: data => data[0].y },
            { x: data => data[1].x, y: data => data[1].y },
            { x: data => data[2].x, y: data => data[2].y },
            { x: data => data[3].x, y: data => data[3].y }
          ]
        }
      ],
      markPoint: [
        {
          coordinate: {
            x: data => data[1].x,
            y: data => {
              let a = 0;
              data.forEach(datum => (a += datum.y));
              return a / data.length;
            }
          }
        },
        { x: '3', y: 50 }
      ]
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
