import {
  axis,
  cartesianBar,
  cartesianLine,
  chartType,
  color,
  data,
  legend,
  pieField,
  scatterField,
  wordCloudField,
  roseField,
  roseAxis,
  radarField,
  radarDisplayConf,
  radarAxis,
  sankeyData,
  sankeyField,
  sankeyLabel,
  sankeyLink,
  sequenceData,
  rankingBarAxis,
  rankingBarField,
  customMark,
  scatterAxis,
  animationOneByOne,
  animationCartesianBar,
  animationCartisianLine,
  animationCartesianPie,
  wordCloudData,
  displayConfBar,
  displayConfLine,
  colorLine,
  colorBar,
  colorDynamicBar,
  wordCloudDisplayConf,
  rankingBarLabel,
  funnelField,
  funnelData,
  dualAxisSeries,
  dualAxisAxes,
  waterfallField,
  waterfallAxes,
  waterfallStackLabel,
  boxPlotField
} from './pipes';
import { Cell, ChartType, Context, Pipe } from '../typings';
import { CARTESIAN_CHART_LIST, detectAxesType } from './utils';

export const vizDataToSpec = (
  dataset: any[],
  chartType: ChartType,
  cell: Cell,
  colors: string[] | undefined,
  totalTime?: number
) => {
  const pipelines = pipelineMap[chartType];
  const spec = execPipeline({}, pipelines, {
    chartType,
    dataset,
    cell,
    colors,
    totalTime
  });
  return spec;
};

export const patchChartTypeAndCell = (chartTypeOutter: string, cell: any, dataset: any[]) => {
  //对GPT返回结果进行修正
  //某些时候由于用户输入的意图不明确，GPT返回的cell中可能缺少字段。
  //此时需要根据规则补全
  //TODO: 多个y字段时，使用fold

  const { x, y } = cell;

  let chartType = chartTypeOutter;
  // y轴字段有多个时，处理方式:
  // 1. 图表类型为: 箱型图, 图表类型不做矫正
  // 2. 图表类型为: 柱状图 或 折线图, 图表类型矫正为双轴图
  // 3. 其他情况, 图表类型矫正为散点图
  if (y && typeof y !== 'string' && y.length > 1) {
    if (chartType === 'BOX PLOT CHART') {
      return {
        chartTypeNew: chartType,
        cellNew: cell
      };
    }
    if (chartType === 'BAR CHART' || chartType === 'LINE CHART') {
      chartType = 'DUAL AXIS CHART';
    } else {
      return {
        chartTypeNew: 'SCATTER PLOT',
        cellNew: {
          ...cell,
          x: y[0],
          y: y[1],
          color: typeof x === 'string' ? x : x[0]
        }
      };
    }
  }
  //双轴图 订正yLeft和yRight
  if (chartType === 'DUAL AXIS CHART' && cell.yLeft && cell.yRight) {
    return {
      chartTypeNew: chartType,
      cellNew: { ...cell, y: [cell.yLeft, cell.yRight] }
    };
  }
  //饼图 必须有color字段和angle字段
  if (chartType === 'PIE CHART') {
    const cellNew = { ...cell };
    if (!cellNew.color || !cellNew.angle) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      if (!cellNew.color) {
        //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
        const colorField = remainedFields.find(f => {
          const fieldType = detectAxesType(dataset, f);
          return fieldType === 'band';
        });
        if (colorField) {
          cellNew.color = colorField;
        } else {
          cellNew.color = remainedFields[0];
        }
      }
      if (!cellNew.angle) {
        //没有分配角度字段，从剩下的字段里选择一个连续字段分配到角度上
        const angleField = remainedFields.find(f => {
          const fieldType = detectAxesType(dataset, f);
          return fieldType === 'linear';
        });
        if (angleField) {
          cellNew.angle = angleField;
        } else {
          cellNew.angle = remainedFields[0];
        }
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  //词云 必须有color字段和size字段
  if (chartType === 'WORD CLOUD') {
    const cellNew = { ...cell };
    if (!cellNew.size || !cellNew.color || cellNew.color === cellNew.size) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      //首先根据cell中的其他字段选择size和color
      //若没有，则从数据的剩余字段中选择
      if (!cellNew.size || cellNew.size === cellNew.color) {
        const newSize = cellNew.weight ?? cellNew.fontSize;
        if (newSize) {
          cellNew.size = newSize;
        } else {
          const sizeField = remainedFields.find(f => {
            const fieldType = detectAxesType(dataset, f);
            return fieldType === 'linear';
          });
          if (sizeField) {
            cellNew.size = sizeField;
          } else {
            cellNew.size = remainedFields[0];
          }
        }
      }
      if (!cellNew.color) {
        const newColor = cellNew.text ?? cellNew.word ?? cellNew.label ?? cellNew.x;
        if (newColor) {
          cellNew.color = newColor;
        } else {
          const colorField = remainedFields.find(f => {
            const fieldType = detectAxesType(dataset, f);
            return fieldType === 'band';
          });
          if (colorField) {
            cellNew.color = colorField;
          } else {
            cellNew.color = remainedFields[0];
          }
        }
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  if (chartType === 'DYNAMIC BAR CHART') {
    const cellNew = { ...cell };

    if (!cell.time || cell.time === '' || cell.time.length === 0) {
      const flattenedXField = Array.isArray(cell.x) ? cell.x : [cell.x];
      const usedFields = Object.values(cellNew).filter(f => !Array.isArray(f));
      usedFields.push(...flattenedXField);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataset, f);
        return fieldType === 'band';
      });
      if (timeField) {
        cellNew.time = timeField;
      } else {
        cellNew.time = remainedFields[0];
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }
  //直角坐标图表 必须有x字段
  if (CARTESIAN_CHART_LIST.map(chart => chart.toUpperCase()).includes(chartType)) {
    const cellNew = { ...cell };
    if (!cellNew.x) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      //没有分配x字段，从剩下的字段里选择一个离散字段分配到x上
      const xField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataset, f);
        return fieldType === 'band';
      });
      if (xField) {
        cellNew.x = xField;
      } else {
        cellNew.x = remainedFields[0];
      }
    }
    return {
      chartTypeNew: chartType,
      cellNew
    };
  }

  return {
    chartTypeNew: chartType,
    cellNew: cell
  };
};

