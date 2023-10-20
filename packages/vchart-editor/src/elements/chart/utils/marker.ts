/**
 * @description 获取标注的默认初始配置
 */
import { v4 as uuidv4 } from 'uuid';
import type { IVChart, ICartesianSeries } from '@visactor/vchart';
import type { IPointLike } from '@visactor/vutils';
import { MarkerTypeEnum } from '../interface';

// TODO: 不同的标注需要给不同的 zIndex
// TODO: Marker 组件的 group 需要关闭 pickable

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

// 获取复合增长标记的初始配置
export function getDefaultGrowthMarkLineConfig(chart: IVChart) {
  // 根据已绘制的图表
  // TODO：需要根据图表的spec 来获取初始 coordinates
  // TODO: 需要区分分组和堆叠场景
  // 水平：offsetX 30
  // 垂直：offsetY -30
  return {
    coordinates: [
      {
        State: 'WY',
        Age: 'Under 5 Years',
        Population: 25635
      },
      {
        State: 'AK',
        Age: 'Under 5 Years',
        Population: 72083
      }
    ],
    line: {
      style: {
        lineDash: [0],
        lineWidth: 2,
        stroke: '#000'
      }
    },
    label: {
      position: 'middle',
      text: 'xxxx',
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
    offsetY: -30,
    interactive: true,
    name: 'growthMarkLine'
  };
}

export function getDefaultMarkerConfigByType(chart: IVChart, markerType: string) {
  if (markerType === MarkerTypeEnum.horizontalLine || markerType === MarkerTypeEnum.verticalLine) {
    return getDefaultValueMarkLineConfig(chart, markerType);
  }

  if (markerType === MarkerTypeEnum.horizontalArea || markerType === MarkerTypeEnum.verticalArea) {
    return getDefaultMarkAreaConfig(chart, markerType);
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
