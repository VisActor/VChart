import type { IBarChartSpec } from '../../../src';
import { default as VChart } from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

describe('vchart event test', () => {
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
    const spec: IBarChartSpec = {
      type: 'bar',
      data: [
        {
          id: 'bar',
          values: data
        }
      ],
      // xField: ['city', 'type'],
      xField: ['city'],
      yField: 'value',
      seriesField: 'type',
      axes: [
        {
          orient: 'left',
          id: 'axis-left'
        },
        {
          orient: 'bottom',
          id: 'axis-bottom'
        }
      ],
      legends: {
        id: 'legend',
        orient: 'right',
        position: 'start',
        padding: {
          left: 12
        },
        item: {
          focus: true
        },
        defaultSelected: ['特产零食', '米面'],
        allowAllCanceled: true
      },
      label: {
        visible: true,
        interactive: true
      },
      totalLabel: {
        visible: true,
        interactive: true
      }
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

  it('should fire pointerdown event', () => {
    const axisEventSpy = jest.fn();
    vchart.on('pointerdown', { type: 'axis', level: 'model' }, axisEventSpy);
    vchart.on('pointerdown', { id: 'axis-bottom', level: 'model' }, axisEventSpy);

    const axis = vchart.getComponents().find(com => com.type === 'cartesianAxis-band');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    axis?.event.emit('pointerdown', { model: axis });
    expect(axisEventSpy).toBeCalledTimes(2);

    const legendEventSpy = jest.fn();
    vchart.on('pointerdown', { type: 'legend', level: 'model' }, legendEventSpy);
    vchart.on('pointerdown', { id: 'legend' }, legendEventSpy);

    const legend = vchart.getComponents().find(com => com.type === 'discreteLegend');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    legend?.event.emit('pointerdown', { model: legend });
    expect(legendEventSpy).toBeCalledTimes(2);
  });

  it('should fire legendItemClick event only once', () => {
    const legendItemClickSpy = jest.fn();
    vchart.on('legendItemClick', legendItemClickSpy);
    vchart.on('legendItemClick', { level: 'model' }, legendItemClickSpy);

    const legend = vchart.getComponents().find(com => com.type === 'discreteLegend');
    legend?.getVRenderComponents()[0]._dispatchEvent('legendItemClick', {});
    expect(legendItemClickSpy).toBeCalledTimes(2);
  });

  it('should fire label event', () => {
    const labelEventSpy = jest.fn();
    vchart.on('click', { level: 'model', type: 'label' }, labelEventSpy);

    const labelModel = vchart.getComponents().find(com => com.type === 'label');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    labelModel?.event.emit('click', { model: labelModel });

    expect(labelEventSpy).toBeCalledTimes(1);
  });

  it('should fire totalLabel event', () => {
    const labelEventSpy = jest.fn();
    vchart.on('click', { level: 'model', type: 'totalLabel' }, labelEventSpy);

    const labelModel = vchart.getComponents().find(com => com.type === 'totalLabel');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    labelModel?.event.emit('click', { model: labelModel });

    expect(labelEventSpy).toBeCalledTimes(1);
  });
});
