import { verifySpec, verifyRendered } from '../../../helpers.mjs';
/**
 * BugServer case IDs: 65dc768cdb5fe000ad96fd99
 * 验证目的：最小柱宽与自动带宽。
 * 保留条件：原始数据、顺序、字段关联和配置组合；静态 const 引用按值展开。
 * 迁移说明：仅适配本地宿主及通用文字；不改变数值或数组顺序。
 * 覆盖边界：验证当前静态状态，不计 hover/select 等交互覆盖。
 */
export default {
  createSpec() {
    // 每次生成独立的源配置，避免跨用例共享可变对象。
    return {
      type: 'bar',
      data: [
        {
          id: 'barData',
          values: [
            {
              date: '2019-08-29',
              group: 'Cake',
              value: 154,
              stack: 'Dessert'
            },
            {
              date: '2019-08-29',
              group: 'Bread',
              value: 378,
              stack: 'Dessert'
            },
            {
              date: '2019-08-29',
              group: 'Tea',
              value: 103,
              stack: 'Drink'
            },
            {
              date: '2019-08-29',
              group: 'Coffee',
              value: 310,
              stack: 'Drink'
            },
            {
              date: '2019-08-29',
              group: 'Rib',
              value: 419,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-29',
              group: 'Crayfish',
              value: 810,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-30',
              group: 'Cake',
              value: 153,
              stack: 'Dessert'
            },
            {
              date: '2019-08-30',
              group: 'Bread',
              value: 398,
              stack: 'Dessert'
            },
            {
              date: '2019-08-30',
              group: 'Tea',
              value: 105,
              stack: 'Drink'
            },
            {
              date: '2019-08-30',
              group: 'Coffee',
              value: 298,
              stack: 'Drink'
            },
            {
              date: '2019-08-30',
              group: 'Rib',
              value: 416,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-30',
              group: 'Crayfish',
              value: 796,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-31',
              group: 'Cake',
              value: 151,
              stack: 'Dessert'
            },
            {
              date: '2019-08-31',
              group: 'Bread',
              value: 408,
              stack: 'Dessert'
            },
            {
              date: '2019-08-31',
              group: 'Tea',
              value: 110,
              stack: 'Drink'
            },
            {
              date: '2019-08-31',
              group: 'Coffee',
              value: 302,
              stack: 'Drink'
            },
            {
              date: '2019-08-31',
              group: 'Rib',
              value: 400,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-31',
              group: 'Crayfish',
              value: 811,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-01',
              group: 'Cake',
              value: 135,
              stack: 'Dessert'
            },
            {
              date: '2019-09-01',
              group: 'Bread',
              value: 407,
              stack: 'Dessert'
            },
            {
              date: '2019-09-01',
              group: 'Tea',
              value: 944,
              stack: 'Drink'
            },
            {
              date: '2019-09-01',
              group: 'Coffee',
              value: 298,
              stack: 'Drink'
            },
            {
              date: '2019-09-01',
              group: 'Rib',
              value: 343,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-01',
              group: 'Crayfish',
              value: 771,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-02',
              group: 'Cake',
              value: 997,
              stack: 'Dessert'
            },
            {
              date: '2019-09-02',
              group: 'Bread',
              value: 363,
              stack: 'Dessert'
            },
            {
              date: '2019-09-02',
              group: 'Tea',
              value: 636,
              stack: 'Drink'
            },
            {
              date: '2019-09-02',
              group: 'Coffee',
              value: 239,
              stack: 'Drink'
            },
            {
              date: '2019-09-02',
              group: 'Rib',
              value: 204,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-02',
              group: 'Crayfish',
              value: 641,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-03',
              group: 'Cake',
              value: 984,
              stack: 'Dessert'
            },
            {
              date: '2019-09-03',
              group: 'Bread',
              value: 356,
              stack: 'Dessert'
            },
            {
              date: '2019-09-03',
              group: 'Tea',
              value: 627,
              stack: 'Drink'
            },
            {
              date: '2019-09-03',
              group: 'Coffee',
              value: 241,
              stack: 'Drink'
            },
            {
              date: '2019-09-03',
              group: 'Rib',
              value: 231,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-03',
              group: 'Crayfish',
              value: 646,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-04',
              group: 'Cake',
              value: 943,
              stack: 'Dessert'
            },
            {
              date: '2019-09-04',
              group: 'Bread',
              value: 355,
              stack: 'Dessert'
            },
            {
              date: '2019-09-04',
              group: 'Tea',
              value: 611,
              stack: 'Drink'
            },
            {
              date: '2019-09-04',
              group: 'Coffee',
              value: 259,
              stack: 'Drink'
            },
            {
              date: '2019-09-04',
              group: 'Rib',
              value: 230,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-04',
              group: 'Crayfish',
              value: 666,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-29',
              group: 'Cake(last week)',
              value: -365,
              stack: 'Dessert'
            },
            {
              date: '2019-08-29',
              group: 'Bread(last week)',
              value: -235,
              stack: 'Dessert'
            },
            {
              date: '2019-08-29',
              group: 'Tea(last week)',
              value: -832,
              stack: 'Drink'
            },
            {
              date: '2019-08-29',
              group: 'Coffee(last week)',
              value: -610,
              stack: 'Drink'
            },
            {
              date: '2019-08-29',
              group: 'Rib(last week)',
              value: -305,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-29',
              group: 'Crayfish(last week)',
              value: -462,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-30',
              group: 'Cake(last week)',
              value: -522,
              stack: 'Dessert'
            },
            {
              date: '2019-08-30',
              group: 'Bread(last week)',
              value: -258,
              stack: 'Dessert'
            },
            {
              date: '2019-08-30',
              group: 'Tea(last week)',
              value: -689,
              stack: 'Drink'
            },
            {
              date: '2019-08-30',
              group: 'Coffee(last week)',
              value: -688,
              stack: 'Drink'
            },
            {
              date: '2019-08-30',
              group: 'Rib(last week)',
              value: -106,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-30',
              group: 'Crayfish(last week)',
              value: -159,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-31',
              group: 'Cake(last week)',
              value: -352,
              stack: 'Dessert'
            },
            {
              date: '2019-08-31',
              group: 'Bread(last week)',
              value: -760,
              stack: 'Dessert'
            },
            {
              date: '2019-08-31',
              group: 'Tea(last week)',
              value: -332,
              stack: 'Drink'
            },
            {
              date: '2019-08-31',
              group: 'Coffee(last week)',
              value: -368,
              stack: 'Drink'
            },
            {
              date: '2019-08-31',
              group: 'Rib(last week)',
              value: -222,
              stack: 'Meat dishes'
            },
            {
              date: '2019-08-31',
              group: 'Crayfish(last week)',
              value: -205,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-01',
              group: 'Cake(last week)',
              value: -471,
              stack: 'Dessert'
            },
            {
              date: '2019-09-01',
              group: 'Bread(last week)',
              value: -535,
              stack: 'Dessert'
            },
            {
              date: '2019-09-01',
              group: 'Tea(last week)',
              value: -319,
              stack: 'Drink'
            },
            {
              date: '2019-09-01',
              group: 'Coffee(last week)',
              value: -363,
              stack: 'Drink'
            },
            {
              date: '2019-09-01',
              group: 'Rib(last week)',
              value: -243,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-01',
              group: 'Crayfish(last week)',
              value: -129,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-02',
              group: 'Cake(last week)',
              value: -319,
              stack: 'Dessert'
            },
            {
              date: '2019-09-02',
              group: 'Bread(last week)',
              value: -570,
              stack: 'Dessert'
            },
            {
              date: '2019-09-02',
              group: 'Tea(last week)',
              value: -532,
              stack: 'Drink'
            },
            {
              date: '2019-09-02',
              group: 'Coffee(last week)',
              value: -312,
              stack: 'Drink'
            },
            {
              date: '2019-09-02',
              group: 'Rib(last week)',
              value: -583,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-02',
              group: 'Crayfish(last week)',
              value: -342,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-03',
              group: 'Cake(last week)',
              value: -346,
              stack: 'Dessert'
            },
            {
              date: '2019-09-03',
              group: 'Bread(last week)',
              value: -373,
              stack: 'Dessert'
            },
            {
              date: '2019-09-03',
              group: 'Tea(last week)',
              value: -582,
              stack: 'Drink'
            },
            {
              date: '2019-09-03',
              group: 'Coffee(last week)',
              value: -247,
              stack: 'Drink'
            },
            {
              date: '2019-09-03',
              group: 'Rib(last week)',
              value: -294,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-03',
              group: 'Crayfish(last week)',
              value: -165,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-04',
              group: 'Cake(last week)',
              value: -326,
              stack: 'Dessert'
            },
            {
              date: '2019-09-04',
              group: 'Bread(last week)',
              value: -879,
              stack: 'Dessert'
            },
            {
              date: '2019-09-04',
              group: 'Tea(last week)',
              value: -219,
              stack: 'Drink'
            },
            {
              date: '2019-09-04',
              group: 'Coffee(last week)',
              value: -236,
              stack: 'Drink'
            },
            {
              date: '2019-09-04',
              group: 'Rib(last week)',
              value: -153,
              stack: 'Meat dishes'
            },
            {
              date: '2019-09-04',
              group: 'Crayfish(last week)',
              value: -253,
              stack: 'Meat dishes'
            }
          ]
        }
      ],
      barMinWidth: 30,
      autoBandSize: {
        extend: 0
      },
      scrollBar: {
        orient: 'bottom',
        auto: true
      },
      xField: ['date', 'stack'],
      yField: 'value',
      seriesField: 'group',
      stack: true,
      stackCornerRadius: 1000,
      axes: [
        {
          orient: 'left',
          title: {
            visible: true,
            text: 'Week-on-week (sales)'
          },
          tick: {
            tickCount: 10
          }
        },
        {
          orient: 'bottom',
          domainLine: {
            onZero: true
          }
        }
      ],
      legends: {
        visible: true
      }
    };
  },
  async verify(page) {
    // 严格核对输入条件并检查实际图元；布局和样式由截图及受控变异验证。
    await verifySpec(page, this.createSpec());
    await verifyRendered(page, 'series');
  }
};