export const checkChartTypeAndCell = (chartType: string, cell: any): boolean => {
  switch (chartType) {
    case 'BAR CHART':
    case 'LINE CHART':
      checkChannel(cell, 'x');
      checkChannel(cell, 'y');
      break;
    case 'DUAL AXIS CHART':
      checkChannel(cell, 'x');
      checkChannel(cell, 'y', 2);
      break;
    default:
      console.warn('Unchecked Chart Type', chartType);
      break;
  }
  return true;
};

const checkChannel = (cell: any, channel: string, count = 1) => {
  if (count === 1 && typeof cell[channel] === 'string') {
    // channel exist and is a string
    return true;
  }
  if (Array.isArray(cell[channel]) && cell[channel].length === count) {
    // channel is a array
    return true;
  } else {
    throw `cell mismatch channel '${channel}'`;
  }
};

const pipelineBar = [chartType, data, colorBar, cartesianBar, axis, legend, displayConfBar, animationCartesianBar];
const pipelineLine = [chartType, data, colorLine, cartesianLine, axis, legend, displayConfLine, animationCartisianLine];
const pipelinePie = [chartType, data, color, pieField, legend, animationCartesianPie];
const pipelineRankingBar = [
  chartType,
  sequenceData,
  colorDynamicBar,
  rankingBarField,
  rankingBarAxis,
  customMark,
  rankingBarLabel
];

const pipelineWordCloud = [chartType, wordCloudData, color, wordCloudField, wordCloudDisplayConf, animationOneByOne];

const pipelineScatterPlot = [chartType, data, color, scatterField, scatterAxis, legend, animationOneByOne];

const pipelineFunnel = [chartType, funnelData, color, funnelField, legend];

const pipelineDualAxis = [chartType, data, color, dualAxisSeries, dualAxisAxes, legend];

const pipelineRose = [chartType, data, color, roseField, roseAxis, legend, animationCartesianPie];

const pipelineRadar = [chartType, data, color, radarField, radarDisplayConf, radarAxis, legend, animationCartisianLine];

const pipelineSankey = [chartType, sankeyData, color, sankeyField, sankeyLink, sankeyLabel, legend];

const pipelineWaterfall = [chartType, data, color, waterfallField, waterfallAxes, waterfallStackLabel, legend];
const pipelineBoxPlot = [chartType, data, color, boxPlotField, legend];

export const pipelineMap: { [chartType: string]: any } = {
  'BAR CHART': pipelineBar,
  'LINE CHART': pipelineLine,
  'PIE CHART': pipelinePie,
  'WORD CLOUD': pipelineWordCloud,
  'SCATTER PLOT': pipelineScatterPlot,
  'DYNAMIC BAR CHART': pipelineRankingBar,
  'FUNNEL CHART': pipelineFunnel,
  'DUAL AXIS CHART': pipelineDualAxis,
  'ROSE CHART': pipelineRose,
  'RADAR CHART': pipelineRadar,
  'SANKEY CHART': pipelineSankey,
  'WATERFALL CHART': pipelineWaterfall,
  'BOX PLOT CHART': pipelineBoxPlot
};

export const execPipeline = (src: any, pipes: Pipe[], context: Context) =>
  pipes.reduce((pre: any, pipe: Pipe) => {
    const result = pipe(pre, context);
    // console.log(result);
    return result;
  }, src);
