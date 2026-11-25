import type { IArcGraphicAttribute } from '@visactor/vrender-core';
import VChart, { type ICircularProgressChartSpec } from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

const createCircularProgressTickMaskSpec = () => ({
  type: 'circularProgress',
  data: [
    {
      id: 'id0',
      values: [
        { type: 'Tradition Industries', value: 0.795, text: '79.5%' },
        { type: 'Business Companies', value: 0.5, text: '50%' },
        { type: 'Customer-facing Companies', value: 0.25, text: '25%' }
      ]
    }
  ],
  color: ['rgb(255, 222, 0)', 'rgb(171, 205, 5)', 'rgb(0, 154, 68)'],
  valueField: 'value',
  categoryField: 'type',
  seriesField: 'type',
  radius: 0.8,
  innerRadius: 0.4,
  progress: {
    style: {
      innerPadding: 5,
      outerPadding: 5
    },
    state: {
      hover: {
        innerPadding: 0,
        outerPadding: 0
      }
    }
  },
  tickMask: {
    visible: true,
    angle: 10,
    offsetAngle: 0,
    forceAlign: true,
    style: {
      cornerRadius: 15
    }
  },
  axes: [
    {
      visible: false,
      type: 'linear',
      orient: 'angle'
    },
    {
      visible: false,
      type: 'band',
      orient: 'radius'
    }
  ],
  indicator: {
    visible: true,
    trigger: 'hover',
    title: {
      visible: true,
      field: 'type',
      autoLimit: true,
      style: {
        fontSize: 20,
        fill: 'black'
      }
    },
    content: [
      {
        visible: true,
        field: 'text',
        style: {
          fontSize: 16,
          fill: 'gray'
        }
      }
    ]
  },
  legends: {
    visible: true,
    orient: 'bottom',
    title: {
      visible: false
    }
  },
  animation: false
});

describe('circularProgress chart test', () => {
  let container: HTMLElement;
  let dom: HTMLElement;

  beforeEach(() => {
    container = createDiv();
    dom = createDiv(container);
    container.style.position = 'fixed';
    container.style.width = '500px';
    container.style.height = '500px';
    container.style.top = '0px';
    container.style.left = '0px';
  });

  afterEach(() => {
    removeDom(container);
  });

  test.each<[string, Pick<ICircularProgressChartSpec, 'axes' | 'maxValue'>, number]>([
    ['uses maxValue for the generated angle axis', { maxValue: 1000 }, 3.6],
    ['uses maxValue for an angle axis without a maximum', { maxValue: 1000, axes: [{ orient: 'angle' }] }, 3.6],
    ['prefers an explicit angle axis max', { maxValue: 1000, axes: [{ orient: 'angle', max: 40 }] }, 90],
    [
      'prefers an explicit angle axis range.max',
      { maxValue: 1000, axes: [{ orient: 'angle', range: { max: 20 } }] },
      180
    ],
    ['defaults the angle axis maximum to 1', {}, 360]
  ])('%s', (_name, options, expectedDegrees) => {
    const chart = new VChart(
      {
        type: 'circularProgress',
        data: [{ values: [{ category: 'A', value: 10 }] }],
        categoryField: 'category',
        seriesField: 'category',
        valueField: 'value',
        animation: false,
        ...options
      },
      { dom }
    );

    try {
      chart.renderSync();
      const graphics = chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics();
      expect(graphics).toHaveLength(1);
      const { startAngle, endAngle } = graphics[0].attribute as IArcGraphicAttribute;
      expect(((endAngle - startAngle) * 180) / Math.PI).toBeCloseTo(expectedDegrees);
    } finally {
      chart.release();
    }
  });

  test('should pass tickMask arc clip paths to the progress group', () => {
    const chart = new VChart(createCircularProgressTickMaskSpec() as any, {
      dom,
      animation: false
    });

    try {
      chart.renderSync();

      const series = chart
        .getChart()
        .getAllSeries()
        .find(seriesItem => seriesItem.type === 'circularProgress');
      const groupMark = series?.getMarks().find(mark => mark.name === 'group');
      const group = groupMark?.getProduct() as { attribute?: { clip?: boolean; path?: Array<{ type: string }> } };

      expect(group?.attribute?.clip).toBe(true);
      expect(group?.attribute?.path?.length).toBeGreaterThan(1);
      expect(group?.attribute?.path?.every(path => path.type === 'arc')).toBe(true);
    } finally {
      chart.release();
    }
  });
});
