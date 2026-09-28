import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0436
 * 验证目的：横向箱线图正负异常点。
 * 保留条件：原始数据与配置；通用文字翻译保留字段关联和长标签场景。
 * 覆盖边界：仅检查静态最终状态；不计动画或未执行的交互配置。
 */
export default {
  createSpec() {
    // 返回来源的独立确定性配置。
    return {
      type: 'boxPlot',
      data: [
        {
          name: 'boxPlot',
          fields: {
            y1: {
              alias: 'Maximum'
            },
            y5: {
              alias: 'Minimum'
            }
          },
          values: [
            {
              x: 'group1',
              y1: 1600,
              y2: 1200,
              y3: 800,
              y4: 700,
              y5: 500,
              outliers: [2000, 2200]
            },
            {
              x: 'group2',
              y1: 1900,
              y2: 1000,
              y3: 400,
              y4: 300,
              y5: 100,
              outliers: [2500]
            },
            {
              x: 'group3',
              y1: 1300,
              y2: 1200,
              y3: 200,
              y4: -100,
              y5: -500,
              outliers: [-1000, 1800, 2300]
            },
            {
              x: 'group4',
              y1: 1400,
              y2: 1000,
              y3: 900,
              y4: 800,
              y5: 500,
              outliers: [-2000]
            },
            {
              x: 'group5',
              y1: 1200,
              y2: 500,
              y3: 400,
              y4: -100,
              y5: -400,
              outliers: [-500, -1340]
            },
            {
              x: 'group6',
              y1: 1400,
              y2: 1000,
              y3: 900,
              y4: 700,
              y5: 300,
              outliers: [3200]
            }
          ]
        }
      ],
      yField: 'x',
      height: 500,
      minField: 'y5',
      q1Field: 'y4',
      medianField: 'y3',
      q3Field: 'y2',
      maxField: 'y1',
      outliersField: 'outliers',
      direction: 'horizontal',
      outliersStyle: {
        fill: '#FE6244',
        size: 10
      },
      crosshair: {
        trigger: ['click', 'hover'],
        yField: {
          line: {
            visible: true,
            type: 'rect',
            width: '150%'
          },
          label: {
            visible: false
          }
        }
      },
      boxPlot: {
        style: {
          shaftFillOpacity: 0.5,
          lineWidth: 2,
          shaftWidth: 50,
          stroke: '#62CDFF',
          boxFill: '#9E4784',
          shaftShape: 'bar'
        },
        state: {
          selected: {
            stroke: 'yellow',
            lineWidth: 10
          },
          hover: {
            stroke: 'blue',
            lineWidth: 10
          }
        }
      }
    };
  },
  async verify(page) {
    // 配置和绘制检查与视觉差异共同验证目标条件。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page);
  }
};
