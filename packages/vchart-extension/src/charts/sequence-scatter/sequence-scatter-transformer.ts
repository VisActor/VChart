import { Datum } from '@visactor/vchart/src/typings';
import type { ISequenceScatterSpec } from './interface';
import { CommonChartSpecTransformer } from '@visactor/vchart';

const DATA_KEY = 'dataKey';

interface Point {
  x: number;
  y: number;
  label?: string;
}

export class SequenceScatterChartSpecTransformer extends CommonChartSpecTransformer<any> {
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    const dataSpecs = processSequenceData(spec as unknown as ISequenceScatterSpec);

    spec.type = 'common';
    spec.dataKey = DATA_KEY;
    spec.data = dataSpecs[0].data;

    spec.scales = [
      {
        id: 'colorScale',
        type: 'ordinal',
        specified: {
          '0': 'rgb(150, 10, 100)',
          '1': 'rgb(31, 119, 180)',
          '2': 'rgb(255, 127, 14)',
          '3': 'rgb(44, 160, 44)',
          '4': 'rgb(214, 39, 40)',
          '5': 'rgb(148, 103, 189)',
          '6': 'rgb(140, 86, 75)',
          '7': 'rgb(227, 119, 194)',
          '8': 'rgb(127, 127, 127)',
          '9': 'rgb(188, 189, 34)',
          '10': 'rgb(23, 190, 207)'
        }
      },
      {
        id: 'brighterColorScale',
        type: 'ordinal',
        specified: {
          '0': 'rgb(150, 10, 150)',
          '1': 'rgb(31, 119, 230)',
          '2': 'rgb(255, 127, 64)',
          '3': 'rgb(44, 160, 94)',
          '4': 'rgb(214, 39, 90)',
          '5': 'rgb(148, 103, 239)',
          '6': 'rgb(140, 86, 125)',
          '7': 'rgb(227, 119, 244)',
          '8': 'rgb(127, 127, 177)',
          '9': 'rgb(188, 189, 84)',
          '10': 'rgb(23, 190, 255)'
        }
      }
    ];
    spec.series = [
      {
        type: 'scatter',
        dataIndex: 0,
        xField: 'x',
        yField: 'y',
        seriesField: 'label',
        size: 5,
        point: {
          zIndex: 1000,
          style: {
            fill: {
              scale: 'colorScale',
              field: 'label'
            }
          }
        }
      }
    ];
    spec.width = 800;
    spec.height = 500;

    // 获取图元位置
    const regionX = 54;
    const regionY = 26;

    spec.customMark = [
      {
        type: 'text',
        dataIndex: 1,
        style: {
          text: (datum: Datum) => datum['iter'],
          x: 10,
          y: () => 10,
          textBaseline: 'top',
          textAlign: 'left',
          fontSize: 25,
          fontWeight: 'bolder',
          fill: 'black',
          fillOpacity: 0.2,
          ...spec.infoLabel?.style
        }
      },
      {
        type: 'symbol',
        dataIndex: 2,
        style: {
          symbolType: 'rect',
          x: (datum: any, ctx: any) => {
            // 获取region位置
            // const regionStartPoint = ctx.chart.getAllRegions()[0].getLayoutStartPoint();
            // const { x: regionX } = regionStartPoint;
            // 获取图元位置
            const valueToX = ctx.chart.getAllSeries()[0]._markAttributeContext.valueToX;
            const markX = valueToX([datum.x]);
            return regionX + markX;
          },
          y: (datum: any, ctx: any) => {
            // const regionStartPoint = ctx.chart.getAllRegions()[0].getLayoutStartPoint();
            // const { y: regionY } = regionStartPoint;
            const valueToY = ctx.chart.getAllSeries()[0]._markAttributeContext.valueToY;
            const markY = valueToY([datum.y]);
            return markY + regionY;
          },
          size: 5,
          fill: {
            scale: 'brighterColorScale',
            field: 'label'
          },
          fillOpacity: (datum: any) => datum.kde * 10
        }
      }
    ];

    spec.tooltip = {
      visible: true,
      fields: ['x', 'y', 'label']
    };

    if (spec.player) {
      spec.player = {
        ...spec.player,
        specs: dataSpecs
      };

      spec.animationAppear = {
        duration: spec.player?.duration ?? 2000,
        easing: 'linear'
      };

      spec.animationUpdate = {
        duration: spec.player?.duration ?? 2000,
        easing: 'linear'
      };
    }

    spec.axes = [
      {
        orient: 'left',
        type: 'linear',
        nice: true
      },
      {
        orient: 'bottom',
        type: 'linear',
        nice: true,
        label: { visible: true }
      }
    ];

    super.transformSpec(spec);
  }
}

export function processSequenceData(spec: ISequenceScatterSpec) {
  const result: any[] = [];
  Object.keys(spec.data).forEach(iter => {
    const currentData = spec.data[iter].map((d: Datum, i) => ({
      ...(d as Point),
      [DATA_KEY]: i
    }));

    const kdeResults = calculateKDE(currentData, 150);
    result.push({
      data: [
        {
          id: 'nodes',
          values: currentData
        },
        {
          id: 'iter',
          values: [{ iter }]
        },
        {
          id: 'kde',
          values: kdeResults
        }
      ]
    });
  });
  return result;
}

// KDE 相关的工具函数
function gaussKernel(x: number) {
  const SQRT2PI2 = Math.sqrt((Math.PI * 2) ** 2);
  return Math.exp(-(x ** 2) / 2) / SQRT2PI2;
}

function scottBandwidth(data: Point[]) {
  return data.length ** (-1 / 6);
}
function calculateKDE(data: Point[], bins = 100, bandwidth?: number) {
  const groupedData: { [key: string]: Point[] } = data.reduce((groups, point) => {
    const label = point.label;
    groups[label] = groups[label] || [];
    groups[label].push(point);
    return groups;
  }, {} as { [key: string]: Point[] });

  const kdeResult: Array<{ x: number; y: number; kde: number; label: string }> = [];

  const expandRatio = 0.2; // 扩展比例

  Object.entries(groupedData).forEach(([label, points]) => {
    const h = bandwidth || scottBandwidth(points);

    const xValues = points.map(d => d.x);
    const yValues = points.map(d => d.y);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const xExpand = (xMax - xMin) * expandRatio;
    const yExpand = (yMax - yMin) * expandRatio;

    const xExtent = { min: xMin - xExpand, max: xMax + xExpand };
    const yExtent = { min: yMin - yExpand, max: yMax + yExpand };

    const xStep = (xExtent.max - xExtent.min) / bins;
    const yStep = (yExtent.max - yExtent.min) / bins;

    const densities: number[] = []; // 用于存储每个点的 density
    for (let i = 0; i < bins; i++) {
      for (let j = 0; j < bins; j++) {
        const x = xExtent.min + i * xStep;
        const y = yExtent.min + j * yStep;
        let density = 0;
        for (const point of points) {
          const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
          density += gaussKernel(distance / h);
        }
        density = density / (points.length * h * h);
        densities.push(density); // 先暂存 density 值
        kdeResult.push({ x, y, kde: density, label }); // 同时也先存入 kdeResult
      }
    }

    // // 归一化每个 label 的 KDE 密度值到 [0, 1] 范围内
    // const maxDensity = Math.max(...densities);
    // const minDensity = Math.min(...densities);
    //
    // // 归一化
    // for (let i = 0; i < kdeResult.length; i++) {
    //   if (kdeResult[i].label === label) {
    //     kdeResult[i].kde = (kdeResult[i].kde - minDensity) / (maxDensity - minDensity);
    //   }
    // }
  });

  return kdeResult;
}
