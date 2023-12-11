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
  STACK_FIELD_END_PERCENT,
  DEFAULT_DATA_KEY
} from '@visactor/vchart';
import {
  isValidNumber,
  type IPointLike,
  maxInArray,
  minInArray,
  median as visMedian,
  array,
  isString,
  isNumber
} from '@visactor/vutils';
import { MarkerTypeEnum } from '../interface';
import { type IText } from '@visactor/vrender-core';
import type { IBandLikeScale } from '@visactor/vscale';

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

/**
 * CAGR（复合年增长率）是一种用于描述投资、业务或其他金融项目在一段时间内的平均增长率的度量
 * @param EV 是结束值
 * @param BV  是开始值
 * @param n 是年数
 * @returns CAGR
 */
export function calculateCAGR(EV: number, BV: number, n: number) {
  return Math.pow(EV / BV, 1 / n) - 1;
}

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
          text: isPercent ? '50%' : parseInt(`${average(seriesData, series.getSpec().yField)}`, 10),
          position: 'end',
          labelBackground: {
            visible: false,
            padding: { left: 4, right: 4, top: 4, bottom: 4 }
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
        _originValue_: isPercent ? 0.5 : average(seriesData, series.getSpec().yField)
      };
    }
    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.horizontalLine,
      interactive: true,
      y: seriesData[0][series.fieldY[0]],
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
        text: seriesData[0][series.fieldY[0]],
        position: 'end',
        labelBackground: {
          visible: false,
          padding: { left: 4, right: 4, top: 4, bottom: 4 }
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
      _originValue_: seriesData[0][series.fieldY[0]]
    };
  }

  if (markerType === MarkerTypeEnum.verticalLine) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
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
          text: isPercent ? '50%' : parseInt(`${average(seriesData, series.getSpec().xField)}`, 10),
          position: 'end',
          labelBackground: {
            visible: false,
            padding: { left: 4, right: 4, top: 4, bottom: 4 }
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
        _originValue_: isPercent ? 0.5 : average(seriesData, series.getSpec().xField)
      };
    }

    return {
      id: uuidv4(),
      name: MarkerTypeEnum.verticalLine,
      interactive: true,
      x: seriesData[0][series.fieldX[0]],
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
        text: seriesData[0][series.fieldX[0]],
        position: 'end',
        labelBackground: {
          visible: false,
          padding: { left: 4, right: 4, top: 4, bottom: 4 }
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
      _originValue_: seriesData[0][series.fieldX[0]]
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
          text: isPercent
            ? '0% - 50%'
            : `${min(seriesData, series.getSpec().yField)} - ${median(seriesData, series.getSpec().yField)}`,
          labelBackground: {
            visible: false,
            padding: { left: 4, right: 4, top: 4, bottom: 4 }
          },
          style: {
            fill: '#000'
          }
        },
        _originValue_: isPercent
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().yField), median(seriesData, series.getSpec().yField)]
      };
    }

    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.horizontalArea,
      interactive: true,
      y: seriesData[0][series.fieldY[0]],
      y1: seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]],
      area: {
        style: {
          fill: '#005DFF',
          fillOpacity: '0.1'
        }
      },
      label: {
        position: 'right',
        text: `${seriesData[0][series.fieldY[0]]} - ${seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]]}`,
        labelBackground: {
          visible: false,
          padding: { left: 4, right: 4, top: 4, bottom: 4 }
        },
        style: {
          fill: '#000'
        }
      },
      _originValue_: [seriesData[0][series.fieldY[0]], seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]]]
    };
  }

  if (markerType === MarkerTypeEnum.verticalArea) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
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
          text: isPercent
            ? '0% - 50%'
            : `${min(seriesData, series.getSpec().xField)} - ${median(seriesData, series.getSpec().xField)}`,
          labelBackground: {
            visible: false,
            padding: { left: 4, right: 4, top: 4, bottom: 4 }
          },
          style: {
            fill: '#000'
          }
        },
        _originValue_: isPercent
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().xField), median(seriesData, series.getSpec().xField)]
      };
    }

    return {
      id: uuidv4(), // id 用于查找更新
      name: MarkerTypeEnum.verticalArea,
      interactive: true,
      x: seriesData[0][series.fieldX[0]],
      x1: seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]],
      area: {
        style: {
          fill: '#005DFF',
          fillOpacity: '0.1'
        }
      },
      label: {
        position: 'top',
        text: `${seriesData[0][series.fieldX[0]]} - ${seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]]}`,
        labelBackground: {
          visible: false,
          padding: { left: 4, right: 4, top: 4, bottom: 4 }
        },
        style: {
          fill: '#000'
        }
      },
      _originValue_: [seriesData[0][series.fieldX[0]], seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]]]
    };
  }

  return null;
}

