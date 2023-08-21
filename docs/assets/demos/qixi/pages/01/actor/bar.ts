import { ICommonChartSpec } from '@visactor/vchart';
import { Page01YearData } from '../../../data/01/interface';

export const getBarData = (data: Page01YearData): any => {
  const { year, boy, girl } = data;
  return [
    {
      id: 'year',
      values: [
        {
          year
        }
      ]
    },
    {
      id: 'maleData',
      values: [
        {
          age: '0',
          type: 'Male',
          ratio: boy?.progress ?? 0
        }
      ]
    },
    {
      id: 'femaleData',
      values: [
        {
          age: '0',
          type: 'Female',
          ratio: girl?.progress ?? 0
        }
      ]
    }
  ];
};

export const getBarSpec = (): ICommonChartSpec => ({
  type: 'common',
  background: 'transparent',
  data: [
    {
      id: 'year',
      values: [
        {
          year: ''
        }
      ]
    },
    {
      id: 'maleData',
      values: [
        {
          age: '0',
          type: 'Male',
          ratio: 0
        }
      ]
    },
    {
      id: 'femaleData',
      values: [
        {
          age: '0',
          type: 'Female',
          ratio: 0
        }
      ]
    }
  ],
  padding: {
    left: 10,
    right: 10
  },
  layout: {
    type: 'grid',
    col: 4,
    row: 4,
    elements: [
      { modelId: 'year', col: 0, row: 0, colSpan: 4 },

      { modelId: 'legend', col: 0, row: 3, colSpan: 4 },

      { modelId: 'leftAxesCountry', col: 3, row: 1 },
      { modelId: 'leftRegion', col: 2, row: 1 },
      { modelId: 'leftAxesValue', col: 2, row: 2 },

      { modelId: 'rightRegion', col: 1, row: 1 },
      { modelId: 'rightAxesCountry', col: 0, row: 1 },
      { modelId: 'rightAxesValue', col: 1, row: 2 }
    ]
  },
  region: [{ id: 'leftRegion' }, { id: 'rightRegion' }],
  legends: [
    {
      visible: true,
      orient: 'bottom',
      id: 'legend',
      interactive: false,
      padding: { top: 10 }
    }
  ],
  series: [
    {
      id: 'male',
      regionId: 'leftRegion',
      type: 'bar',
      dataId: 'maleData',
      direction: 'horizontal',
      xField: 'ratio',
      yField: 'age',
      bar: {
        style: {
          fill: 'steelblue'
        }
      },
      label: {
        visible: true,
        position: 'left',
        style: {
          fill: '#6F6F6F'
        },
        formatMethod: (val: any) => `${(val * 100).toFixed(0)}%`
      }
    },
    {
      id: 'female',
      regionId: 'rightRegion',
      type: 'bar',
      dataId: 'femaleData',
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
        formatMethod: (val: any) => `${(val * 100).toFixed(0)}%`
      }
    }
  ],
  customMark: [
    {
      id: 'year',
      type: 'text' as any,
      dataId: 'year',
      style: {
        textBaseline: 'top',
        fontSize: 180,
        textAlign: 'center',
        fontWeight: 600,
        text: (datum: any) => datum.year,
        x: 490,
        y: 20,
        fill: 'grey',
        fillOpacity: 0.5
      }
    }
  ],
  axes: [
    {
      id: 'leftAxesCountry',
      visible: false,
      regionId: 'leftRegion',
      seriesId: ['male'],
      orient: 'left',
      type: 'band',
      grid: { visible: false }
    },
    {
      visible: false,
      id: 'rightAxesCountry',
      regionId: 'rightRegion',
      seriesId: ['female'],
      orient: 'right',
      type: 'band',
      grid: { visible: false }
    },
    {
      id: 'leftAxesValue',
      regionId: 'leftRegion',
      seriesId: ['male'],
      orient: 'bottom',
      type: 'linear',
      inverse: true,
      min: 0,
      max: 1,
      label: {
        formatMethod: (val: any) => {
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
      max: 1,
      label: {
        formatMethod: (val: any) => {
          return `${(val * 100).toFixed(0)}%`;
        }
      }
    }
  ]
});
