import { cloneDeep } from '@visactor/vutils';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './baseTemp';

const spec = {
  type: 'common',
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
      },
      label: {
        visible: true,
        position: 'inside'
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
  region: [
    {
      id: 'region-0',
      style: {
        // fill: 'red'
      }
    }
  ],
  tooltip: {
    visible: true
  },
  title: {
    id: 'title',
    visible: true,
    text: '标题'
  }
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
    let seriesField: string = null;
    Object.keys(info).forEach(key => {
      if (key.startsWith('VGRAMMAR_') || key.startsWith('__VCHART_')) {
        return;
      }
      if (info[key].type === 'linear') {
        yField.length === 0 && yField.push(key);
      } else if (info[key].type === 'ordinal') {
        if (xField.length === 0) {
          xField.push(key);
        } else if (!seriesField) {
          seriesField = key;
        } else {
          xField.push(key);
        }
      }
    });
    if (xField.length === 0 || yField.length === 0) {
      return null;
    }
    tempSpec.series[0].xField = xField;
    tempSpec.series[0].yField = yField;
    tempSpec.series[0].dataId = data.name;
    tempSpec.series[0].seriesField = seriesField;
    return tempSpec;
  }
}
