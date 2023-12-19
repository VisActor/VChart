/**
 * @description 获取标注的默认初始配置
 */
import { v4 as uuidv4 } from 'uuid';
import {
  type IVChart,
  type ICartesianSeries,
  STACK_FIELD_TOTAL_TOP,
  STACK_FIELD_TOTAL,
  STACK_FIELD_END,
  STACK_FIELD_END_PERCENT
} from '@visactor/vchart';
import { MarkerTypeEnum } from '../../interface';
import { getCAGRFormatText, getGrowthFormatText } from './marker-label';
import { average, median, min } from '../math';
import {
  DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE,
  getDefaultGrowthLineOffset,
  groupByFields,
  stackTotal
} from './common';

const defaultLineStyle = {
  stroke: '#000',
  lineWidth: 1,
  pickStrokeBuffer: 16
};

const defaultSymbolStyle = {
  fill: '#000',
  lineWidth: 0,
  stroke: null as any
};

type Datum = {
  [key: string]: any;
};
/**
 * 获取默认值线配置
 * @param chart 图表实例
 */
export function getDefaultValueMarkLineConfig(chart: IVChart, markerType: string) {
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const xAxisTypeIsContinuous = series.getXAxisHelper().isContinuous;
  const yAxisIsContinuous = series.getYAxisHelper().isContinuous;
  const seriesData = series.getRawData().latestData;
  const isPercent = series.getPercent();
  if (markerType === MarkerTypeEnum.horizontalLine) {
    // 水平值线
    if (yAxisIsContinuous) {
      const averageY = average(seriesData, series.getSpec().yField);
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.horizontalLine,
        interactive: true,
        y: isPercent ? 0.5 : 'average',
        endSymbol: {
          visible: true,
          size: 10,
          refX: 6,
          symbolType: 'triangleLeft',
          autoRotate: false,
          style: Object.assign({}, defaultSymbolStyle)
        },
        label: {
          visible: true,
          autoRotate: false,
          text: isPercent ? '50%' : parseInt(`${averageY}`, 10),
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
          style: Object.assign({}, defaultLineStyle)
        },
        _originValue_: isPercent ? 0.5 : averageY
      };
    }

    const yValue = seriesData[0][series.fieldY[0]];
    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.horizontalLine,
      interactive: true,
      y: yValue,
      endSymbol: {
        visible: true,
        size: 10,
        refX: 6,
        symbolType: 'triangleLeft',
        autoRotate: false,
        style: Object.assign({}, defaultSymbolStyle)
      },
      label: {
        visible: true,
        autoRotate: false,
        text: yValue,
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
        style: Object.assign({}, defaultLineStyle)
      },
      _originValue_: yValue
    };
  }

  if (markerType === MarkerTypeEnum.verticalLine) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
      const xValue = average(seriesData, series.getSpec().xField);
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.verticalLine,
        interactive: true,
        x: isPercent ? 0.5 : 'average',
        endSymbol: {
          visible: true,
          size: 10,
          refX: 6,
          symbolType: 'triangleDown',
          autoRotate: false,
          style: Object.assign({}, defaultSymbolStyle)
        },
        label: {
          visible: true,
          autoRotate: false,
          text: isPercent ? '50%' : parseInt(`${xValue}`, 10),
          position: 'end',
          labelBackground: {
            visible: false
          },
          style: {
            fill: '#000',
            textAlign: 'center',
            textBaseline: 'bottom'
          },
          refX: 12,
          refY: 0
        },
        line: {
          style: Object.assign({}, defaultLineStyle)
        },
        _originValue_: isPercent ? 0.5 : xValue
      };
    }

    const xVlaue = seriesData[0][series.fieldX[0]];
    return {
      id: uuidv4(),
      name: MarkerTypeEnum.verticalLine,
      interactive: true,
      x: xVlaue,
      endSymbol: {
        visible: true,
        size: 10,
        refX: 6,
        symbolType: 'triangleDown',
        autoRotate: false,
        style: Object.assign({}, defaultSymbolStyle)
      },
      label: {
        visible: true,
        autoRotate: false,
        text: xVlaue,
        position: 'end',
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000',
          textAlign: 'center',
          textBaseline: 'bottom'
        },
        refX: 12,
        refY: 0
      },
      line: {
        style: Object.assign({}, defaultLineStyle)
      },
      _originValue_: xVlaue
    };
  }

  return null;
}

