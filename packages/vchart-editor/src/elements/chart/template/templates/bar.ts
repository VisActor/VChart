import { cloneDeep } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';

const spec = {
  type: 'common',
  // background: 'transparent',
  series: [
    {
      id: 'bar-0',
      type: 'bar',
      xField: 'State',
      yField: 'Population',
      seriesField: 'Age',
      stack: true,
      bar: {
        // The state style of bar
        state: {
          hover: {
            stroke: '#000',
            lineWidth: 1
          }
        }
      }
    }
  ],
  axes: [
    {
      orient: 'left',
      id: 'axis-left',
      type: 'linear'
    },
    {
      orient: 'bottom',
      id: 'axis-bottom',
      type: 'band'
    }
  ],
  data: [
    {
      id: 'barData',
      values: [
        {
          State: 'WY',
          Age: 'Under 5 Years',
          Population: 25635
        },
        {
          State: 'WY',
          Age: '5 to 13 Years',
          Population: 1890
        },
        {
          State: 'WY',
          Age: '14 to 17 Years',
          Population: 9314
        },
        {
          State: 'DC',
          Age: 'Under 5 Years',
          Population: 30352
        },
        {
          State: 'DC',
          Age: '5 to 13 Years',
          Population: 20439
        },
        {
          State: 'DC',
          Age: '14 to 17 Years',
          Population: 10225
        },
        {
          State: 'VT',
          Age: 'Under 5 Years',
          Population: 38253
        },
        {
          State: 'VT',
          Age: '5 to 13 Years',
          Population: 42538
        },
        {
          State: 'VT',
          Age: '14 to 17 Years',
          Population: 15757
        },
        {
          State: 'ND',
          Age: 'Under 5 Years',
          Population: 51896
        },
        {
          State: 'ND',
          Age: '5 to 13 Years',
          Population: 67358
        },
        {
          State: 'ND',
          Age: '14 to 17 Years',
          Population: 18794
        },
        {
          State: 'AK',
          Age: 'Under 5 Years',
          Population: 72083
        },
        {
          State: 'AK',
          Age: '5 to 13 Years',
          Population: 85640
        },
        {
          State: 'AK',
          Age: '14 to 17 Years',
          Population: 22153
        }
      ]
    }
  ],
  legends: {
    id: 'legend-discrete',
    visible: true
  },
  title: {
    id: 'title',
    visible: true,
    align: 'left',
    verticalAlign: 'top',
    orient: 'top',
    textStyle: {
      character: [
        {
          text: 'Bar Editor Test',
          fontSize: 30,
          textAlign: 'center',
          textDecoration: 'underline',
          stroke: '#0f51b5'
        }
      ]
    },
    subtextStyle: {
      character: [
        {
          text: 'Mapbox',
          fontWeight: 'bold',
          fontSize: 30,
          fill: '#3f51b5'
        },
        {
          text: '',
          fill: '#000'
        },
        {
          text: 'alternative solution',
          fontStyle: 'italic',
          fill: '#3f51b5'
        },
        {
          text: 'sub Title!',
          fill: '#000'
        },
        {
          text: 'Map',
          textDecoration: 'line-through',
          fill: '#000'
        },
        {
          text: '[1]',
          script: 'super',
          fill: '#000'
        }
      ]
    }
  },
  region: [
    {
      id: 'region-0',
      style: {
        // fill: 'red'
      }
    }
  ],
  markLine: [
    {
      interactive: true,
      y: 'average',
      endSymbol: {
        visible: true,
        size: 12,
        refX: 6,
        symbolType: 'triangleLeft',
        autoRotate: false
      },
      label: {
        visible: true,
        autoRotate: false,
        formatMethod: markData => {
          return parseInt(markData[0].y, 10);
        },
        position: 'end',
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000'
        },
        refX: 12,
        refY: 0
      },
      line: {
        style: {
          stroke: '#000'
        }
      }
    }
  ]
};

export class BarTemp extends BaseTemp {
  type = 'bar';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const xField: string[] = [];
    const yField: string[] = [];
    Object.keys(info).forEach(key => {
      if (info[key].type === 'linear') {
        yField.length === 0 && yField.push(key);
      } else if (info[key].type === 'ordinal') {
        xField.push(key);
      }
    });
    if (xField.length === 0 || yField.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const tempSpec = cloneDeep(spec);
    tempSpec.data = [data];
    const xField: string[] = [];
    const yField: string[] = [];
    Object.keys(info).forEach(key => {
      if (info[key].type === 'linear') {
        yField.length === 0 && yField.push(key);
      } else if (info[key].type === 'ordinal') {
        xField.push(key);
      }
    });
    if (xField.length === 0 || yField.length === 0) {
      return null;
    }
    tempSpec.series[0].xField = xField;
    tempSpec.series[0].yField = yField;
    tempSpec.series[0].dataId = data.name;
    return tempSpec;
  }
}
