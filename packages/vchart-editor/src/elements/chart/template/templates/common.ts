import type { DataInfo, StandardData } from '../../data/interface';

export function getCommonSpec() {
  return {
    type: 'common',
    series: [] as any[],
    legends: {
      id: 'legend-discrete',
      visible: true,
      autoPage: false
    },
    region: [
      {
        id: 'region-0',
        style: {}
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
}

export function getCartesianCommonSpec(direction: 'horizontal' | 'vertical', percent: boolean = false) {
  return {
    direction,
    ...getCommonSpec(),
    axes: getCartesianAxesSpec(direction, percent)
  };
}

export function getCartesianAxesSpec(direction: 'horizontal' | 'vertical', percent: boolean = false) {
  return direction === 'vertical'
    ? [
        {
          orient: 'left',
          id: 'axis-left',
          type: 'linear',
          label: {
            autoLimit: false,
            formatMethod: percent
              ? (v: any) => {
                  return v * 100 + '%';
                }
              : null
          }
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          type: 'band',
          label: {
            autoLimit: false
          }
        }
      ]
    : [
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
            autoLimit: false,
            formatMethod: percent
              ? (v: any) => {
                  return v * 100 + '%';
                }
              : null
          }
        }
      ];
}

export function getCartesianSpec(
  spec: any,
  direction: 'horizontal' | 'vertical',
  data: StandardData,
  info: DataInfo,
  ordinalFieldCount: number = 1,
  opt?: any
) {
  spec.data = [
    {
      id: data.name,
      values: data.latestData,
      fields: data.getFields()
    }
  ];
  const { ordinalFields, linearFields } = getDimensions(info);
  const ordinalField: string[] = [];
  const linearField: string[] = [linearFields[0]];
  let seriesField: string = null;
  ordinalFields.forEach(key => {
    if (ordinalField.length === 0) {
      ordinalField.push(key);
    } else {
      if (!seriesField) {
        seriesField = key;
      }
      if (ordinalField.length < ordinalFieldCount) {
        ordinalField.push(key);
      }
    }
  });
  if (ordinalField.length === 0 || linearField.length === 0) {
    return null;
  }
  spec.series[0].xField = direction === 'vertical' ? ordinalField : linearField;
  spec.series[0].yField = direction === 'vertical' ? linearField : ordinalField;
  spec.series[0].dataId = data.name;
  spec.series[0].seriesField = seriesField;
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
