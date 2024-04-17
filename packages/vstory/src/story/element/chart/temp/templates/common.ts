import type { IDataValue } from './../../data/interface';
import { ChartDimensionField, ChartTypeField, ChartValueField } from './../../../../core/const';
import { array } from '@visactor/vutils';
import type { DataInfo, StandardData } from '../../data/interface';

export function getCommonSpec() {
  return {
    type: 'common',
    color: ['#00295C', '#2568BD', '#9F9F9F', '#C5C5C5', '#00B0F0', '#4BCFFF', '#C2C2C2', '#D7D7D7'],
    series: [] as any[],
    legends: {
      id: 'legend-discrete',
      visible: true,
      autoPage: false,
      position: 'start',
      interactive: false,
      item: {
        label: {
          style: {
            fill: '#1F2329',
            fontSize: 16
          }
        }
      }
    },
    region: [
      {
        id: 'region-0'
      }
    ],
    tooltip: {
      visible: true
    }
  };
}

export function getCartesianCommonSpec(direction: 'horizontal' | 'vertical', percent = false, trimPadding = false) {
  return {
    direction,
    ...getCommonSpec(),
    axes: getCartesianAxesSpec(direction, percent, trimPadding)
  };
}

export function getCartesianAxesSpec(direction: 'horizontal' | 'vertical', percent = false, trimPadding = false) {
  return direction === 'vertical'
    ? [
        {
          orient: 'left',
          id: 'axis-left',
          type: 'linear',
          label: {
            autoLimit: false,
            style: {
              fill: '#1F2329',
              fontSize: 16
            },
            formatMethod: percent
              ? (v: any) => {
                  return `${(v * 100).toFixed(0)}%`;
                }
              : null
          },
          domainLine: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          tick: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          grid: {
            visible: false,
            style: {
              stroke: '#bbbfc4'
            }
          },
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          type: 'band',
          label: {
            autoLimit: false,
            style: {
              fill: '#1F2329',
              fontSize: 16
            }
          },
          domainLine: {
            visible: true,
            style: {
              stroke: '#000000'
            },
            onZero: true
          },
          tick: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          grid: {
            visible: false,
            style: {
              stroke: '#bbbfc4'
            }
          },
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number,
          trimPadding,
          paddingInner: [0.2, 0],
          paddingOuter: [0.2, 0]
        }
      ]
    : [
        {
          orient: 'left',
          id: 'axis-left',
          type: 'band',
          label: {
            autoLimit: false,
            style: {
              fill: '#1F2329',
              fontSize: 16
            }
          },
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number,
          trimPadding,
          domainLine: {
            visible: true,
            style: {
              stroke: '#000000'
            },
            onZero: true
          },
          tick: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          grid: {
            visible: false,
            style: {
              stroke: '#bbbfc4'
            }
          }
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          type: 'linear',
          label: {
            autoLimit: false,
            style: {
              fill: '#1F2329',
              fontSize: 16
            },
            formatMethod: percent
              ? (v: any) => {
                  return `${(v * 100).toFixed(0)}%`;
                }
              : null
          },
          domainLine: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          tick: {
            visible: true,
            style: {
              stroke: '#000000'
            }
          },
          grid: {
            visible: false,
            style: {
              stroke: '#bbbfc4'
            }
          },
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number
        }
      ];
}

export function getCartesianSpec(
  seriesSpec: () => any,
  spec: any,
  direction: 'horizontal' | 'vertical',
  data: StandardData,
  option: {
    multiDimensionField?: boolean;
    stack?: boolean;
  }
) {
  spec.data = array(data);
  spec.series = spec.data.map((d: IDataValue) => {
    return fillCartesianSeriesSpec(seriesSpec(), direction, d, option);
  });
  return spec;
}

export function fillCartesianSeriesSpec(
  spec: any,
  direction: 'horizontal' | 'vertical',
  d: IDataValue,
  option: {
    multiDimensionField?: boolean;
    stack?: boolean;
  }
) {
  spec.xField = direction === 'vertical' ? ChartDimensionField : ChartValueField;
  spec.yField = direction === 'vertical' ? ChartValueField : ChartDimensionField;
  spec.dataId = d.id;
  spec.id = `series-${d.id}`;
  spec.seriesField = ChartTypeField;
  spec.stack = option.stack === true;
  if (option.multiDimensionField === true) {
    if (direction === 'vertical') {
      spec.xField = [spec.xField, spec.seriesField];
    } else {
      spec.yField = [spec.yField, spec.seriesField];
    }
  }
  return spec;
}

export function getDimensions(info: DataInfo) {
  const ordinalFields: string[] = [];
  const linearFields: string[] = [];
  Object.keys(info).forEach(key => {
    if (key.startsWith('VGRAMMAR_') || key.startsWith('__VCHART_')) {
      return;
    }
    if (info[key].type === 'linear') {
      linearFields.length === 0 && linearFields.push(key);
    } else if (info[key].type === 'ordinal') {
      ordinalFields.push(key);
    }
  });

  return {
    ordinalFields,
    linearFields
  };
}

export function CommonStandardDataCheck(data: StandardData) {
  data = array(data);
  if (data.length === 0) {
    return false;
  }
  // mvp 使用total data 不再使用totalData
  // const totalData = data.find(d => d.sourceKey === 'total');
  // if (totalData && totalData.values.length === 0) {
  //   return false;
  // }
  return true;
}

export function getSeriesLabelSpec(direction: 'horizontal' | 'vertical', visible = true) {
  return {
    visible,
    position: direction === 'vertical' ? 'end' : 'start',
    label: {
      style: {
        lineHeight: '100%',
        lineWidth: 1,
        stroke: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
      },
      space: 10
    }
  };
}

export function getTotalLabelSpec(visible: boolean) {
  return {
    visible,
    position: 'top',
    overlap: false,
    clampForce: false,
    formatConfig: {
      fixed: 0,
      content: 'value'
    },
    style: {
      lineHeight: '100%',
      lineWidth: 1,
      fill: '#1F2329',
      stroke: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold'
    }
  };
}
