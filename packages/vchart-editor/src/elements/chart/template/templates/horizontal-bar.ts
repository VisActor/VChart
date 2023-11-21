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
      direction: 'horizontal',
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
      type: 'band',
      label: {
        autoLimit: false
      }
    },
    {
      orient: 'bottom',
      id: 'axis-bottom',
      type: 'linear',
      label: {
        autoLimit: false
      }
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
    visible: true,
    autoPage: false
  },
  region: [
    {
      id: 'region-0'
    }
  ],
  title: {
    id: 'title',
    visible: true,
    textStyle: {
      text: '标题'
    }
  }
};

export class HorizontalBarTemp extends BaseTemp {
  type = 'horizontalBar';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    const yField: string[] = [];
    const xField: string[] = [];
    Object.keys(info).forEach(key => {
      if (info[key].type === 'linear') {
        xField.length === 0 && xField.push(key);
      } else if (info[key].type === 'ordinal') {
        yField.push(key);
      }
    });
    if (yField.length === 0 || xField.length === 0) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const tempSpec = cloneDeep(spec);
    tempSpec.data = [
      {
        id: data.name,
        values: data.latestData,
        fields: data.getFields()
      }
    ];
    const yField: string[] = [];
    const xField: string[] = [];
    let seriesField: string = null;
    Object.keys(info).forEach(key => {
      if (key.startsWith('VGRAMMAR_') || key.startsWith('__VCHART_')) {
        return;
      }
      if (info[key].type === 'linear') {
        xField.length === 0 && xField.push(key);
      } else if (info[key].type === 'ordinal') {
        if (yField.length === 0) {
          yField.push(key);
        } else if (!seriesField) {
          seriesField = key;
        } else {
          yField.push(key);
        }
      }
    });
    if (yField.length === 0 || xField.length === 0) {
      return null;
    }
    tempSpec.series[0].yField = yField;
    tempSpec.series[0].xField = xField;
    tempSpec.series[0].dataId = data.name;
    tempSpec.series[0].seriesField = seriesField;
    return tempSpec;
  }
}
