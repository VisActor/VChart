/**
 * @description 获取标注的默认初始配置
 */
import { v4 as uuidv4 } from 'uuid';
import {
  type IVChart,
  type ICartesianSeries,
  STACK_FIELD_TOTAL_TOP,
  STACK_FIELD_TOTAL,
  STACK_FIELD_END
} from '@visactor/vchart';
import { type IPointLike } from '@visactor/vutils';
import { MarkerTypeEnum } from '../interface';

// TODO: 不同的标注需要给不同的 zIndex
// TODO: 加一个判断，仅支持直角坐标系图表或者仅支持特定类型的图表

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
  if (markerType === MarkerTypeEnum.horizontalLine) {
    // 水平值线
    if (yAxisIsContinuous) {
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.horizontalLine,
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
          formatMethod: (markData: any) => {
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
    };
  }

  if (markerType === MarkerTypeEnum.verticalLine) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.verticalLine,
        interactive: true,
        x: 'average',
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
            return parseInt(markData[0].x, 10);
          },
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
          style: {
            stroke: '#000'
          }
        }
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
        style: {
          stroke: '#000'
        }
      }
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
  if (markerType === MarkerTypeEnum.horizontalArea) {
    // 水平区域标注
    if (yAxisIsContinuous) {
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.horizontalArea,
        interactive: true,
        y: 'min',
        y1: 'median',
        zIndex: 500,
        area: {
          style: {
            fill: '#005DFF',
            fillOpacity: '0.1'
          }
        },
        label: {
          position: 'right',
          text: 'insert some text',
          labelBackground: {
            visible: false
          },
          style: {
            fill: '#000'
          }
        }
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
        text: 'insert some text',
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000'
        }
      }
    };
  }

  if (markerType === MarkerTypeEnum.verticalArea) {
    // 垂直值线
    if (xAxisTypeIsContinuous) {
      return {
        id: uuidv4(), // id 用于查找更新
        name: MarkerTypeEnum.verticalArea,
        interactive: true,
        x: 'min',
        x1: 'median',
        zIndex: 500,
        area: {
          style: {
            fill: '#005DFF',
            fillOpacity: '0.1'
          }
        },
        label: {
          position: 'top',
          text: 'insert some text',
          labelBackground: {
            visible: false
          },
          style: {
            fill: '#000'
          }
        }
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
        text: 'insert some text',
        labelBackground: {
          visible: false
        },
        style: {
          fill: '#000'
        }
      }
    };
  }

  return null;
}

export const DEFAULT_OFFSET_FOR_GROWTH_MARKLINE = 30;
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
  // TODO: 分组字段只有一个值

  // 水平：offsetX 30
  // 垂直：offsetY -30
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const seriesData = series.getRawData().latestData;
  const groupFields = series.getGroupFields();

  const isHorizontal = series.direction === 'horizontal';
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;

  let startData;
  let endData;
  let length;
  // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
  if (series.getStack() && series.getStackData()) {
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

  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.growthLine,
    coordinates: [startData, endData],
    line: {
      style: {
        lineDash: [0],
        lineWidth: 2,
        stroke: '#000'
      }
    },
    label: {
      position: 'middle',
      // TODO：计算公式需要确认
      text:
        startData[valueFieldInData] === 0
          ? '<超过 0 的百分比>'
          : `${(calculateCAGR(endData[valueFieldInData], startData[valueFieldInData], length) * 100).toFixed(0)}%`,
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
      size: 12,
      refX: -6
    },
    [isHorizontal ? 'offsetX' : 'offsetY']: (isHorizontal ? 1 : -1) * DEFAULT_OFFSET_FOR_GROWTH_MARKLINE
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
export function getDefaultHierarchyDiffMarkLineConfig(chart: IVChart) {
  // TODO: 线图验证
  // TODO: 分组字段只有一个值
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
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
    const filteredData = seriesData.filter((datum: Datum) => datum[STACK_FIELD_TOTAL_TOP]);
    const groupData = groupByFields(filteredData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);

    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];
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
  } else {
    const groupData = groupByFields(seriesData, [groupFields[0]]);
    const groupKeys = Object.keys(groupData);
    startData = groupData[groupKeys[0]][0];
    endData = groupData[groupKeys[1]][0];

    startValue = startData[valueFieldInData];
    endValue = endData[valueFieldInData];
  }

  let expandDistance = 0;
  const region = series.getRegion();
  if (isHorizontal) {
    // region 边缘
    const startY = series.dataToPositionY(startData);
    const endY = series.dataToPositionY(endData);
    expandDistance = region.getLayoutRect().height - Math.max(startY, endY);
  } else {
    const startX = series.dataToPositionX(startData);
    const endX = series.dataToPositionX(endData);
    expandDistance = region.getLayoutRect().width - Math.max(startX, endX);
  }
  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.hierarchyDiffLine,
    type: 'type-step',
    coordinates: [startData, endData],
    connectDirection: isHorizontal ? 'top' : 'right',
    expandDistance: expandDistance + 30,
    label: {
      position: 'middle',
      // TODO：计算公式需要确认
      text: startValue === 0 ? '<超过 0 的百分比>' : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`,
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
          lineDash: [2, 2],
          stroke: '#000',
          lineWidth: 2
        },
        {
          stroke: '#000',
          lineWidth: 2
        },
        {
          lineDash: [2, 2],
          stroke: '#000',
          lineWidth: 2
        }
      ]
    },
    endSymbol: {
      size: 12,
      refX: -6
    }
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
  // TODO: 线图验证
  // TODO: 分组字段只有一个值
  const series = chart.getChart().getAllSeries()[0] as ICartesianSeries;
  const seriesData = series.getRawData().latestData;
  const groupFields = series.getGroupFields();

  const isHorizontal = series.direction === 'horizontal';
  const valueFieldInData = isHorizontal ? series.getSpec().xField : series.getSpec().yField;

  let startData;
  let endData;
  // 如果存在堆叠场景，则查找 STACK_FIELD_TOTAL_TOP 的数据，再进行分组
  if (series.getStack() && series.getStackData()) {
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

  return {
    id: uuidv4(),
    interactive: true,
    name: MarkerTypeEnum.totalDiffLine,
    type: 'type-step',
    coordinates: [startData, endData],
    connectDirection: isHorizontal ? 'right' : 'top',
    expandDistance: 30,
    line: {
      style: {
        lineDash: [0],
        lineWidth: 2,
        stroke: '#000',
        cornerRadius: 4
      }
    },
    label: {
      position: 'middle',
      // TODO：计算公式需要确认
      text:
        startData[valueFieldInData] === 0
          ? '<超过 0 的百分比>'
          : `${(
              ((endData[valueFieldInData] - startData[valueFieldInData]) / startData[valueFieldInData]) *
              100
            ).toFixed(0)}%`,
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
      size: 12,
      refX: -6
    }
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