/**
 * 获取区域标注默认配置
 * @param chart
 * @param markerType
 * @returns
 */
export function getDefaultMarkAreaConfig(chart: IVChart, markerType: string) {
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const xAxisTypeIsContinuous = series.getXAxisHelper().isContinuous;
  const yAxisIsContinuous = series.getYAxisHelper().isContinuous;
  const seriesData = series.getRawData().latestData;
  const isPercent = series.getPercent();
  if (markerType === MarkerTypeEnum.horizontalArea) {
    // 水平区域标注
    if (yAxisIsContinuous) {
      const startValue = min(seriesData, series.getSpec().yField);
      const endValue = median(seriesData, series.getSpec().yField);
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.horizontalArea,
        interactive: true,
        y: isPercent ? 0 : 'min',
        y1: isPercent ? 0.5 : 'median',
        area: {
          style: {
            fill: '#005DFF',
            fillOpacity: 0.1
          }
        },
        label: {
          position: 'right',
          text: isPercent ? '0% - 50%' : `${startValue.toFixed(0)} - ${endValue.toFixed(0)}`,
          labelBackground: {
            visible: false
          },
          style: {
            fill: '#000'
          }
        },
        _originValue_: isPercent ? [0, 0.5] : [startValue, endValue]
      };
    }
    const startValue = seriesData[0][series.fieldY[0]];
    const endValue = seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]];

    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.horizontalArea,
      interactive: true,
      y: startValue,
      y1: endValue,
      area: {
        style: {
          fill: '#005DFF',
          fillOpacity: '0.1'
        }
      },
      label: {
        position: 'right',
        text: `${startValue} - ${endValue}`,
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000'
        }
      },
      _originValue_: [startValue, endValue]
    };
  }

  if (markerType === MarkerTypeEnum.verticalArea) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
      const startValue = min(seriesData, series.getSpec().xField);
      const endValue = median(seriesData, series.getSpec().xField);
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.verticalArea,
        interactive: true,
        x: isPercent ? 0 : 'min',
        x1: isPercent ? 0.5 : 'median',
        area: {
          style: {
            fill: '#005DFF',
            fillOpacity: '0.1'
          }
        },
        label: {
          position: 'top',
          text: isPercent ? '0% - 50%' : `${startValue.toFixed(0)} - ${endValue.toFixed(0)}`,
          labelBackground: {
            visible: false
          },
          style: {
            fill: '#000'
          }
        },
        _originValue_: isPercent ? [0, 0.5] : [startValue, endValue]
      };
    }

    const startValue = seriesData[0][series.fieldX[0]];
    const endValue = seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]];
    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.verticalArea,
      interactive: true,
      x: startValue,
      x1: endValue,
      area: {
        style: {
          fill: '#005DFF',
          fillOpacity: '0.1'
        }
      },
      label: {
        position: 'top',
        text: `${startValue} - ${endValue}`,
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000'
        }
      },
      _originValue_: [startValue, endValue]
    };
  }

  return null;
}

/**
 * 获取复合增长标记的初始配置
 * 1. 仅支持柱图和线图
 * 2. 分组场景，取最后一层维度的首尾值，非分组，取第一层维度的收尾值，数值为总和
 *
 * @param chart
 * @returns
 */
