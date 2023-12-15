import {
  type ICartesianSeries,
  STACK_FIELD_TOTAL,
  STACK_FIELD_END,
  STACK_FIELD_END_PERCENT,
  DEFAULT_DATA_KEY
} from '@visactor/vchart';
import { array } from '@visactor/vutils';
import { MarkerTypeEnum } from '../../interface';
import type { IBandLikeScale } from '@visactor/vscale';
import { isPercent } from '../common';
import { average, median, min } from '../math';
import { stackTotal } from './common';
import { parseMarkerSpecWithExpression } from './marker-label';

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
      }
    } else {
      // 默认逻辑
      if (yAxisIsContinuous) {
        markLine._originValue_ = isPercentSeries ? 0.5 : average(seriesData, series.getSpec().yField);
      } else {
        markLine.y = seriesData[0][series.fieldY[0]];
        markLine._originValue_ = seriesData[0][series.fieldY[0]];
      }
    }

    parseMarkerSpecWithExpression(markLine.expression, markLine, {
      isPercent: isPercentSeries
    });
  });

  vValueLines.forEach((markLine: any) => {
    if (isPercent(markLine.x)) {
      if (!isPercentSeries) {
        const position = (Number(markLine.x.substring(0, markLine.x.length - 1)) / 100) * regionWidth;
        const value = series.positionToDataX(position);
        markLine._originValue_ = value;
      }
    } else {
      // 默认逻辑
      if (xAxisTypeIsContinuous) {
        markLine._originValue_ = isPercentSeries ? 0.5 : average(seriesData, series.getSpec().xField);
      } else {
        markLine.x = seriesData[0][series.fieldX[0]];
        markLine._originValue_ = seriesData[0][series.fieldX[0]];
      }
    }

    parseMarkerSpecWithExpression(markLine.expression, markLine, {
      isPercent: isPercentSeries
    });
  });

  hAreas.forEach((markArea: any) => {
    if (isPercent(markArea.y)) {
      if (!isPercentSeries) {
        const yPosition = (Number(markArea.y.substring(0, markArea.y.length - 1)) / 100) * regionHeight;
        const y1Position = (Number(markArea.y1.substring(0, markArea.y1.length - 1)) / 100) * regionHeight;
        const y = series.positionToDataY(yPosition);
        const y1 = series.positionToDataY(y1Position);

        markArea._originValue_ = [y, y1];
      }
    } else {
      if (yAxisIsContinuous) {
        markArea.y = isPercentSeries ? 0 : 'min';
        markArea.y1 = isPercentSeries ? 0.5 : 'median';
        markArea._originValue_ = isPercentSeries
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().yField), median(seriesData, series.getSpec().yField)];
      } else {
        markArea.y = seriesData[0][series.fieldY[0]];
        markArea.y1 = seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]];
        markArea._originValue_ = [
          seriesData[0][series.fieldY[0]],
          seriesData[Math.floor(seriesData.length / 2)][series.fieldY[0]]
        ];
      }
    }

    parseMarkerSpecWithExpression(markArea.expression, markArea, {
      isPercent: isPercentSeries
    });
  });

  vAreas.forEach((markArea: any) => {
    if (isPercent(markArea.y)) {
      if (!isPercentSeries) {
        const xPosition = (Number(markArea.x.substring(0, markArea.x.length - 1)) / 100) * regionWidth;
        const x1Position = (Number(markArea.x1.substring(0, markArea.x1.length - 1)) / 100) * regionWidth;

        const x = series.positionToDataX(xPosition);
        const x1 = series.positionToDataX(x1Position);
        markArea._originValue_ = [x, x1];
      }
    } else {
      if (xAxisTypeIsContinuous) {
        markArea.x = isPercentSeries ? 0 : 'min';
        markArea.x1 = isPercentSeries ? 0.5 : 'median';
        markArea._originValue_ = isPercentSeries
          ? [0, 0.5]
          : [min(seriesData, series.getSpec().xField), median(seriesData, series.getSpec().xField)];
      } else {
        markArea.x = seriesData[0][series.fieldX[0]];
        markArea.x1 = seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]];
        markArea._originValue_ = [
          seriesData[0][series.fieldX[0]],
          seriesData[Math.floor(seriesData.length / 2)][series.fieldX[0]]
        ];
      }
    }

    parseMarkerSpecWithExpression(markArea.expression, markArea, {
      isPercent: isPercentSeries
    });
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
    markLine._originValue_ = [newStart[valueFieldInData], newEnd[valueFieldInData]];

    parseMarkerSpecWithExpression(markLine.expression, markLine, {
      length
    });
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
    markLine._originValue_ = [newStart[valueFieldInData], newEnd[valueFieldInData]];
    parseMarkerSpecWithExpression(markLine.expression, markLine, {
      isPercent: isPercentSeries
    });
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
    markLine._originValue_ = [startValue, endValue];

    parseMarkerSpecWithExpression(markLine.expression, markLine, {
      isPercent: isPercentSeries
    });
  });
}
