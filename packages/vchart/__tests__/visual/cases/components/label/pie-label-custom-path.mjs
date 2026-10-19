import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 66abcc3c27f96000ad549eef
 * 验证目的：外标签引导线自定义折角路径。
 * 保留条件：源数据、数组顺序、字段关联、回调及系列组合。
 * 迁移说明：仅适配宿主和已记录的通用文字；不修改原始数值。
 * 覆盖边界：仅验证静态最终状态，不把交互或动画配置视为行为已覆盖。
 */
export default {
  createSpec() {
    // 每次重建独立源配置，保留确定性计算和回调。
    const spec = {
      type: 'pie',
      data: [
        {
          id: 'id0',
          values: [
            { type: 'oxygen', value: '46.60' },
            { type: 'silicon', value: '27.72' },
            { type: 'aluminum', value: '8.13' },
            { type: 'iron', value: '5' },
            { type: 'calcium', value: '3.63' },
            { type: 'sodium', value: '2.83' },
            { type: 'potassium', value: '2.59' },
            { type: 'others', value: '3.5' }
          ]
        }
      ],
      outerRadius: 0.8,
      valueField: 'value',
      categoryField: 'type',
      title: { visible: true, text: 'Statistics of Surface Element Content' },
      legends: { visible: true, orient: 'left' },
      label: {
        visible: true,
        position: 'outside',
        style: { angle: 0 },
        line: {
          line1MinLength: 40,
          line2MinLength: 60,
          customShape: (text, attrs, path) => {
            console.log('attrs', attrs, path);
            let points = attrs.points;
            const direction = points[points.length - 1].x - points[0].x > 0 ? -1 : 1;
            path.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length - 1; i++) {
              const p1 = points[i - 1];
              const p2 = points[i % points.length];
              const p3 = points[(i + 1) % points.length];
              const { x: x1, y: y1 } = p1;
              const { x: x2, y: y2 } = p2;
              const { x: x3, y: y3 } = p3;
              const k1 = (y2 - y1) / (x2 - x1);
              const k2 = (y3 - y2) / (x3 - x2);
              const deltaX = 3;
              const deltaY1 = k1 * deltaX;
              const deltaY2 = k2 * deltaX;
              path.lineTo(p2.x + direction * deltaX, p2.y + direction * deltaY1);
              path.lineTo(p2.x - direction * deltaX, p2.y - direction * deltaY2);
            }
            path.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            return path;
          },
          style: { lineWidth: 1, stroke: 'red' }
        }
      },
      tooltip: { mark: { content: [{ key: datum => datum['type'], value: datum => datum['value'] + '%' }] } }
    };
    return spec;
  },
  async verify(page) {
    // 核对完整输入与有效绘制；目标分支另外经过配置变异验证。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