export function getDefaultGrowthMarkLineConfig(chart: IVChart) {
  // 根据已绘制的图表

  // 水平：offsetX 30
  // 垂直：offsetY -30
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const isPercent = series.getPercent();
  const seriesData = series.getRawData().latestData;
  const groupFields = series.getGroupFields();

  const isHorizontal = series.direction === 'horizontal';
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;

  let startData;
  let endData;
  let length;
  // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
  if (series.getStack() && series.getStackData()) {
    // 进行 total 计算
    stackTotal(series.getStackData(), series.getStackValueField());
    const filteredData = seriesData.filter((datum: Datum) => datum[STACK_FIELD_TOTAL_TOP]);
    const groupData = groupByFields(filteredData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);

    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[groupKeys.length - 1]][0];

    startData = {
      ...startData,
      [valueFieldInData]: startData[STACK_FIELD_TOTAL]
    };
    endData = {
      ...endData,
      [valueFieldInData]: endData[STACK_FIELD_TOTAL]
    };
    length = groupKeys.length - 1;
  } else {
    const groupData = groupByFields(seriesData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);
    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[groupKeys.length - 1]][0];
    length = groupKeys.length - 1;
  }

  if (isPercent) {
    startData[valueFieldInData] = 1;
    endData[valueFieldInData] = 1;
  }

  const startValue = startData[valueFieldInData];
  const endValue = endData[valueFieldInData];

  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.growthLine,
    coordinates: [startData, endData],
    line: {
      style: {
        ...defaultLineStyle,
        lineDash: [0]
      }
    },
    label: {
      position: 'middle',
      text: getCAGRFormatText([startValue, endValue], length),
      labelBackground: {
        style: {
          fill: '#fff',
          fillOpacity: 1,
          stroke: '#000',
          lineWidth: 1,
          cornerRadius: 4
        }
      },
      style: {
        fill: '#000'
      }
    },
    endSymbol: {
      size: 10,
      refX: -4,
      style: Object.assign({}, defaultSymbolStyle)
    },
    coordinatesOffset: getDefaultGrowthLineOffset(series),
    _originValue_: [startValue, endValue]
  };
}

/**
 * 获取层级差异标记的初始配置
 * 1. 仅支持柱图和线图
 * 2. 默认取维度轴的第一个和第二个值的差异
 *
 * @param chart
 * @returns
 */
export function getDefaultHierarchyDiffMarkLineConfig(chart: IVChart) {
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const isPercent = series.getPercent();
  const seriesData = series.getRawData().latestData;
  const groupFields = series.getGroupFields();

  const isHorizontal = series.direction === 'horizontal';
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;

  let startData;
  let endData;
  let startValue;
  let endValue;
  // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
  if (series.getStack() && series.getStackData()) {
    // 进行 total 计算
    stackTotal(series.getStackData(), series.getStackValueField());
    const filteredData = seriesData.filter((datum: Datum) => datum[STACK_FIELD_TOTAL_TOP]);
    const groupData = groupByFields(filteredData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);

    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];

    if (isPercent) {
      // 第一个维度的最大值和第二个维度的最小值
      startValue = startData[STACK_FIELD_END_PERCENT];
      endValue = 0;
      startData = {
        ...startData,
        [valueFieldInData]: startValue
      };
      endData = {
        ...endData,
        [valueFieldInData]: endValue
      };
    } else {
      startValue = startData[STACK_FIELD_END];
      endValue = endData[STACK_FIELD_END];
      startData = {
        ...startData,
        [valueFieldInData]: startData[STACK_FIELD_TOTAL]
      };
      endData = {
        ...endData,
        [valueFieldInData]: endData[STACK_FIELD_TOTAL]
      };
    }
  } else {
    const groupData = groupByFields(seriesData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);
    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];

    startValue = startData[valueFieldInData];
    endValue = endData[valueFieldInData];
  }

  let expandDistance;
  const region = series.getRegion();
  if (isHorizontal) {
    // region 边缘
    const startY = series.dataToPositionY(startData);
    const endY = series.dataToPositionY(endData);
    expandDistance = Math.min(startY, endY);
    expandDistance = `${((expandDistance + 30) / region.getLayoutRect().height) * 100}%`;
  } else {
    const startX = series.dataToPositionX(startData);
    const endX = series.dataToPositionX(endData);
    expandDistance = region.getLayoutRect().width - Math.max(startX, endX);
    expandDistance = `${((expandDistance + 30) / region.getLayoutRect().width) * 100}%`;
  }

  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.hierarchyDiffLine,
    type: 'type-step',
    coordinates: [startData, endData],
    connectDirection: isHorizontal ? 'top' : 'right',
    expandDistance,
    label: {
      position: 'middle',
      text: getGrowthFormatText([startValue, endValue]),
      labelBackground: {
        style: {
          fill: '#fff',
          fillOpacity: 1,
          stroke: '#000',
          lineWidth: 1,
          cornerRadius: 4
        }
      },
      style: {
        fill: '#000'
      }
    },
    line: {
      multiSegment: true,
      mainSegmentIndex: 1,
      style: [
        {
          ...defaultLineStyle,
          lineDash: [2, 2]
        },
        Object.assign({}, defaultLineStyle),
        {
          ...defaultLineStyle,
          lineDash: [2, 2]
        }
      ]
    },
    endSymbol: {
      size: 10,
      refX: -4,
      style: Object.assign({}, defaultSymbolStyle)
    },
    startSymbol: {
      size: 10,
      refX: -4,
      style: Object.assign({}, defaultSymbolStyle)
    },
    _originValue_: [startValue, endValue]
  };
}

