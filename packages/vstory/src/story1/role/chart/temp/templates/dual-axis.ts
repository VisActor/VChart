import { array } from '@visactor/vutils';
import type { IDataValue, StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { fillCartesianSeriesSpec, getCartesianCommonSpec } from './common';
import { TemplateChartType } from '../constant';

export function specLeft() {
  return {
    type: 'bar',
    stack: true,
    bar: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    label: {
      visible: true,
      position: 'inside',
      style: {
        lineHeight: '100%',
        fontSize: 16,
        fontWeight: 'bold'
      },
      overlap: true,
      smartInvert: true
    }
  };
}

export function specRight() {
  return {
    type: 'line',
    stack: false,
    line: {
      style: {
        lineCap: 'butt'
      }
    },
    label: {
      visible: true,
      position: 'inside',
      fontSize: 16,
      fontWeight: 'bold'
    }
  };
}

export class DualAxisTemp extends BaseTemp {
  static type = TemplateChartType.dualAxis;
  type = DualAxisTemp.type;
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    data = array(data);
    if (data.length < 2) {
      return false;
    }
    return true;
  }
  getSpec(data: StandardData, info: DataInfo, opt?: any) {
    const spec = getCartesianCommonSpec('vertical') as any;
    const dList = array(data);
    spec.data = dList;
    spec.series = dList.map((d: IDataValue, index: number) => {
      const seriesSpec = fillCartesianSeriesSpec(index === dList.length - 1 ? specRight() : specLeft(), 'vertical', d, {
        multiDimensionField: false,
        stack: false
      });
      seriesSpec.id = `series_${index}`;
      return seriesSpec;
    });
    spec.axes.find((a: any) => a.orient === 'left').seriesIndex = new Array(dList.length - 1).fill(0).map((v, i) => i);
    spec.axes.push({
      orient: 'right',
      id: 'axis-right',
      type: 'linear',
      label: {
        autoLimit: false,
        style: {
          fill: '#1F2329',
          fontSize: 16
        }
      },
      seriesIndex: [dList.length - 1],
      maxWidth: null as number,
      maxHeight: null as number
    });
    spec.exMark = 'dual-axis';
    return spec;
  }
}
