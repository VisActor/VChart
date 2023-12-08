import { DataTempTransform } from './data-temp-transform';
import type { IChartModel } from './../interface';
import { isArray, isObject, isEmpty, cloneDeep, isValid, array, EventEmitter, isString, last } from '@visactor/vutils';
import type { IModelInfo, IUpdateAttributeParam } from './../../../core/interface';
import type { ILayoutData } from '../layout/interface';
import type { IEditorSpec, IModelSpec, ISpecProcess } from './interface';
// @ts-ignore
import type { ISeries, ISpec, ITheme } from '@visactor/vchart';
import { diffSpec, isModelInfoMatchSpec, isSameModelInfo } from '../../../utils/spec';
import type { EditorChart } from '../chart';
import { mergeSpec } from '../utils/spec';
import type { FormatConfig } from '../../../typings/common';
import type { IBandLikeScale } from '@visactor/vscale';
import { calculateCAGR } from '../utils/marker';
import { validNumber } from '../../../utils/data';

const DefaultEditorSpec: IEditorSpec = {
  theme: null,
  temp: null,
  color: null,
  modelSpec: null,
  data: null,
  layout: { viewBox: { x: 0, y: 0, width: 0, height: 0 }, data: [] },
  marker: {
    markLine: [],
    markArea: []
  }
};

export class SpecProcess implements ISpecProcess {
  // 编辑器spec 存储和加载都是这个数据结构
  // 保证结构可序列化。
  protected _editorSpec: IEditorSpec = cloneDeep(DefaultEditorSpec);
  protected _onSpecReadyCall: () => void = null;
  // vchartSpec 只作为临时转换结果，传递给vchart，不会存储。
  protected _vchartSpec: ISpec = {} as any;

  protected _dataTempTransform: DataTempTransform;
  get dataTempTransform() {
    return this._dataTempTransform;
  }

  protected _chart: EditorChart = null;

  emitter: EventEmitter = new EventEmitter();

  constructor(chart: EditorChart, call: () => void) {
    this._chart = chart;
    this._dataTempTransform = new DataTempTransform(this._chart);
    this._onSpecReadyCall = call;
    this._dataTempTransform.emitter.on('specReady', this.transformSpec);
    this._dataTempTransform.emitter.on('tempUpdate', this._tempUpdateSuccess);
    this._dataTempTransform.emitter.on('dataUpdate', this._dataUpdateSuccess);
    this._dataTempTransform.emitter.on('dataTempUpdate', this._dataTempUpdateSuccess);
  }

  getEditorSpec() {
    return this._editorSpec;
  }

  updateEditorSpec(spec: IEditorSpec) {
    this._editorSpec = spec;
    if (!this._editorSpec) {
      this._editorSpec = cloneDeep(DefaultEditorSpec);
    }
    if (this._editorSpec.layout) {
      this.updateLayout(this._editorSpec.layout);
    }
    if (this._editorSpec.theme) {
      this.updateTheme(this._editorSpec.theme);
    }

    this._dataTempTransform.updateChartDataTemp(this._editorSpec.data, this._editorSpec.temp);
  }

  clearEditorSpec() {
    this._editorSpec = cloneDeep(DefaultEditorSpec);
  }

  updateTheme(theme: ITheme) {
    this._editorSpec.theme = theme;
    this.transformSpec();
  }
  updateLayout(layout: ILayoutData) {
    this._editorSpec.layout = layout;
  }

  updateTemp(key: string) {
    this._dataTempTransform.updateChartDataTemp(null, key);
  }

  updateData(type: string, value: string) {
    this._dataTempTransform.updateChartDataTemp({ type, value }, null);
  }

  updateDataValue(value: string) {
    this._dataTempTransform.dataParser?.updateValue(value);
  }

  getVChartSpec() {
    return this._vchartSpec;
  }

  private _dataUpdateSuccess = () => {
    const willPushHistory = !!this._editorSpec.data && !!this._chart.vchart;
    willPushHistory && this.saveSnapshot();
    this._editorSpec.data = this._dataTempTransform.dataParser.getSave();
    willPushHistory && this.pushHistory();
  };
  private _tempUpdateSuccess = () => {
    const willPushHistory = !!this._editorSpec.data && !!this._chart.vchart;
    this.emitter.emit('beforeTempChange', willPushHistory);
    willPushHistory && this.saveSnapshot();
    this._editorSpec.temp = this._dataTempTransform.specTemp.type;
    willPushHistory && this.pushHistory();
    this.emitter.emit('afterTempChange');
  };
  private _dataTempUpdateSuccess = () => {
    const willPushHistory = !!this._editorSpec.data && !!this._chart.vchart;
    this.emitter.emit('beforeTempChange', willPushHistory);
    willPushHistory && this.saveSnapshot();
    this._editorSpec.data = this._dataTempTransform.dataParser.getSave();
    this._editorSpec.temp = this._dataTempTransform.specTemp.type;
    willPushHistory && this.pushHistory();
    this.emitter.emit('afterTempChange');
  };

