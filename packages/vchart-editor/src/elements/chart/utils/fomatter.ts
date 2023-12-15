import type { ICartesianSeries, ISeries, IVChart } from '@visactor/vchart';
import type { FormatConfig } from '../../../typings/common';
import { validNumber } from '../../../utils/data';
import type { IBandLikeScale } from '@visactor/vscale';
import { calculateCAGR } from './marker/common';
import { array, isString, isValid } from '@visactor/vutils';
import { parseMarkerLabelText } from './marker/marker-label';

export function processFormatConfig(spec: any, modelSpec: any, chartType: string, vchart: IVChart) {
  // TODO: check by template
  const isPercentageChart =
    chartType === 'barPercent' || chartType === 'horizontalBarPercent' || chartType === 'areaPercent';
  const isDimensionChart = chartType === 'pie';
  let defaultFormatConfig: FormatConfig = isDimensionChart ? { content: 'dimension', fixed: 0 } : { fixed: 0 };
  switch (modelSpec?.name) {
    case 'h-line':
    case 'v-line':
    case 'h-area':
    case 'v-area':
      defaultFormatConfig = isPercentageChart ? { content: 'percentage', fixed: 0 } : { fixed: 0 };
      break;
    case 'growth-line':
      defaultFormatConfig = { content: 'CAGR', fixed: 0 };
      break;
    case 'total-diff-line':
    case 'hierarchy-diff':
    case 'hierarchy-diff-line':
      defaultFormatConfig = { content: 'percentage', fixed: 0 };
      break;
  }
  switch (modelSpec?.name) {
    case 'h-line':
    case 'v-line':
      spec.formatMethod = (value: any, datum: any, context: any) => {
        const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
        // line marker content only support value / percentage for now
        const isPercentage = formatConfig.content === 'percentage';
        const labelValue = modelSpec._originValue_ * (isPercentage ? 100 : 1);
        const labelContent = formatNumber(labelValue, formatConfig, isPercentage);
        if (!isFinite(labelValue)) {
          return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(spec.text, modelSpec)}${
            formatConfig.postfix ?? ''
          }`;
        }
        return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(labelContent, modelSpec)}${
          formatConfig.postfix ?? ''
        }`;
      };
      break;
    case 'h-area':
    case 'v-area':
      spec.formatMethod = (value: any, datum: any, context: any) => {
        const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
        // line marker content only support value / percentage for now
        const isPercentage = formatConfig.content === 'percentage';
        const fromValue = modelSpec._originValue_?.[0] * (isPercentage ? 100 : 1);
        const fromContent = formatNumber(fromValue, formatConfig, isPercentage);
        const toValue = modelSpec._originValue_?.[1] * (isPercentage ? 100 : 1);
        const toContent = formatNumber(toValue, formatConfig, isPercentage);
        if (!isFinite(fromValue) || !isFinite(toValue)) {
          return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(spec.text, modelSpec)}${
            formatConfig.postfix ?? ''
          }`;
        }
        return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(`${fromContent} - ${toContent}`, modelSpec)}${
          formatConfig.postfix ?? ''
        }`;
      };
      break;
    case 'growth-line':
    case 'total-diff-line':
    case 'hierarchy-diff-line':
      spec.formatMethod = (value: any, datum: any, context: any) => {
        const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
        if (formatConfig.content === 'value(percentage)' || formatConfig.content === 'percentage(value)') {
          const numberValue = getMarkerFormatContent(vchart, 'value', modelSpec);
          const numberContent = formatNumber(numberValue, formatConfig);
          const percentValue = getMarkerFormatContent(vchart, 'percentage', modelSpec);
          const percentContent = formatNumber(percentValue, formatConfig, true);
          const content =
            formatConfig.content === 'value(percentage)'
              ? `${numberContent}(${percentContent})`
              : `${percentContent}(${numberContent})`;
          return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(content, modelSpec)}${formatConfig.postfix ?? ''}`;
        }
        const labelValue = getMarkerFormatContent(vchart, formatConfig.content, modelSpec);
        const labelContent = formatNumber(
          labelValue,
          formatConfig,
          formatConfig.content === 'percentage' || formatConfig.content === 'CAGR'
        );
        return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(labelContent, modelSpec)}${
          formatConfig.postfix ?? ''
        }`;
      };
      break;
    default:
      spec.formatMethod = (value: any, datum: any, context: any) => {
        // apply percentage content for axis
        if (isPercentageChart) {
          defaultFormatConfig = { content: 'percentage', fixed: 0 };
        }
        const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
        if (formatConfig.content === 'value(percentage)' || formatConfig.content === 'percentage(value)') {
          const numberValue = getNormalFormatContent('value', value, datum, context, modelSpec);
          const numberContent = formatNumber(numberValue, formatConfig);
          const percentValue = getNormalFormatContent('percentage', value, datum, context, modelSpec);
          const percentContent = formatNumber(percentValue, formatConfig, true);
          const content =
            formatConfig.content === 'value(percentage)'
              ? `${numberContent}(${percentContent})`
              : `${percentContent}(${numberContent})`;
          return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(content, modelSpec)}${formatConfig.postfix ?? ''}`;
        }
        const labelValue = getNormalFormatContent(formatConfig.content, value, datum, context, modelSpec);
        const labelContent = formatNumber(labelValue, formatConfig, formatConfig.content === 'percentage');
        return `${formatConfig.prefix ?? ''}${parseMarkerLabelText(labelContent, modelSpec)}${
          formatConfig.postfix ?? ''
        }`;
      };
      break;
  }
}

export function getNormalFormatContent(
  content: FormatConfig['content'],
  value: any,
  datum: any,
  context: any,
  modelSpec: any
) {
  // axis not support format content
  if (['axis-left', 'axis-right', 'axis-top', 'axis-bottom'].includes(modelSpec?.id)) {
    const parsedValue = validNumber(Number.parseFloat(value)) ?? value;
    return content === 'percentage' ? parsedValue * 100 : parsedValue;
  }
  const series: ISeries = context.series;
  const dimensionField = series.getDimensionField()[0];
  const measureField = series.getMeasureField()[0];

  switch (content) {
    case 'dimension':
      return datum[dimensionField];
    case 'abs':
      return Math.abs(datum[measureField]);
    case 'percentage':
      return validNumber(computeSeriesPercentage(datum, context.series)) ?? '超过 0 的百分比';
    case 'value':
    default:
      return Number.parseFloat(datum[measureField]);
    // additional handle value&percentage case
  }
}

export function getMarkerFormatContent(vchart: IVChart, content: FormatConfig['content'], spec: any) {
  const series = vchart.getChart().getAllSeries()[0] as ICartesianSeries;
  const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
  const dimensionField =
    series.direction === 'horizontal' ? array(series.getSpec().yField)[0] : array(series.getSpec().xField)[0];

  const startDatum = spec.coordinates[0];
  const endDatum = spec.coordinates[1];

  const diff = Number.parseFloat(endDatum[valueField]) - Number.parseFloat(startDatum[valueField]);

  const dimensionTicks =
    series.direction === 'horizontal'
      ? (series.getYAxisHelper().getScale(0) as IBandLikeScale).ticks()
      : (series.getXAxisHelper().getScale(0) as IBandLikeScale).ticks();
  const n = Math.abs(
    dimensionTicks.indexOf(endDatum[dimensionField]) - dimensionTicks.indexOf(startDatum[dimensionField])
  );

  switch (content) {
    case 'abs':
      return Math.abs(diff);
    case 'percentage':
      return (
        validNumber(((endDatum[valueField] - startDatum[valueField]) / startDatum[valueField]) * 100) ??
        '超过 0 的百分比'
      );
    case 'CAGR':
      return validNumber(calculateCAGR(endDatum[valueField], startDatum[valueField], n) * 100) ?? '超过 0 的百分比';
    case 'value':
    default:
      return diff;
    // additional handle value&percentage case
  }
}

export function computeSeriesPercentage(datum: any, series: ISeries) {
  const dimensionField = series.getDimensionField()[0];
  const measureField = series.getMeasureField()[0];
  const dimensionData = series.getViewData().latestData.filter((d: any) => datum[dimensionField] === d[dimensionField]);
  const totalValue = dimensionData.reduce((sum: number, d: any) => {
    return sum + Number.parseFloat(d[measureField]);
  }, 0);

  return (Number.parseFloat(datum[measureField]) / totalValue) * 100;
}

export function formatNumber(value: number | string, formatConfig: FormatConfig, percentage?: boolean): string {
  if (isString(value)) {
    return value;
  }
  let result: number | string = value;
  if (isValid(formatConfig.unit)) {
    result /= 10 ** formatConfig.unit;
  }
  if (formatConfig.separator) {
    result =
      isValid(formatConfig.fixed) && formatConfig.fixed !== 'auto'
        ? Intl.NumberFormat(undefined, {
            minimumFractionDigits: formatConfig.fixed,
            maximumFractionDigits: formatConfig.fixed
          }).format(value)
        : Intl.NumberFormat().format(value);
  } else {
    if (isValid(formatConfig.fixed) && formatConfig.fixed !== 'auto') {
      result = (value as number).toFixed(formatConfig.fixed);
    }
  }
  return percentage ? `${result.toString()}%` : result.toString();
}
