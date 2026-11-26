import { verifyRendered, verifySpec } from '../../../helpers.mjs';

/**
 * 验证目的：复现 #3923，锁定显式设置轴宽后的单位文字渲染。
 * 图表类型：柱线组合图，两个系列分别绑定左右轴。
 * 关键配置：左轴 width: 50，右轴 width: '20%'，两轴都开启 unit.visible；顶部无留白或图例。
 * 最终检查：轴宽保持指定值，两侧单位文字都位于画布内，且不遮挡刻度文字。
 * 覆盖边界：检查初次布局，不覆盖后续尺寸变化。
 */
export default {
  createSpec() {
    return {
      type: 'common',
      padding: { top: 0, left: 0, right: 0 },
      data: {
        values: [
          { day: 'Mon', orders: 25, revenue: 100000 },
          { day: 'Tue', orders: 30, revenue: 26000 },
          { day: 'Wed', orders: 24, revenue: 54000 }
        ]
      },
      series: [
        { id: 'orders', type: 'bar', xField: 'day', yField: 'orders' },
        { id: 'revenue', type: 'line', xField: 'day', yField: 'revenue' }
      ],
      axes: [
        { id: 'orders-axis', orient: 'left', seriesId: ['orders'], width: 50, unit: { visible: true, text: 'Orders' } },
        {
          id: 'revenue-axis',
          orient: 'right',
          seriesId: ['revenue'],
          width: '20%',
          grid: { visible: false },
          unit: { visible: true, text: 'Revenue', style: { textAlign: 'left' } }
        },
        { orient: 'bottom', type: 'band' }
      ]
    };
  },
  async verify(page) {
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const chart = window.__visualChart;
      const stage = chart.getStage();
      const axes = [
        { id: 'orders-axis', width: 50, text: 'Orders' },
        { id: 'revenue-axis', width: stage.width * 0.2, text: 'Revenue' }
      ];
      const missingUnits = [];
      const overlappingUnits = [];
      const labels = stage.findAll(node => node.name === 'axis-label' && node.attribute.visible !== false, true);
      if (!labels.some(label => label.attribute.text === 100000)) {
        throw new Error('缺少用于检查单位摆放的右轴最高刻度');
      }
      for (const { id, width, text } of axes) {
        const axis = chart.getChart().getComponentByUserId(id);
        if (Math.abs(axis.getLayoutRect().width - width) > 1e-6) {
          throw new Error(`轴 ${id} 未保留指定宽度 ${width}`);
        }
        const graphic = stage.find(node => node.name === 'axis-unit' && node.attribute.text === text, true);
        if (!graphic || graphic.attribute.visible === false) {
          missingUnits.push(text);
          continue;
        }
        const bounds = graphic.globalAABBBounds;
        if (
          bounds.width() <= 0 ||
          bounds.height() <= 0 ||
          bounds.x1 < 0 ||
          bounds.y1 < 0 ||
          bounds.x2 > stage.width ||
          bounds.y2 > stage.height
        ) {
          missingUnits.push(text);
        }
        if (
          labels.some(label => {
            const tick = label.globalAABBBounds;
            return bounds.x1 < tick.x2 && bounds.x2 > tick.x1 && bounds.y1 < tick.y2 && bounds.y2 > tick.y1;
          })
        ) {
          overlappingUnits.push(text);
        }
      }
      if (missingUnits.length) {
        throw assertionError(`显式设宽时画布内缺少单位文字 ${missingUnits.join('、')}`);
      }
      if (overlappingUnits.length) {
        throw assertionError(`单位文字遮挡刻度 ${overlappingUnits.join('、')}`);
      }
    });
  }
};
