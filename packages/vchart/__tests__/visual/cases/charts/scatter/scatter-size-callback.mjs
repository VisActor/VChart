import { verifySourceSpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 646745e9cb5fa8011f4e0424
 * 验证目的：反向坐标轴与散点大小回调。
 * 保留条件：保留源数据、确定性计算、回调及配置组合。
 * 迁移说明：仅适配宿主和通用文字；内联 SVG 使用原始路径，不依赖网络。
 * 覆盖边界：检查当前静态状态，不把交互配置或动画配置出现计作行为覆盖。
 */
export default {
  createSpec() {
    // 重建原始声明与回调，保留数据关系和计算顺序。
    const data = [
      {
        values: [
          {
            x: 936196,
            size: 83431,
            y: 1371,
            type: 'Technology',
            area: 'Northeast'
          },
          {
            x: 1270911,
            size: 219815,
            y: 5590,
            type: 'Office supplies',
            area: 'Central South'
          },
          {
            x: 453898,
            size: 19061,
            y: 727,
            type: 'Technology',
            area: 'Southwest'
          },
          {
            x: 919743,
            size: 148800,
            y: 1199,
            type: 'Furniture',
            area: 'North'
          },
          {
            x: 1676224,
            size: 163453,
            y: 2517,
            type: 'Furniture',
            area: 'East'
          },
          {
            x: 1466575,
            size: 251487,
            y: 2087,
            type: 'Technology',
            area: 'Central South'
          },
          {
            x: 824673,
            size: 86067,
            y: 3622,
            type: 'Office supplies',
            area: 'Northeast'
          },
          {
            x: 230956,
            size: 24016,
            y: 347,
            type: 'Technology',
            area: 'Northwest'
          },
          {
            x: 1599653,
            size: 228179,
            y: 2183,
            type: 'Technology',
            area: 'East'
          },
          {
            x: 745813,
            size: 137265,
            y: 3020,
            type: 'Office supplies',
            area: 'North'
          },
          {
            x: 267870,
            size: 49633,
            y: 970,
            type: 'Office supplies',
            area: 'Northwest'
          },
          {
            x: 1408628,
            size: 215585,
            y: 6341,
            type: 'Office supplies',
            area: 'East'
          },
          {
            x: 781743,
            size: 144986,
            y: 927,
            type: 'Technology',
            area: 'North'
          },
          {
            x: 501533,
            size: 29303,
            y: 814,
            type: 'Furniture',
            area: 'Southwest'
          },
          {
            x: 920698,
            size: 72692,
            y: 1470,
            type: 'Furniture',
            area: 'Northeast'
          },
          {
            x: 316212,
            size: 24903,
            y: 468,
            type: 'Furniture',
            area: 'Northwest'
          },
          {
            x: 1399928,
            size: 199582,
            y: 2023,
            type: 'Furniture',
            area: 'Central South'
          },
          {
            x: 347692,
            size: 49272,
            y: 1858,
            type: 'Office supplies',
            area: 'Southwest'
          }
        ]
      }
    ];
    const spec = {
      type: 'scatter',
      data: data,
      xField: 'x',
      yField: 'y',
      seriesField: 'type',
      size: data => Math.sqrt(data['size'] / 10, 2),
      point: {
        state: {
          hover: {
            scaleX: 1.2,
            scaleY: 1.2
          }
        }
      },
      axes: [
        { orient: 'left', range: { min: 0 }, type: 'linear', inverse: true },
        { orient: 'bottom', label: { visible: true }, type: 'band' }
      ],
      legends: [
        {
          visible: true,
          orient: 'left',
          position: 'start',
          title: {
            visible: true,
            style: {
              text: 'Title'
            }
          },
          item: {
            visible: true
          }
        }
      ],
      direction: 'horizontal'
    };

    return spec;
  },
  async verify(page) {
    // 同浏览器重建期望配置，并要求目标内容实际绘制。
    await verifySourceSpec(page);
    await verifyRendered(page);
  }
};
