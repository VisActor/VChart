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
import { isValidNumber, type IPointLike, maxInArray, minInArray, median as visMedian, array } from '@visactor/vutils';
import { MarkerTypeEnum } from '../interface';
import type { IText } from '@visactor/vrender-core';

// TODO: 不同的标注需要给不同的 zIndex

const defaultLineStyle = {
  stroke: '#000',
  lineWidth: 2,
  boundsPadding: [2, 2, 2, 2],
  pickMode: 'imprecise'
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
          size: 12,
          refX: 6,
          symbolType: 'triangleLeft',
          autoRotate: false
        },
        label: {
          visible: true,
          autoRotate: false,
          formatMethod: (markData: any) => {
            return isPercent ? `${(markData[0].y * 100).toFixed(0)}%` : parseInt(markData[0].y, 10);
          },
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
          style: defaultLineStyle
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
        size: 12,
        refX: 6,
        symbolType: 'triangleLeft',
        autoRotate: false
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
        style: defaultLineStyle
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
          size: 12,
          refX: 6,
          symbolType: 'triangleDown',
          autoRotate: false
        },
        label: {
          visible: true,
          autoRotate: false,
          formatMethod: (markData: any) => {
            return isPercent ? `${(markData[0].x * 100).toFixed(0)}%` : parseInt(markData[0].x, 10);
          },
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
          style: defaultLineStyle
        },
        _originValue_: isPercent ? 0.5 : average(seriesData, series.getSpec().yField)
      };
    }

    return {
      id: uuidv4(),
      name: MarkerTypeEnum.verticalLine,
      interactive: true,
      x: seriesData[0][series.fieldX[0]],
      endSymbol: {
        visible: true,
        size: 12,
        refX: 6,
        symbolType: 'triangleDown',
        autoRotate: false
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
        style: defaultLineStyle
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
        zIndex: 500,
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
      zIndex: 500,
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
        zIndex: 500,
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
      zIndex: 500,
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

  const offset = `${(isHorizontal ? 1 : -1) * DEFAULT_OFFSET_FOR_GROWTH_MARKLINE}%`;

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
      size: 12,
      refX: -4
    },
    coordinatesOffset: [
      {
        x: isHorizontal ? offset : 0,
        y: isHorizontal ? 0 : offset
      },
      {
        x: isHorizontal ? offset : 0,
        y: isHorizontal ? 0 : offset
      }
    ],
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
        defaultLineStyle,
        {
          ...defaultLineStyle,
          lineDash: [2, 2]
        }
      ]
    },
    endSymbol: {
      size: 12,
      refX: -4
    },
    startSymbol: {
      size: 12,
      refX: -4
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
  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.totalDiffLine,
    type: 'type-step',
    coordinates: [startData, endData],
    connectDirection: isHorizontal ? 'right' : 'top',
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
      size: 12,
      refX: -4
    },
    _originValue_: [startData[valueFieldInData], endData[valueFieldInData]],
    coordinatesOffset: [
      adjustTotalDiffCoordinatesOffset(startData, series, chart),
      adjustTotalDiffCoordinatesOffset(endData, series, chart)
    ]
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
    labels.forEach(label => {
      allLabelTexts = allLabelTexts.concat(label.getElementsByType('text'));
    });
    const isHorizontal = series.direction === 'horizontal';
    const datumPosition = {
      x: series.getXAxisHelper().dataToPosition(array(series.getSpec().xField).map(field => datum[field])),
      y: series.getYAxisHelper().dataToPosition(array(series.getSpec().yField).map(field => datum[field]))
    };
    let matchLabels;
    if (isHorizontal) {
      const fields = [].concat(series.getSpec().yField);

      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.y1 <= datumPosition.y &&
          text.AABBBounds.y2 >= datumPosition.y &&
          text.AABBBounds.x2 > datumPosition.x
      );
    } else {
      const fields = [].concat(series.getSpec().xField);
      matchLabels = allLabelTexts.filter(
        text =>
          isDataSameInFields(datum, (text.attribute as any).data, fields) &&
          text.AABBBounds.x1 <= datumPosition.x &&
          text.AABBBounds.x2 >= datumPosition.x &&
          text.AABBBounds.y1 < datumPosition.y
      );
    }

    if (matchLabels && matchLabels.length) {
      if (isHorizontal) {
        offset.x = Math.max(...matchLabels.map(text => text.AABBBounds.x2)) - datumPosition.x;
      } else {
        offset.y = Math.min(...matchLabels.map(text => text.AABBBounds.y1)) - datumPosition.y;
      }
    }
  }

  return offset;
}