export const DEFAULT_OFFSET_FOR_GROWTH_MARKLINE = 30;
export const DEFAULT_OFFSET_FOR_TOTAL_DIFF_MARKLINE = 30;
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
      text:
        startData[valueFieldInData] === 0
          ? '<超过 0 的百分比>'
          : `${(calculateCAGR(endData[valueFieldInData], startData[valueFieldInData], length) * 100).toFixed(0)}%`,
      labelBackground: {
        padding: { left: 4, right: 4, top: 4, bottom: 4 },
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
    _originValue_: [startData[valueFieldInData], endData[valueFieldInData]]
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
      text: startValue === 0 ? '<超过 0 的百分比>' : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`,
      labelBackground: {
        padding: { left: 4, right: 4, top: 4, bottom: 4 },
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
      text:
        startData[valueFieldInData] === 0
          ? '<超过 0 的百分比>'
          : `${(
              ((endData[valueFieldInData] - startData[valueFieldInData]) / startData[valueFieldInData]) *
              100
            ).toFixed(0)}%`,
      labelBackground: {
        padding: { left: 4, right: 4, top: 4, bottom: 4 },
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
    _originValue_: [startData[valueFieldInData], endData[valueFieldInData]]
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

// TODO: 移到 vutils-extension 中
export function getInsertPoints(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset: number = 0
) {
  const points: IPointLike[] = [];
  const dy = start.y - end.y;
  const dx = start.x - end.x;

  switch (direction) {
    case 'top':
      points.push(start);
      points.push({
        x: start.x,
        y: dy > 0 ? start.y - offset - Math.abs(dy) : start.y - offset
      });
      points.push({
        x: end.x,
        y: dy > 0 ? end.y - offset : end.y - offset - Math.abs(dy)
      });
      points.push(end);
      break;
    case 'bottom':
      points.push(start);
      points.push({ x: start.x, y: dy < 0 ? start.y + offset + Math.abs(dy) : start.y + offset });
      points.push({ x: end.x, y: dy < 0 ? end.y + offset : end.y + offset + Math.abs(dy) });
      points.push(end);
      break;
    case 'left':
      points.push(start);
      points.push({
        x: dx > 0 ? start.x - offset - Math.abs(dx) : start.x - offset,
        y: start.y
      });
      points.push({
        x: dx > 0 ? end.x - offset : end.x - offset - Math.abs(dx),
        y: end.y
      });
      points.push(end);
      break;
    case 'right':
      points.push(start);
      points.push({
        x: dx > 0 ? start.x + offset : start.x + offset + Math.abs(dx),
        y: start.y
      });
      points.push({
        x: dx > 0 ? end.x + offset + Math.abs(dx) : end.x + offset,
        y: end.y
      });
      points.push(end);
      break;
    default:
      break;
  }
  return points;
}

// TODO: 移到 vutils-extension 中
export function getTextOffset(
  start: IPointLike,
  end: IPointLike,
  direction: 'top' | 'bottom' | 'left' | 'right',
  offset: number = 0
) {
  const dy = start.y - end.y;
  const dx = start.x - end.x;

  if (direction === 'bottom') {
    return {
      dx: dx > 0 ? -dx / 2 : Math.abs(dx / 2),
      dy: dy > 0 ? offset : Math.abs(dy) + offset
    };
  }

  if (direction === 'top') {
    return {
      dx: dx > 0 ? -Math.abs(dx / 2) : +Math.abs(dx / 2),
      dy: dy > 0 ? -(Math.abs(dy) + offset) : -offset
    };
  }

  if (direction === 'left') {
    return {
      dx: dx > 0 ? -dx - offset : -offset,
      dy: dy > 0 ? -(dy / 2) : Math.abs(dy / 2)
    };
  }

  if (direction === 'right') {
    return {
      dx: dx > 0 ? offset : Math.abs(dx) + offset,
      dy: dy > 0 ? -(dy / 2) : Math.abs(dy / 2)
    };
  }

  return {};
}

function groupByFields(data: Datum, groupFields: string[]) {
  const result = {};
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const groupKey = groupFields.map(field => item[field]).join('-');
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
}

export function min(data: any[], field?: string): number {
  const dataArray: any[] = [];
  data.forEach(d => {
    const value = +d[field];
    if (isValidNumber(value)) {
      dataArray.push(value);
    }
  });
  if (dataArray.length === 0) {
    return null;
  }
  return minInArray(dataArray);
}

export function max(data: any[], field?: string): number {
  const dataArray: any[] = [];
  data.forEach(d => {
    const value = +d[field];
    if (isValidNumber(value)) {
      dataArray.push(value);
    }
  });
  if (dataArray.length === 0) {
    return null;
  }
  return maxInArray(dataArray);
}

export function sum(data: any[], field?: string): number {
  return data.reduce((pre, _cur) => {
    const cur = field ? +_cur[field] : +_cur;
    if (isValidNumber(cur)) {
      pre += cur;
    }
    return pre;
  }, 0);
}

export function median(data: any[], field?: string): number {
  const value = visMedian(data.map((datum: Datum) => datum[field]));
  return value;
}

export function stackTotal(stackData: any, valueField: string) {
  if ('values' in stackData && stackData.values.length) {
    const total = sum(stackData.values, valueField);
    stackData.values.forEach((v: Datum) => {
      v[STACK_FIELD_TOTAL] = total;
      delete v[STACK_FIELD_TOTAL_TOP];
    });
    const maxNode = stackData.values.reduce((max: Datum, current: Datum) => {
      return current[STACK_FIELD_END] > max[STACK_FIELD_END] ? current : max;
    });
    maxNode[STACK_FIELD_TOTAL_TOP] = true;
    return;
  }
  for (const key in stackData.nodes) {
    stackTotal(stackData.nodes[key], valueField);
  }
}

export function average(data: any[], field?: string): number {
  let sum = 0;
  let count = 0;
  data.forEach((x: any) => {
    const v = field ? +x[field] : +x;
    if (isValidNumber(v)) {
      sum += v;
      count++;
    }
  });

  const average = sum / count;
  return average;
}

export function isDataSameInFields(data1: Datum, data2: Datum, fields: string[]) {
  return fields.every(field => data1[field] === data2[field]);
}

export function adjustTotalDiffCoordinatesOffset(
  datum: Datum,
  series: ICartesianSeries,
  vchart: IVChart,
  offset = { x: 0, y: 0 }
) {
  const labels = vchart.getStage().getElementsByName('data-label');
  if (labels && labels.length) {
    let allLabelTexts: IText[] = [];
    labels.forEach((label: any) => {
      allLabelTexts = allLabelTexts.concat(label.getElementsByType('text') as IText[]);
    });
    const isHorizontal = series.direction === 'horizontal';
    const isXInverse = series.getXAxisHelper().isInverse();
    const isYInverse = series.getYAxisHelper().isInverse();
    const isStack = series.getStack();
    const datumPosition = {
      x: series.getXAxisHelper().dataToPosition(array(series.getSpec().xField).map(field => datum[field])),
      y: series.getYAxisHelper().dataToPosition(array(series.getSpec().yField).map(field => datum[field]))
    };
    let matchLabels;
    if (isHorizontal) {
      const fields = isStack
        ? array(series.getSpec().yField)
        : [...array(series.getSpec().yField), ...array(series.getSpec().xField)];

      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.y1 <= datumPosition.y &&
          text.AABBBounds.y2 >= datumPosition.y &&
          (isXInverse ? text.AABBBounds.x1 < datumPosition.x : text.AABBBounds.x2 > datumPosition.x)
      );
    } else {
      const fields = isStack
        ? array(series.getSpec().xField)
        : [...array(series.getSpec().yField), ...array(series.getSpec().xField)];
      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.x1 <= datumPosition.x &&
          text.AABBBounds.x2 >= datumPosition.x &&
          (isYInverse ? text.AABBBounds.y2 > datumPosition.y : text.AABBBounds.y1 < datumPosition.y)
      );
    }

    if (matchLabels && matchLabels.length) {
      if (isHorizontal) {
        offset.x = isXInverse
          ? Math.min(...matchLabels.map(text => text.AABBBounds.x1)) - datumPosition.x
          : Math.max(...matchLabels.map(text => text.AABBBounds.x2)) - datumPosition.x;
      } else {
        offset.y = isYInverse
          ? Math.max(...matchLabels.map(text => text.AABBBounds.y2)) - datumPosition.y
          : Math.min(...matchLabels.map(text => text.AABBBounds.y1)) - datumPosition.y;
      }
    }
  }

  return offset;
}

export function getDefaultGrowthLineOffset(series: ICartesianSeries) {
  const isHorizontal = series.direction === 'horizontal';

  const isXInverse = series.getXAxisHelper().isInverse();
  const isYInverse = series.getYAxisHelper().isInverse();

  const offset = `${
    (isHorizontal ? (isXInverse ? -1 : 1) : isYInverse ? 1 : -1) * DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
  }%`;

  return [
    {
      x: isHorizontal ? offset : 0,
      y: isHorizontal ? 0 : offset
    },
    {
      x: isHorizontal ? offset : 0,
      y: isHorizontal ? 0 : offset
    }
  ];
}

export function couldBeValidNumber(v: any) {
  if (v === null || v === undefined || v === '') {
    return false;
  }
  if (isNumber(v)) {
    return true;
  }
  // eslint-disable-next-line no-self-compare
  return +v === +v;
}

export function isPercent(v: any) {
  if (!isString(v)) {
    return false;
  }
  if (!v.endsWith('%')) {
    return false;
  }
  return couldBeValidNumber(v.substring(0, v.length - 1));
}

// 数据变化场景：数据更新
export function updateMarkersAfterUpdateData(spec: any, series: ICartesianSeries) {
  const hValueLines = spec.markLine.filter((markLine: any) => markLine.name === MarkerTypeEnum.horizontalLine);
  const vValueLines = spec.markLine.filter((markLine: any) => markLine.name === MarkerTypeEnum.verticalLine);

  const hAreas = spec.markArea.filter((markArea: any) => markArea.name === MarkerTypeEnum.horizontalArea);
  const vAreas = spec.markArea.filter((markArea: any) => markArea.name === MarkerTypeEnum.verticalArea);

  const growthLines = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.growthLine);
  const totalDiffLines = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.totalDiffLine);
  const hireDiff = spec.markLine.filter((s: any) => s.name === MarkerTypeEnum.hierarchyDiffLine);

  const seriesData = series.getViewData().latestData;
  const region = series.getRegion();
  const { height: regionHeight, width: regionWidth } = region.getLayoutRect();

  const isPercentSeries = series.getPercent();
  const xAxisTypeIsContinuous = series.getXAxisHelper().isContinuous;
  const yAxisIsContinuous = series.getYAxisHelper().isContinuous;
  // 值线和 area 需要判断属性值是否为百分比字符串，是则只更新 label.text，不是则采用默认的逻辑也只需要更新 label.text
  hValueLines.forEach((markLine: any) => {
    if (isPercent(markLine.y)) {
      if (!isPercentSeries) {
        // 百分比图表不需要处理
        const position = (Number(markLine.y.substring(0, markLine.y.length - 1)) / 100) * regionHeight;
        const value = series.positionToDataY(position);
        markLine._originValue_ = value;
        markLine.label.text = yAxisIsContinuous ? parseInt(`${value}`, 10) : value;
      }
    } else {
      // 默认逻辑
      if (yAxisIsContinuous) {
        markLine.label.text = isPercentSeries ? '50%' : parseInt(`${average(seriesData, series.getSpec().yField)}`, 10);
        markLine._originValue_ = isPercentSeries ? 0.5 : average(seriesData, series.getSpec().yField);
      } else {
        markLine.y = seriesData[0][series.fieldY[0]];
        markLine.label.text = seriesData[0][series.fieldY[0]];
        markLine._originValue_ = seriesData[0][series.fieldY[0]];
      }
    }
  });

  vValueLines.forEach((markLine: any) => {
    if (isPercent(markLine.x)) {
      if (!isPercentSeries) {
        const position = (Number(markLine.x.substring(0, markLine.x.length - 1)) / 100) * regionWidth;
        const value = series.positionToDataX(position);
        markLine._originValue_ = value;
        markLine.label.text = xAxisTypeIsContinuous ? parseInt(`${value}`, 10) : value;
      }
    } else {
      // 默认逻辑
      if (xAxisTypeIsContinuous) {
        markLine.label.text = isPercentSeries ? '50%' : parseInt(`${average(seriesData, series.getSpec().xField)}`, 10);
        markLine._originValue_ = isPercentSeries ? 0.5 : average(seriesData, series.getSpec().xField);
      } else {
        markLine.x = seriesData[0][series.fieldX[0]];
        markLine.label.text = seriesData[0][series.fieldX[0]];
        markLine._originValue_ = seriesData[0][series.fieldX[0]];
      }
    }
  });

  hAreas.forEach((markArea: any) => {
    if (isPercent(markArea.y)) {
      if (!isPercentSeries) {
        const yPosition = (Number(markArea.y.substring(0, markArea.y.length - 1)) / 100) * regionHeight;
        const y1Position = (Number(markArea.y1.substring(0, markArea.y1.length - 1)) / 100) * regionHeight;
        const y = series.positionToDataY(yPosition);
        const y1 = series.positionToDataY(y1Position);

        markArea.label.text = `${yAxisIsContinuous ? parseInt(y, 10) : y} - ${
          yAxisIsContinuous ? parseInt(y1, 10) : y1
        }`;
        markArea._originValue_ = [y, y1];
      }
    } else {
      if (yAxisIsContinuous) {
        markArea.y = isPercentSeries ? 0 : 'min';
        markArea.y1 = isPercentSeries ? 0.5 : 'median';
        markArea.label.text = isPercentSeries
          ? '0% - 50%'
          : `${min(seriesData, series.getSpec().yField)} - ${median(seriesData, series.getSpec().yField)}`;
        markArea._originValue_ = isPercentSeries
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().yField), median(seriesData, series.getSpec().yField)];
      } else {
        markArea.y = seriesData[0][series.fieldY[0]];
        markArea.y1 = seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]];
        markArea.label.text = `${seriesData[0][series.fieldY[0]]} - ${
          seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]]
        }`;
        markArea._originValue_ = [
          seriesData[0][series.fieldY[0]],
          seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]]
        ];
      }
    }
  });

  vAreas.forEach((markArea: any) => {
    if (isPercent(markArea.y)) {
      if (!isPercentSeries) {
        const xPosition = (Number(markArea.x.substring(0, markArea.x.length - 1)) / 100) * regionWidth;
        const x1Position = (Number(markArea.x1.substring(0, markArea.x1.length - 1)) / 100) * regionWidth;

        const x = series.positionToDataX(xPosition);
        const x1 = series.positionToDataX(x1Position);

        markArea.label.text = `${xAxisTypeIsContinuous ? parseInt(x, 10) : x} - ${
          xAxisTypeIsContinuous ? parseInt(x1, 10) : x1
        }`;
        markArea._originValue_ = [x, x1];
      }
    } else {
      if (xAxisTypeIsContinuous) {
        markArea.x = isPercentSeries ? 0 : 'min';
        markArea.x1 = isPercentSeries ? 0.5 : 'median';
        markArea.label.text = isPercentSeries
          ? '0% - 50%'
          : `${min(seriesData, series.getSpec().xField)} - ${median(seriesData, series.getSpec().xField)}`;
        markArea._originValue_ = isPercentSeries
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().xField), median(seriesData, series.getSpec().xField)];
      } else {
        markArea.x = seriesData[0][series.fieldX[0]];
        markArea.x1 = seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]];
        markArea.label.text = `${seriesData[0][series.fieldX[0]]} - ${
          seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]]
        }`;
        markArea._originValue_ = [
          seriesData[0][series.fieldX[0]],
          seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]]
        ];
      }
    }
  });

  // 其他增长型标注则根据 dataKey 查找对应的数据，更新 coordinates 和 label.text
  if (growthLines.length || totalDiffLines.length || hireDiff.length) {
    if (series.getStack() && series.getStackData()) {
      // TODO: 还是外部处理下配置比较合适
      // 进行 total 计算
      stackTotal(series.getStackData(), series.getStackValueField());
    }
  }

  const isHorizontal = series.direction === 'horizontal';
  const isStackSeries = series.getStack();
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;
  const dimensionField = isHorizontal ? array(series.getSpec().yField)[0] : array(series.getSpec().xField)[0];
  const dimensionTicks = isHorizontal
    ? (series.getYAxisHelper().getScale(0) as IBandLikeScale).ticks()
    : (series.getXAxisHelper().getScale(0) as IBandLikeScale).ticks();
  growthLines.forEach((markLine: any) => {
    const { coordinates } = markLine;
    const [start, end] = coordinates;

    // 根据 DEFAULT_DATA_KEY 查找系列中的数据
    let newStart = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === start[DEFAULT_DATA_KEY]);
    let newEnd = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === end[DEFAULT_DATA_KEY]);

    if (isStackSeries) {
      newStart = {
        ...newStart,
        [valueFieldInData]: newStart[STACK_FIELD_TOTAL]
      };
      newEnd = {
        ...newEnd,
        [valueFieldInData]: newEnd[STACK_FIELD_TOTAL]
      };
    }

    if (isPercentSeries) {
      newStart[valueFieldInData] = 1;
      newEnd[valueFieldInData] = 1;
    }

    markLine.coordinates = [newStart, newEnd];

    const length = Math.abs(
      dimensionTicks.indexOf(newEnd[dimensionField]) - dimensionTicks.indexOf(newStart[dimensionField])
    );
    markLine.label.text =
      newStart[valueFieldInData] === 0
        ? '<超过 0 的百分比>'
        : `${(calculateCAGR(newEnd[valueFieldInData], newStart[valueFieldInData], length) * 100).toFixed(0)}%`;
    markLine._originValue_ = [newStart[valueFieldInData], newEnd[valueFieldInData]];
  });

  totalDiffLines.forEach((markLine: any) => {
    const { coordinates } = markLine;
    const [start, end] = coordinates;

    // 根据 DEFAULT_DATA_KEY 查找系列中的数据
    let newStart = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === start[DEFAULT_DATA_KEY]);
    let newEnd = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === end[DEFAULT_DATA_KEY]);

    if (isStackSeries) {
      newStart = {
        ...newStart,
        [valueFieldInData]: newStart[STACK_FIELD_TOTAL]
      };
      newEnd = {
        ...newEnd,
        [valueFieldInData]: newEnd[STACK_FIELD_TOTAL]
      };
    }

    if (isPercentSeries) {
      newStart[valueFieldInData] = 1;
      newEnd[valueFieldInData] = 1;
    }

    markLine.coordinates = [newStart, newEnd];
    markLine.label.text =
      newStart[valueFieldInData] === 0
        ? '<超过 0 的百分比>'
        : `${(((newEnd[valueFieldInData] - newStart[valueFieldInData]) / newStart[valueFieldInData]) * 100).toFixed(
            0
          )}%`;
    markLine._originValue_ = [newStart[valueFieldInData], newEnd[valueFieldInData]];
  });

  hireDiff.forEach((markLine: any) => {
    const { coordinates } = markLine;
    const [start, end] = coordinates;

    // 根据 DEFAULT_DATA_KEY 查找系列中的数据
    let startData = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === start[DEFAULT_DATA_KEY]);
    let endData = seriesData.find((datum: any) => datum[DEFAULT_DATA_KEY] === end[DEFAULT_DATA_KEY]);

    let startValue;
    let endValue;
    // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
    if (isStackSeries) {
      if (isPercentSeries) {
        // 第一个维度的最大值和第二个维度的最小值
        startValue = startData[STACK_FIELD_END_PERCENT];
        endValue = endData[STACK_FIELD_END_PERCENT];
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
      startValue = startData[valueFieldInData];
      endValue = endData[valueFieldInData];
    }

    markLine.coordinates = [startData, endData];
    markLine.label.text = isPercentSeries
      ? `${((endValue - startValue) * 100).toFixed(0)}%`
      : startValue === 0
      ? '<超过 0 的百分比>'
      : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`;
    markLine._originValue_ = [startValue, endValue];
  });
}