  protected transformSpec = () => {
    this._vchartSpec = this._dataTempTransform.getBaseSpec();
    this._mergeEditorSpec();
    this._onSpecReadyCall();
  };

  clear() {
    this._onSpecReadyCall = null;
    this._dataTempTransform.release();
    this._dataTempTransform = null;
    this._editorSpec = null;
    this._vchartSpec = null;
  }

  private _mergeEditorSpec() {
    // transform spec 的过程
    // 色板 考虑模版可能有配置 color 。还是放到 spec 的 color 中处理
    if (this._editorSpec.color) {
      if (isArray(this._vchartSpec.color) || !isObject(this._vchartSpec.color)) {
        this._vchartSpec.color = this._editorSpec.color;
      } else {
        this._vchartSpec.color.range = this._editorSpec.color;
      }
    }
    // 模块样式
    if (this._editorSpec.modelSpec) {
      this._editorSpec.modelSpec.forEach(s => {
        const chartSpec = this.findChartSpec(s, this._vchartSpec);
        if (!chartSpec) {
          // 部分封装 chart series 配置会直接放到chart 上
          if (s.specKey === 'series' && s.specIndex === 0) {
            mergeSpec(this._vchartSpec, s.spec);
          }
          return;
        }
        mergeSpec(chartSpec, s.spec);
      });
    }

    if (this._editorSpec.marker) {
      Object.keys(this._editorSpec.marker).forEach(key => {
        this._vchartSpec[key] = this._editorSpec.marker[key];
      });
    }

    // process formatConfig
    const traverseSpec = (spec: any, modelSpec?: any) => {
      const specKeys = Object.keys(spec);
      if (specKeys.includes('formatConfig')) {
        this.processFormatConfig(spec, modelSpec, this._dataTempTransform.specTemp.type);
      }
      const currentModel = isValid(spec.name) || isValid(spec.id) ? spec : modelSpec;
      specKeys.forEach(specKey => {
        if (specKey === 'data' || !isObject(spec[specKey])) {
          return;
        }
        traverseSpec(spec[specKey], currentModel);
      });
    };
    traverseSpec(this._vchartSpec);
  }

