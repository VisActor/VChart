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
  sequenceData,
  rankingBarAxis,
  rankingBarField,
  customMark,
  scatterAxis,
  animationOneByOne,
  animationCartesianBar,
  animationScatter,
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
  DualAxisSeries,
  dualAxisSeries,
  dualAxisAxes,
  dualAxisMarkStyle
} from './pipes';
import { Cell, ChartType, Context, Pipe } from './type';
import { DataView } from '@visactor/vdataset';
import { detectAxesType } from './utils';

export const vizDataToSpec = (
  dataView: DataView,
  chartType: ChartType,
  cell: Cell,
  colors: string[] | undefined,
  totalTime?: number
) => {
  const { chartTypeNew, cellNew } = patchChartTypeAndCell(chartType, cell, dataView);
  const pipelines = pipelineMap[chartTypeNew];
  const spec = execPipeline({}, pipelines, {
    chartType: chartTypeNew,
    dataView,
    cell: cellNew,
    colors,
    totalTime
  });
  return { spec, chartTypeNew };
};

const patchChartTypeAndCell = (chartType: string, cell: any, dataView: DataView) => {
  //对GPT返回结果进行修正
  //某些时候由于用户输入的意图不明确，GPT返回的cell中可能缺少字段。
  //此时需要根据规则补全
  //TODO: 多个y字段时，使用fold

  //y字段有多个, 使用散点图展示
  const { x, y } = cell;

  if (y && typeof y !== 'string' && y.length > 1) {
    if (chartType === 'BAR CHART' || chartType === 'LINE CHART') {
      return {
        chartTypeNew: 'DUAL AXIS CHART',
        cellNew: {
          ...cell
        }
      };
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
  //饼图 必须有color字段和angle字段
  if (chartType === 'PIE CHART') {
    const cellNew = { ...cell };
    if (!cellNew.color || !cellNew.angle) {
      const usedFields = Object.values(cell);
      const dataFields = Object.keys(dataView.latestData[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      if (!cellNew.color) {
        //没有分配颜色字段，从剩下的字段里选择一个离散字段分配到颜色上
        const colorField = remainedFields.find(f => {
          const fieldType = detectAxesType(dataView.latestData, f);
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
          const fieldType = detectAxesType(dataView.latestData, f);
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
      const dataFields = Object.keys(dataView.latestData[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));
      //首先根据cell中的其他字段选择size和color
      //若没有，则从数据的剩余字段中选择
      if (!cellNew.size || cellNew.size === cellNew.color) {
        const newSize = cellNew.weight ?? cellNew.fontSize;
        if (newSize) {
          cellNew.size = newSize;
        } else {
          const sizeField = remainedFields.find(f => {
            const fieldType = detectAxesType(dataView.latestData, f);
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
            const fieldType = detectAxesType(dataView.latestData, f);
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
      const dataFields = Object.keys(dataView.latestData[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataView.latestData, f);
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

  return {
    chartTypeNew: chartType,
    cellNew: cell
  };
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

export const pipelineMap: { [chartType: string]: any } = {
  'BAR CHART': pipelineBar,
  'LINE CHART': pipelineLine,
  'PIE CHART': pipelinePie,
  'WORD CLOUD': pipelineWordCloud,
  'SCATTER PLOT': pipelineScatterPlot,
  'DYNAMIC BAR CHART': pipelineRankingBar,
  'FUNNEL CHART': pipelineFunnel,
  'DUAL AXIS CHART': pipelineDualAxis
};

export const execPipeline = (src: any, pipes: Pipe[], context: Context) =>
  pipes.reduce((pre: any, pipe: Pipe) => {
    const result = pipe(pre, context);
    // console.log(result);
    return result;
  }, src);
