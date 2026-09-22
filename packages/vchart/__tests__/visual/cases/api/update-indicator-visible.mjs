import { verifySpec, verifyRendered } from '../../helpers.mjs';

/**
 * BugServer case IDs: 6795db96d2dacd00b3443edb
 * 验证目的：updateSpecSync 后显示仪表指标文字。
 * 迁移说明：保留源数据、计算和回调；翻译通用显示文字，适配本地宿主。
 * 覆盖边界：保留来源动作或按源事件执行操作并检查结果。
 */
export default {
  createSpec() {
    // 在每次调用中重建原始配置及数据，保留来源中的确定性计算。

    const spec = {
      type: 'pie',
      color: ['#4E83FD', '#50CEFB', '#935AF6', '#FAD355', '#F76964', '#FFA53D'],
      data: {
        values: [
          {
            channel_type: 'Marketplace',
            amount: 262
          },
          {
            channel_type: 'Website',
            amount: 282
          },
          {
            channel_type: 'Mini app',
            amount: 311
          },
          {
            channel_type: 'Store',
            amount: 350
          },
          {
            channel_type: 'Phone',
            amount: 400
          }
        ]
      },
      label: {
        visible: true
      },
      tooltip: {
        mark: {
          content: {}
        },
        dimension: {
          content: {}
        }
      },
      legends: {
        visible: false,
        orient: 'bottom',
        position: 'middle'
      },
      indicator: {
        visible: false,
        title: {
          visible: true,
          style: {
            text: 'bbb'
          }
        },
        content: [
          {
            visible: true,
            style: {
              fontSize: 20,
              text: '2222'
            }
          }
        ]
      },
      valueField: ['amount'],
      categoryField: ['channel_type'],
      innerRadius: 0.55
    };

    return spec;
  },
  async exercise(page) {
    // 适配源动作；鼠标定位按实际图元，避免绑定旧宿主像素坐标。
    await page.evaluate(() => {
      const chart = window.__visualChart;
      const indicator = chart.getSpec().indicator;
      const initial = Array.isArray(indicator) ? indicator[0] : indicator;
      if (
        initial.visible !== false ||
        chart
          .getStage()
          .findAll(
            g =>
              g.type === 'text' && g.attribute.visible !== false && ['bbb', '2222'].includes(String(g.attribute.text)),
            true
          ).length
      )
        throw new Error('indicator 初始隐藏条件不满足');
      window.__indicatorInitiallyHidden = true;
    });
    await page.evaluate(async () => {
      const chart = window.__visualChart;
      const { cases, loadCase } = await import('/suite/cases/index.mjs');
      const spec = (
        await loadCase(cases.find(c => c.id === new URL(location.href).searchParams.get('case')))
      ).createSpec();
      chart.updateSpecSync({ ...spec, indicator: { ...spec.indicator, visible: true } });
    });
  },
  async verify(page) {
    // 完整配置和回调由 verifySpec 检查，另验证最终绘制或操作结果。
    await verifySpec(page, { ...this.createSpec(), indicator: { ...this.createSpec().indicator, visible: true } });
    await verifyRendered(page, 'series');
    await page.evaluate(() => {
      if (!window.__indicatorInitiallyHidden) throw new Error('缺少 indicator 隐藏到显示的状态转换');
      const texts = window.__visualChart
        .getStage()
        .findAll(g => g.type === 'text' && g.attribute.visible !== false, true)
        .map(g => String(g.attribute.text));
      if (!texts.includes('bbb') || !texts.includes('2222')) throw new Error('indicator 更新未显示');
    });
  }
};