  private processFormatConfig(spec: any, modelSpec: any, chartType: string) {
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
          const labelContent = this.formatNumber(labelValue, formatConfig, isPercentage);
          if (!isFinite(labelValue)) {
            return `${formatConfig.prefix ?? ''}${spec.text}${formatConfig.postfix ?? ''}`;
          }
          return `${formatConfig.prefix ?? ''}${labelContent}${formatConfig.postfix ?? ''}`;
        };
        break;
      case 'h-area':
      case 'v-area':
        spec.formatMethod = (value: any, datum: any, context: any) => {
          const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
          // line marker content only support value / percentage for now
          const isPercentage = formatConfig.content === 'percentage';
          const fromValue = modelSpec._originValue_?.[0] * (isPercentage ? 100 : 1);
          const fromContent = this.formatNumber(fromValue, formatConfig, isPercentage);
          const toValue = modelSpec._originValue_?.[1] * (isPercentage ? 100 : 1);
          const toContent = this.formatNumber(toValue, formatConfig, isPercentage);
          if (!isFinite(fromValue) || !isFinite(toValue)) {
            return `${formatConfig.prefix ?? ''}${spec.text}${formatConfig.postfix ?? ''}`;
          }
          return `${formatConfig.prefix ?? ''}${fromContent} - ${toContent}${formatConfig.postfix ?? ''}`;
        };
        break;
      case 'growth-line':
      case 'total-diff-line':
      case 'hierarchy-diff-line':
        spec.formatMethod = (value: any, datum: any, context: any) => {
          const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
          if (formatConfig.content === 'value(percentage)' || formatConfig.content === 'percentage(value)') {
            const numberValue = this.getMarkerFormatContent('value', modelSpec);
            const numberContent = this.formatNumber(numberValue, formatConfig);
            const percentValue = this.getMarkerFormatContent('percentage', modelSpec);
            const percentContent = this.formatNumber(percentValue, formatConfig, true);
            const content =
              formatConfig.content === 'value(percentage)'
                ? `${numberContent}(${percentContent})`
                : `${percentContent}(${numberContent})`;
            return `${formatConfig.prefix ?? ''}${content}${formatConfig.postfix ?? ''}`;
          }
          const labelValue = this.getMarkerFormatContent(formatConfig.content, modelSpec);
          const labelContent = this.formatNumber(
            labelValue,
            formatConfig,
            formatConfig.content === 'percentage' || formatConfig.content === 'CAGR'
          );
          return `${formatConfig.prefix ?? ''}${labelContent}${formatConfig.postfix ?? ''}`;
        };
        break;
      default:
        spec.formatMethod = (value: any, datum: any, context: any) => {
          const formatConfig = Object.assign(defaultFormatConfig, spec.formatConfig) as FormatConfig;
          if (formatConfig.content === 'value(percentage)' || formatConfig.content === 'percentage(value)') {
            const numberValue = this.getNormalFormatContent('value', value, datum, context, modelSpec);
            const numberContent = this.formatNumber(numberValue, formatConfig);
            const percentValue = this.getNormalFormatContent('percentage', value, datum, context, modelSpec);
            const percentContent = this.formatNumber(percentValue, formatConfig, true);
            const content =
              formatConfig.content === 'value(percentage)'
                ? `${numberContent}(${percentContent})`
                : `${percentContent}(${numberContent})`;
            return `${formatConfig.prefix ?? ''}${content}${formatConfig.postfix ?? ''}`;
          }
          const labelValue = this.getNormalFormatContent(formatConfig.content, value, datum, context, modelSpec);
          const labelContent = this.formatNumber(labelValue, formatConfig, formatConfig.content === 'percentage');
          return `${formatConfig.prefix ?? ''}${labelContent}${formatConfig.postfix ?? ''}`;
        };
        break;
    }
  }

  private getNormalFormatContent(
    content: FormatConfig['content'],
    value: any,
    datum: any,
    context: any,
    modelSpec: any
  ) {
    // axis not support format content
    if (['axis-left', 'axis-right', 'axis-top', 'axis-bottom'].includes(modelSpec.id)) {
      return validNumber(Number.parseFloat(value)) ?? value;
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
        return validNumber(this.computeSeriesPercentage(datum, context.series)) ?? '超过 0 的百分比';
      case 'value':
      default:
        return Number.parseFloat(datum[measureField]);
      // additional handle value&percentage case
    }
  }

  private getMarkerFormatContent(content: FormatConfig['content'], spec: any) {
    const series = (this._chart as any)._vchart.getChart().getAllSeries()[0];
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

  private computeSeriesPercentage(datum: any, series: ISeries) {
    const dimensionField = series.getDimensionField()[0];
    const measureField = series.getMeasureField()[0];
    const dimensionData = series
      .getViewData()
      .latestData.filter((d: any) => datum[dimensionField] === d[dimensionField]);
    const totalValue = dimensionData.reduce((sum: number, d: any) => {
      return sum + Number.parseFloat(d[measureField]);
    }, 0);

    return (Number.parseFloat(datum[measureField]) / totalValue) * 100;
  }

  private formatNumber(value: number | string, formatConfig: FormatConfig, percentage?: boolean): string {
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

  private findChartSpec(s: IModelSpec, vchartSpec: ISpec) {
    const chartSpec = this._vchartSpec[s.specKey];
    if (!chartSpec) {
      return null;
    }
    if (isArray(chartSpec)) {
      return chartSpec.find((_s, index) => {
        return isModelInfoMatchSpec(s, _s, s.specKey, index);
      });
    } else if (isObject(chartSpec)) {
      return isModelInfoMatchSpec(s, chartSpec as { id: string | number }, s.specKey, 0) ? chartSpec : null;
    }
    return null;
  }

  private getModelSpecEditorSpec(model: IModelInfo): IModelSpec {
    if (!this._editorSpec.modelSpec) {
      return null;
    }
    return this._editorSpec.modelSpec.find(s => isSameModelInfo(model, s));
  }

  private mergeModelEditorSpec(model: IModelInfo, spec: any) {
    let s = this.getModelSpecEditorSpec(model);
    if (!s) {
      s = {
        id: model.id,
        specKey: model.specKey,
        specIndex: model.specIndex,
        spec: mergeSpec({}, spec)
      };
      this._editorSpec.modelSpec = this._editorSpec.modelSpec || [];
      this._editorSpec.modelSpec.push(s);
    }
    s.spec = mergeSpec(s.spec, spec);
  }

  // 更新模块spec
  updateElementAttribute(model: IChartModel, attr: IUpdateAttributeParam, triggerHistory: boolean = true) {
    if (triggerHistory) {
      this.saveSnapshot();
    }
    let hasChange = false;
    if (attr.color) {
      hasChange = true;
      this._editorSpec.color = attr.color;
    }
    if (attr.spec) {
      hasChange = true;
      const modelInfo = { id: model.userId, specKey: model.specKey, specIndex: model.getSpecIndex() };
      this.mergeModelEditorSpec(modelInfo, attr.spec);
      this._chart.layout.resetModelLayoutDataAfterAttributeChanged(modelInfo, model);
    }
    if (attr.modelSpec) {
      hasChange = true;
      attr.modelSpec.forEach(mSpec => {
        this.mergeModelEditorSpec(mSpec, mSpec.spec);
        this._chart.layout.resetModelLayoutDataAfterAttributeChanged(mSpec);
      });
    }

    if (attr.markLine && attr.markLine.spec) {
      hasChange = true;
      this.updateMarker(attr.markLine, 'markLine', model.userId);
    }

    if (attr.markArea && attr.markArea.spec) {
      hasChange = true;
      this.updateMarker(attr.markArea, 'markArea', model.userId);
    }

    this._mergeEditorSpec();
    if (triggerHistory) {
      this.pushHistory();
    }
    return hasChange;
  }

  private updateMarker(config: { spec?: any; enable?: boolean }, key: string, id?: string | number) {
    // 更新编辑器数据
    if (!this._editorSpec.marker) {
      this._editorSpec.marker = {
        markArea: [],
        markLine: []
      };
    }

    const { spec, enable } = config;
    const markersInEditorSpec = this._editorSpec.marker[key];
    if (enable !== false) {
      if (isEmpty(markersInEditorSpec)) {
        this._editorSpec.marker[key] = [spec];
      } else {
        const markerIndex = markersInEditorSpec.findIndex((markerSpec: any) => markerSpec.id === (id || spec.id));
        if (markerIndex === -1) {
          this._editorSpec.marker[key].push(spec);
        } else {
          // 更新 spec 同时调整层级，最近编辑的元素层级最高
          const updatedSpec = mergeSpec({}, this._editorSpec.marker[key][markerIndex], spec);
          const lastIndex = this._editorSpec.marker[key].length - 1;
          const lastSpec = last(this._editorSpec.marker[key]);
          this._editorSpec.marker[key][markerIndex] = lastSpec;
          this._editorSpec.marker[key][lastIndex] = updatedSpec;
        }
      }
    } else {
      // 删除逻辑
      const markerIndex = (markersInEditorSpec ?? []).findIndex((markerSpec: any) => markerSpec.id === (id || spec.id));
      if (markerIndex !== -1) {
        this._editorSpec.marker[key].splice(markerIndex, 1);
      }
    }
  }

  clearMarker() {
    delete this._editorSpec.marker;
  }

  protected _snapShot: any = null;
  saveSnapshot() {
    this._snapShot = cloneDeep(this._chart.getData());
  }
  clearSnapshot() {
    this._snapShot = null;
  }

  pushHistory() {
    const { from, to } = diffSpec(this._snapShot, this._chart.getData());
    if (Object.keys(from).length === Object.keys(to).length && Object.keys(from).length === 0) {
      return;
    }
    this._chart.option.editorData.pushHistoryNextTick({
      element: this._chart.getElementInfo(),
      from: cloneDeep(from),
      to: cloneDeep(to),
      use: this._chart.option.commonHistoryUse
    });
  }

  updateAttributeFromHistory(att: any) {
    this._chart.layout.setViewBox(att.rect);
    if (att.attribute) {
      if (att.attribute.data) {
        this._dataTempTransform.updateChartDataTemp(att.attribute.data, att.attribute.temp);
      }
      if (att.attribute.layout) {
        this._chart.layout.setLayoutData(att.attribute.layout);
      }
      if (att.attribute) {
        this.updateEditorSpec(mergeSpec(this._editorSpec, att.attribute));
      }
      this._chart.reRenderWithUpdateSpec();
    }

    this._updateEditorBox();
  }

  private _updateEditorBox() {
    // do nothing
  }
}