/**
 * 获取总计差异标记的初始配置
 * 1. 仅支持柱图和线图
 * 2. 默认取维度轴的第一个和第二个值的差异
 *
 * @param chart
 * @returns
 */
export function getDefaultTotalDiffMarkLineConfig(chart: IVChart) {
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const isPercent = series.getPercent();
  const seriesData = series.getRawData().latestData;
  const groupFields = series.getGroupFields();

  const isHorizontal = series.direction === 'horizontal';
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;

  let startData;
  let endData;
  // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
  if (series.getStack() && series.getStackData()) {
    // 进行 total 计算
    stackTotal(series.getStackData(), series.getStackValueField());
    const filteredData = seriesData.filter((datum: Datum) => datum[STACK_FIELD_TOTAL_TOP]);
    const groupData = groupByFields(filteredData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);

    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];

    startData = {
      ...startData,
      [valueFieldInData]: startData[STACK_FIELD_TOTAL]
    };
    endData = {
      ...endData,
      [valueFieldInData]: endData[STACK_FIELD_TOTAL]
    };
  } else {
    const groupData = groupByFields(seriesData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);
    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];
  }

  if (isPercent) {
    startData[valueFieldInData] = 1;
    endData[valueFieldInData] = 1;
  }

  const { width, height } = series.getRegion().getLayoutRect();

  const isXInverse = series.getXAxisHelper().isInverse();
  const isYInverse = series.getYAxisHelper().isInverse();

  const startValue = startData[valueFieldInData];
  const endValue = endData[valueFieldInData];

  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.totalDiffLine,
    type: 'type-step',
    coordinates: [startData, endData],
    connectDirection: isHorizontal ? (isXInverse ? 'left' : 'right') : isYInverse ? 'bottom' : 'top',
    expandDistance: isHorizontal
      ? `${(DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE / width) * 100}%`
      : `${(DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE / height) * 100}%`,
    line: {
      style: {
        ...defaultLineStyle,
        lineDash: [0],
        cornerRadius: 4
      }
    },
    label: {
      position: 'middle',
      text: getGrowthFormatText([startValue, endValue]),
      labelBackground: {
        style: {
          fill: '#fff',
          fillOpacity: 1,
          stroke: '#000',
          lineWidth: 1,
          cornerRadius: 4
        }
      },
      style: {
        fill: '#000'
      }
    },
    endSymbol: {
      size: 10,
      refX: -4,
      style: Object.assign({}, defaultSymbolStyle)
    },
    _originValue_: [startValue, endValue]
  };
}

export function getDefaultMarkerConfigByType(chart: IVChart, markerType: string) {
  if (markerType === MarkerTypeEnum.horizontalLine || markerType === MarkerTypeEnum.verticalLine) {
    return getDefaultValueMarkLineConfig(chart, markerType);
  }

  if (markerType === MarkerTypeEnum.horizontalArea || markerType === MarkerTypeEnum.verticalArea) {
    return getDefaultMarkAreaConfig(chart, markerType);
  }

  if (markerType === MarkerTypeEnum.growthLine) {
    return getDefaultGrowthMarkLineConfig(chart);
  }

  if (markerType === MarkerTypeEnum.totalDiffLine) {
    return getDefaultTotalDiffMarkLineConfig(chart);
  }

  if (markerType === MarkerTypeEnum.hierarchyDiffLine) {
    return getDefaultHierarchyDiffMarkLineConfig(chart);
  }

  return null;
}
