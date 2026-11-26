import { interactionFrame } from '../../interaction-helpers.mjs';

/**
 * 验证目的：防止雷达图半径轴的隐藏默认值覆盖主题。
 * 图表类型：radar。
 * 关键配置：theme.component.axisRadius 和 axes 中的半径轴。
 * 场景条件：固定 6 个维度，分别使用默认主题、部分开启和全部开启的主题，再显式关闭轴图元。
 * 最终检查：按半径轴实际生成的标签、轴线和刻度判断可见性，截图记录主题全部开启的效果。
 * 覆盖边界：只检查半径轴的可见性，不检查角度轴及自定义样式。复现源为 GitHub #3371。
 */
export default {
  createSpec() {
    return {
      type: 'radar',
      data: {
        values: ['Strength', 'Speed', 'Shooting', 'Endurance', 'Precision', 'Growth'].map(key => ({
          key,
          value: key === 'Shooting' ? 3 : 5
        }))
      },
      categoryField: 'key',
      valueField: 'value',
      point: { visible: false },
      area: { visible: true },
      axes: [{ orient: 'radius' }]
    };
  },
  async exercise(page) {
    await page.evaluate(spec => {
      const chart = window.__visualChart;
      const { ThemeManager } = window.VChart;

      // 只查半径轴的 VRender 图元，排除角度轴的同名元素。
      const readVisibility = () => {
        const radiusAxis = chart
          .getChart()
          .getComponentsByKey('axes')
          .find(axis => axis.getOrient() === 'radius');
        const groups = radiusAxis?.getVRenderComponents();
        if (!groups?.length) throw new Error('半径轴组件缺失');

        return ['axis-label', 'axis-line', 'axis-tick'].map(name =>
          groups.some(group =>
            group.find(graphic => graphic.name === name && graphic.attribute.visible !== false, true)
          )
        );
      };

      ThemeManager.registerTheme('radar-radius-label', {
        component: { axisRadius: { label: { visible: true } } }
      });
      ThemeManager.registerTheme('radar-radius-layered', {
        component: {
          axis: { label: { visible: true } },
          axisLinear: { domainLine: { visible: true }, tick: { visible: true } },
          axisRadius: { tick: { visible: false } }
        }
      });
      ThemeManager.registerTheme('radar-radius-all', {
        component: { axisRadius: { label: { visible: true }, domainLine: { visible: true }, tick: { visible: true } } }
      });
      const defaultVisibility = readVisibility();
      chart.setCurrentThemeSync('radar-radius-label');
      const labelOnly = readVisibility();
      chart.setCurrentThemeSync('radar-radius-layered');
      const layeredTheme = readVisibility();

      chart.setCurrentThemeSync('radar-radius-all');
      const allVisible = readVisibility();
      chart.updateSpecSync({
        ...spec,
        axes: [
          { orient: 'radius', label: { visible: false }, domainLine: { visible: false }, tick: { visible: false } }
        ]
      });
      const specHidden = readVisibility();
      chart.updateSpecSync(spec);
      window.__radarRadiusVisibility = {
        defaultVisibility,
        labelOnly,
        layeredTheme,
        allVisible,
        specHidden,
        restored: readVisibility()
      };
    }, this.createSpec());
    await interactionFrame(page);
  },
  async verify(page) {
    await page.evaluate(async () => {
      const { assertionError } = await import('/suite/assertions.mjs');
      const visibility = window.__radarRadiusVisibility;
      const expectations = {
        defaultVisibility: [false, false, false],
        labelOnly: [true, false, false],
        layeredTheme: [true, true, false],
        allVisible: [true, true, true],
        specHidden: [false, false, false],
        restored: [true, true, true]
      };
      for (const [phase, expected] of Object.entries(expectations)) {
        const actual = visibility[phase];
        if (expected.some((value, index) => actual[index] !== value)) {
          throw assertionError(`半径轴图元可见性（标签、轴线、刻度）${phase} 预期 ${expected}，实际 ${actual}`);
        }
      }
    });
  }
};
