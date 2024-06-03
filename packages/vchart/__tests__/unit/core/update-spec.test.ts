import type { IBarChartSpec } from '../../../src';
import { default as VChart } from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

describe('vchart updateSpec test', () => {
  let container: HTMLElement;
  let dom: HTMLElement;
  let vchart: VChart;
  beforeAll(() => {
    container = createDiv();
    dom = createDiv(container);
    dom.id = 'container';
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';

    const data = [
      { city: '石家庄', type: '水果', value: 14500 },
      { city: '石家庄', type: '米面', value: 8500 },
      { city: '石家庄', type: '特产零食', value: 10000 },
      { city: '石家庄', type: '茶叶', value: 7000 },
      { city: '深圳', type: '水果', value: 9000 },
      { city: '深圳', type: '米面', value: 8500 },
      { city: '深圳', type: '特产零食', value: 11000 },
      { city: '深圳', type: '茶叶', value: 6000 },
      { city: '温州', type: '水果', value: 16000 },
      { city: '温州', type: '米面', value: 5000 },
      { city: '温州', type: '特产零食', value: 6000 },
      { city: '温州', type: '茶叶', value: 10000 },
      { city: '宁波', type: '水果', value: 14000 },
      { city: '宁波', type: '米面', value: 9000 },
      { city: '宁波', type: '特产零食', value: 10000 },
      { city: '宁波', type: '茶叶', value: 9000 },
      { city: '无锡', type: '水果', value: 14000 },
      { city: '无锡', type: '米面', value: 9000 },
      { city: '无锡', type: '特产零食', value: 10000 },
      { city: '无锡', type: '茶叶', value: 6000 },
      { city: '杭州', type: '水果', value: 9000 },
      { city: '杭州', type: '米面', value: 8500 },
      { city: '杭州', type: '特产零食', value: 10000 },
      { city: '杭州', type: '茶叶', value: 6000 },
      { city: '北京', type: '水果', value: 17000 },
      { city: '北京', type: '米面', value: 6000 },
      { city: '北京', type: '特产零食', value: 7000 },
      { city: '北京', type: '茶叶', value: 10000 },
      { city: '上海', type: '水果', value: 18000 },
      { city: '上海', type: '米面', value: 11000 },
      { city: '上海', type: '特产零食', value: 15000 },
      { city: '上海', type: '茶叶', value: 14000 }
    ];
    const spec = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      markLine: []
    };
    vchart = new VChart(spec, {
      dom
    });
    vchart.renderSync();
  });

  afterAll(() => {
    removeDom(container);
    vchart.release();
  });

  it('should create markLine component', () => {
    const data = [
      { city: '石家庄', type: '水果', value: 14500 },
      { city: '石家庄', type: '米面', value: 8500 },
      { city: '石家庄', type: '特产零食', value: 10000 },
      { city: '石家庄', type: '茶叶', value: 7000 },
      { city: '深圳', type: '水果', value: 9000 },
      { city: '深圳', type: '米面', value: 8500 },
      { city: '深圳', type: '特产零食', value: 11000 },
      { city: '深圳', type: '茶叶', value: 6000 },
      { city: '温州', type: '水果', value: 16000 },
      { city: '温州', type: '米面', value: 5000 },
      { city: '温州', type: '特产零食', value: 6000 },
      { city: '温州', type: '茶叶', value: 10000 },
      { city: '宁波', type: '水果', value: 14000 },
      { city: '宁波', type: '米面', value: 9000 },
      { city: '宁波', type: '特产零食', value: 10000 },
      { city: '宁波', type: '茶叶', value: 9000 },
      { city: '无锡', type: '水果', value: 14000 },
      { city: '无锡', type: '米面', value: 9000 },
      { city: '无锡', type: '特产零食', value: 10000 },
      { city: '无锡', type: '茶叶', value: 6000 },
      { city: '杭州', type: '水果', value: 9000 },
      { city: '杭州', type: '米面', value: 8500 },
      { city: '杭州', type: '特产零食', value: 10000 },
      { city: '杭州', type: '茶叶', value: 6000 },
      { city: '北京', type: '水果', value: 17000 },
      { city: '北京', type: '米面', value: 6000 },
      { city: '北京', type: '特产零食', value: 7000 },
      { city: '北京', type: '茶叶', value: 10000 },
      { city: '上海', type: '水果', value: 18000 },
      { city: '上海', type: '米面', value: 11000 },
      { city: '上海', type: '特产零食', value: 15000 },
      { city: '上海', type: '茶叶', value: 14000 }
    ];
    const spec2 = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      markLine: [
        {
          y: 50000
        }
      ]
    };
    vchart.updateSpecSync(spec2);
    const components = vchart.getChart()?.getComponentsByKey('markLine');
    expect(components?.length).toBe(1);
  });
});
