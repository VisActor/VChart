import type { IDataValue } from '../../data/interface';
import { array } from '@visactor/vutils';
import type { DataInfo, StandardData } from '../../data/interface';
import { ChartDimensionField, ChartTypeField, ChartValueField } from '../../const';

export function getCommonSpec() {
  return {
    type: 'common',
    series: [] as any[],
    region: [
      {
        id: 'region-0'
      }
    ]
  };
}

export function getPolarCommonSpec() {
  return {
    ...getCommonSpec(),
    axes: getPolarAxesSpec()
  };
}

export function getPolarAxesSpec() {
  return [
    {
      orient: 'radius'
    },
    {
      orient: 'angle'
    }
  ];
}

export function getPolarSpec(
  seriesSpec: () => any,
  spec: any,
  data: StandardData,
  option: {
    seriesField?: string;
    categoryField: string;
    valueField: string;
  }
) {
  spec.data = array(data);
  spec.series = spec.data.map((d: IDataValue) => {
    return fillPolarSeriesSpec(seriesSpec(), d, option);
  });
  return spec;
}

export function fillPolarSeriesSpec(
  spec: any,
  d: IDataValue,
  option: {
    seriesField?: string;
    categoryField: string;
    valueField: string;
  }
) {
  spec.dataId = d.id;
  spec.id = `series-${d.id}`;
  spec.seriesField = option.seriesField;
  return spec;
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
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          type: 'band',
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
          autoIndent: false,
          maxWidth: null as number,
          maxHeight: null as number,
          trimPadding
        },
        {
          orient: 'bottom',
          id: 'axis-bottom',
          type: 'linear',
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
    xField: string[] | string;
    yField: string[] | string;
    seriesField: string;
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
    xField: string[] | string;
    yField: string[] | string;
    seriesField: string;
  }
) {
  spec.xField = option.xField;
  spec.yField = option.yField;
  spec.dataId = d.id;
  spec.id = `series-${d.id}`;
  spec.seriesField = option.seriesField;
  spec.stack = option.stack === true;
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
