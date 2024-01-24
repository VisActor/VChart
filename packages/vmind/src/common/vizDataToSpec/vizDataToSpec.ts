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
  boxPlotField,
  boxPlotStyle
} from './pipes';
import { Cell, ChartType, Context, FieldInfo, Pipe, SimpleFieldInfo } from '../../typings';
import { CARTESIAN_CHART_LIST, detectAxesType } from './utils';
import { isArray } from 'lodash';
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

export const checkChartTypeAndCell = (chartType: string, cell: any, fieldInfo: SimpleFieldInfo[]): boolean => {
  const fieldList = fieldInfo.map(f => f.fieldName);
  const cellFields: (string | string[])[] = Object.values(cell);
  cellFields.forEach((cellField: string | string[]) => {
    if (!cellField) {
      return;
    }
    if (isArray(cellField)) {
      if (!cellField.every(f => f && fieldList.includes(f))) {
        throw `missing field ${cellField}`;
      }
    } else {
      if (cellField && !fieldList.includes(cellField)) {
        throw `missing field ${cellField}`;
      }
    }
  });
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
const pipelineBoxPlot = [chartType, data, color, boxPlotField, boxPlotStyle, legend];

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
  'BOX PLOT': pipelineBoxPlot
};

export const execPipeline = (src: any, pipes: Pipe[], context: Context) =>
  pipes.reduce((pre: any, pipe: Pipe) => {
    const result = pipe(pre, context);
    return result;
  }, src);
