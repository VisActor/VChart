import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
import { interactionTarget } from '../../../interaction-helpers.mjs';
/**
 * BugServer case IDs: 649d7eef52a1e9eec95f9e81
 * 迁移边界：两系列源 mark/dimension 内容回调相同；当前悬停第一系列柱体验证内容，尚未覆盖两个区域所有触发组合。
 * 验证目的：来源 Tooltip 配置、实际提示内容及移出隐藏。
 * 保留条件：来源数据、顺序、配置和回调；仅适配宿主。
 * 交互说明：按实际图元定位重建来源动作，不宣称重放旧宿主坐标。
 */
export default {
  createSpec() {
    // 每次生成独立的完整来源 spec。
    const femaleData = [
      { age: '0-4', type: 'Female', population: 424322, ratio: 0.06948286663944045 },
      { age: '5-9', type: 'Female', population: 410397, ratio: 0.06720264332329326 },
      { age: '10-14', type: 'Female', population: 394139, ratio: 0.06454039049213196 },
      { age: '15-19', type: 'Female', population: 320536, ratio: 0.0524878751069699 },
      { age: '20-24', type: 'Female', population: 259187, ratio: 0.04244195624001737 },
      { age: '25-29', type: 'Female', population: 218716, ratio: 0.03581481671917048 },
      { age: '30-34', type: 'Female', population: 197081, ratio: 0.03227207837483695 },
      { age: '35-39', type: 'Female', population: 183818, ratio: 0.030100257775766196 },
      { age: '40-44', type: 'Female', population: 159793, ratio: 0.026166156147727687 },
      { age: '45-49', type: 'Female', population: 137587, ratio: 0.022529916366157525 },
      { age: '50-54', type: 'Female', population: 109848, ratio: 0.017987646020261157 },
      { age: '55-59', type: 'Female', population: 86294, ratio: 0.014130670796668271 },
      { age: '60-64', type: 'Female', population: 61593, ratio: 0.010085873946962578 },
      { age: '65-69', type: 'Female', population: 41738, ratio: 0.006834611186308901 },
      { age: '70-74', type: 'Female', population: 25694, ratio: 0.004207400925320353 },
      { age: '75-79', type: 'Female', population: 14716, ratio: 0.0024097498255240255 },
      { age: '80-84', type: 'Female', population: 7482, ratio: 0.0012251799534228568 },
      { age: '85-89', type: 'Female', population: 3063, ratio: 0.000501567254388427 },
      { age: '90-94', type: 'Female', population: 798, ratio: 0.00013067276167220526 },
      { age: '95-99', type: 'Female', population: 115, ratio: 0.000018831287709653637 },
      { age: '100+', type: 'Female', population: 5, ratio: 8.187516395501582e-7 }
    ];
    const maleData = [
      { age: '0-4', type: 'Male', population: 432671, ratio: 0.0708500181271613 },
      { age: '5-9', type: 'Male', population: 418331, ratio: 0.06850183842493145 },
      { age: '10-14', type: 'Male', population: 400118, ratio: 0.06551945370270604 },
      { age: '15-19', type: 'Male', population: 324150, ratio: 0.05307966879203676 },
      { age: '20-24', type: 'Male', population: 261253, ratio: 0.042780264417479494 },
      { age: '25-29', type: 'Male', population: 219584, ratio: 0.03595695200379639 },
      { age: '30-34', type: 'Male', population: 196940, ratio: 0.03224898957860163 },
      { age: '35-39', type: 'Male', population: 182855, ratio: 0.029942566209988836 },
      { age: '40-44', type: 'Male', population: 159396, ratio: 0.026101147267547403 },
      { age: '45-49', type: 'Male', population: 135222, ratio: 0.022142646840650298 },
      { age: '50-54', type: 'Male', population: 105681, ratio: 0.017305298403860053 },
      { age: '55-59', type: 'Male', population: 80496, ratio: 0.013181246395445908 },
      { age: '60-64', type: 'Male', population: 57129, ratio: 0.009354892483172197 },
      { age: '65-69', type: 'Male', population: 36260, ratio: 0.005937586890017747 },
      { age: '70-74', type: 'Male', population: 20902, ratio: 0.003422709353975481 },
      { age: '75-79', type: 'Male', population: 11231, ratio: 0.0018390799327575654 },
      { age: '80-84', type: 'Male', population: 5326, ratio: 0.0008721342464488285 },
      { age: '85-89', type: 'Male', population: 1886, ratio: 0.00030883311843831965 },
      { age: '90-94', type: 'Male', population: 441, ratio: 0.00007221389460832395 },
      { age: '95-99', type: 'Male', population: 62, ratio: 0.000010152520330421962 },
      { age: '100+', type: 'Male', population: 2, ratio: 3.275006558200633e-7 }
    ];
    const spec = {
      type: 'common',
      title: { id: 'title', visible: true, text: '2021 年刚果人口金字塔', subtext: 'Public data source' },
      layout: {
        type: 'grid',
        col: 4,
        row: 4,
        elements: [
          { modelId: 'title', col: 0, row: 0, colSpan: 4 },
          { modelId: 'legend', col: 0, row: 3, colSpan: 4 },
          { modelId: 'leftAxesCountry', col: 0, row: 1 },
          { modelId: 'leftRegion', col: 1, row: 1 },
          { modelId: 'leftAxesValue', col: 1, row: 2 },
          { modelId: 'rightRegion', col: 2, row: 1 },
          { modelId: 'rightAxesCountry', col: 3, row: 1 },
          { modelId: 'rightAxesValue', col: 2, row: 2 }
        ]
      },
      region: [{ id: 'leftRegion' }, { id: 'rightRegion' }],
      legends: [{ visible: true, orient: 'bottom', id: 'legend', interactive: false }],
      series: [
        {
          id: 'male',
          regionId: 'leftRegion',
          type: 'bar',
          data: { id: 'maleData', values: maleData },
          direction: 'horizontal',
          xField: 'ratio',
          yField: 'age',
          bar: { style: { fill: 'steelblue' } },
          label: {
            visible: true,
            position: 'left',
            style: { fill: '#6F6F6F' },
            formatMethod: val => `${(val * 100).toFixed(0)}%`
          },
          tooltip: {
            mark: {
              content: [
                {
                  key: datum => datum.age,
                  value: datum => datum.population
                }
              ]
            },
            dimension: {
              content: [
                {
                  key: datum => datum.age,
                  value: datum => datum.population
                }
              ]
            }
          }
        },
        {
          id: 'female',
          regionId: 'rightRegion',
          type: 'bar',
          data: {
            id: 'femaleData',
            values: femaleData
          },
          direction: 'horizontal',
          xField: 'ratio',
          yField: 'age',
          bar: {
            style: {
              fill: '#EE7989'
            }
          },
          label: {
            visible: true,
            style: {
              fill: '#6F6F6F'
            },
            formatMethod: val => `${(val * 100).toFixed(0)}%`
          },
          tooltip: {
            mark: {
              content: [
                {
                  key: datum => datum.age,
                  value: datum => datum.population
                }
              ]
            },
            dimension: {
              content: [
                {
                  key: datum => datum.age,
                  value: datum => datum.population
                }
              ]
            }
          }
        }
      ],
      axes: [
        {
          id: 'leftAxesCountry',
          regionId: 'leftRegion',
          seriesId: ['male'],
          orient: 'left',
          type: 'band',
          grid: { visible: false },
          label: {
            autoLimit: false
          }
        },
        {
          id: 'rightAxesCountry',
          regionId: 'rightRegion',
          seriesId: ['female'],
          orient: 'right',
          type: 'band',
          grid: { visible: false },
          label: {
            autoLimit: false
          }
        },
        {
          id: 'leftAxesValue',
          regionId: 'leftRegion',
          seriesId: ['male'],
          orient: 'bottom',
          type: 'linear',
          inverse: true,
          min: 0,
          max: 0.1,
          label: {
            formatMethod: val => {
              return `${(val * 100).toFixed(0)}%`;
            }
          }
        },
        {
          id: 'rightAxesValue',
          regionId: 'rightRegion',
          seriesId: ['female'],
          orient: 'bottom',
          type: 'linear',
          min: 0,
          max: 0.1,
          label: {
            formatMethod: val => {
              return `${(val * 100).toFixed(0)}%`;
            }
          }
        }
      ]
    };
    return spec;
  },
  async exercise(page) {
    // 执行来源配置或回调要求的动作并保存实际结果。

    const p = await interactionTarget(page, 'bar');
    await page.mouse.move(p.x, p.y);
    await page.waitForFunction(() => window.__visualChart.getTooltipHandler()?.isTooltipShown());
    const first = await page.evaluate(() => {
      const c = window.__visualChart;
      const texts = c
        .getStage()
        .findAll(g => g.name?.includes('tooltip'), true)
        .flatMap(g => g.findAll?.(g => g.type === 'text' || g.type === 'richtext', true) ?? [])
        .map(g => JSON.stringify(g.attribute.textConfig ?? g.attribute.text));
      return (
        [...document.querySelectorAll('[class*="tooltip"]')]
          .filter(el => el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden')
          .map(el => el.textContent)
          .join(' ') + texts.join(' ')
      );
    });
    await page.mouse.move(950, 750);
    await page.waitForFunction(() => !window.__visualChart.getTooltipHandler()?.isTooltipShown());
    await page.mouse.move(p.x, p.y);
    await page.waitForFunction(() => window.__visualChart.getTooltipHandler()?.isTooltipShown());
    await page.evaluate(first => (window.__tooltipText = first), first);
  },
  async verify(page) {
    // 核对实际结果；未执行或无效动作必须失败。
    await verifySourceSpec(page);
    await verifyRendered(page);
    await page.evaluate(() => {
      if (!window.__tooltipText?.trim() || !window.__visualChart.getTooltipHandler()?.isTooltipShown())
        throw Error('提示未显示有效内容或未恢复');
    });
  }
};
