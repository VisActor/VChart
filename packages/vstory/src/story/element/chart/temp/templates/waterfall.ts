import type { IDataValue } from './../../data/interface';
import { ChartValueField } from './../../../../core/const';
import type { DirectionType } from './../../../../typings/space';
import { array, merge, isValidNumber, isString } from '@visactor/vutils';
import type { IUpdateAttributeParam } from './../../../../core/interface';
import type { IEditorSpec } from './../../spec-process/interface';
import type { ISpec, IWaterfallSeriesSpec } from '../../../../libs/vchart/type';
import type { StandardData } from '../../data/interface';
import type { DataInfo } from '../../data/interface';
import { BaseTemp } from './base-temp';
import { CommonStandardDataCheck, fillCartesianSeriesSpec, getCartesianCommonSpec, getTotalLabelSpec } from './common';
import type { EditorChart } from '../../chart';
import { ChartDimensionField, ChartTypeField, FieldLinkString } from '../../../../core/const';
import { copyWritings } from '../../../../utils/i18n';
import { TemplateChartType } from '../constant';

export const WaterfallTotalTagField = `_editor_waterfall_total`;
export const WaterfallTotalValueField = `_editor_waterfall_total_value`;
export const WaterfallRawDimensionField = ChartDimensionField + `_waterfall_raw`;
export const WaterfallRawTypeField = ChartTypeField + `_waterfall_raw`;
const defaultTotalColor = '#BCC0C5';

const defaultStackLabelStyle = {
  offset: 6
};

export function waterfallTooltipFormat(baseText: string, language: string, showIndex = 0) {
  // 暂时为了性能考虑，不使用字符串替换。避免轴数据过多时，性能不好。先逐个case处理
  if (baseText === WaterfallTotalTagField) {
    return copyWritings.waterfallTotal[language];
  }
  if (baseText.includes && baseText.includes(FieldLinkString)) {
    const text = baseText.split(FieldLinkString)[showIndex];
    return text === WaterfallTotalTagField ? copyWritings.waterfallTotal[language] : text;
  }
  return baseText;
}

function formatStackLabel(
  rawSpec: ISpec,
  editorSpec: IEditorSpec,
  lastFormat: (...args: any[]) => void,
  language: string,
  ...args: any[]
) {
  const textList = array(lastFormat ? lastFormat(...args) : args[0]);
  const datum = args[1];
  // 瀑布图只有一个系列配置与一组数据
  if (!editorSpec?.modelSpec || !rawSpec?.series) {
    return textList;
  }
  const series = rawSpec.series[0] as IWaterfallSeriesSpec;
  // 如果没有设置过，设置为默认值
  const editorSeries = editorSpec.modelSpec.find(s => s.id === series.id);
  if (!editorSeries) {
    return textList;
  }
  const stackType = editorSeries.spec.stackType ?? defaultStackType;
  // 如果是维度值
  if (isString(textList[0]) && textList[0].includes(datum.index)) {
    const dimensionValue = datum.index.split(FieldLinkString)[0];
    return textList[0]
      .replace(datum.index, dimensionValue)
      .replace(WaterfallTotalTagField, copyWritings.waterfallTotal[language]);
  }
  return textList.map((t: string) => {
    if (stackType === 'group') {
      return t.replace(WaterfallTotalTagField, copyWritings.waterfallTotal[language]).replace(FieldLinkString, '');
    }
    return t.replace(WaterfallTotalTagField, copyWritings.waterfallTotal[language]).replace(FieldLinkString, '');
  });
}

export function isTotalTag(v: string) {
  return v === 'e' || v === 'E';
}

export function spec(direction: DirectionType) {
  return {
    type: 'waterfall',
    stack: true,
    bar: {
      state: {
        hover: {
          stroke: '#000',
          lineWidth: 1
        }
      }
    },
    label: {
      visible: true,
      position: 'inside',
      style: {
        lineHeight: '100%',
        lineWidth: 1,
        fontSize: 16,
        fontWeight: 'bold'
      },
      overlap: {
        strategy: [] as any[]
      },
      smartInvert: true
    },
    totalLabel: {
      ...defaultStackLabelStyle,
      ...getTotalLabelSpec(true)
    },
    direction
  };
}

const defaultTotal = {
  type: 'field',
  tagField: WaterfallTotalTagField,
  valueField: WaterfallTotalValueField
};

const defaultStackType = 'stack';

export class WaterfallTemp extends BaseTemp {
  static type = TemplateChartType.waterfall;
  type = WaterfallTemp.type;
  direction: DirectionType = 'vertical';
  checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean {
    return CommonStandardDataCheck(data);
  }

  getSpec(data: StandardData, info: DataInfo, ctx: { chart: EditorChart }, opt?: { stackType: 'stack' | 'group' }) {
    const cartesianCommonSpec = getCartesianCommonSpec(this.direction) as any;
    WaterfallTemp.filterData(data);
    // 默认是堆积
    if (opt?.stackType !== 'group') {
      cartesianCommonSpec.data = WaterfallTemp.transformDataToStack(
        data,
        ctx,
        {},
        {
          [ChartDimensionField]: {
            ...info[ChartDimensionField],
            domain: [...info[ChartDimensionField].domain, WaterfallTotalTagField],
            sortIndex: 0
          }
        }
      );
      cartesianCommonSpec.series = [
        fillCartesianSeriesSpec(spec(this.direction), this.direction, cartesianCommonSpec.data[0], {
          multiDimensionField: false,
          stack: true
        })
      ];
    } else {
      // 按组顺序平铺
      cartesianCommonSpec.data = WaterfallTemp.transformDataToGroup(
        data,
        ctx,
        {},
        {
          [ChartDimensionField]: {
            ...info[ChartDimensionField],
            domain: [...info[ChartDimensionField].domain, WaterfallTotalTagField],
            sortIndex: 0
          }
        }
      );
      cartesianCommonSpec.series = [
        fillCartesianSeriesSpec(spec(this.direction), this.direction, cartesianCommonSpec.data[0], {
          multiDimensionField: false,
          stack: true
        })
      ];
    }
    // 始终保留 total 配置
    cartesianCommonSpec.series[0].total = { ...defaultTotal };

    // 维度轴的默认 format
    const dimensionAxes = cartesianCommonSpec.axes.find(a => a.type === 'band');
    if (!dimensionAxes.label.formatMethod) {
      dimensionAxes.label.formatMethod = (baseText: string) => waterfallTooltipFormat(baseText, ctx.chart.language);
    }

    // 图例的默认 format
    cartesianCommonSpec.legends.item = merge({ label: {} }, cartesianCommonSpec.legends.item);
    cartesianCommonSpec.legends.item.label.formatMethod = (baseText: string) => {
      if (baseText === WaterfallTotalTagField) {
        return copyWritings.waterfallTotal[ctx.chart.language];
      }
      if (baseText.includes(FieldLinkString)) {
        const fields = baseText.split(FieldLinkString);
        let tag = fields[1];
        if (tag === WaterfallTotalTagField) {
          tag = copyWritings.waterfallTotal[ctx.chart.language];
        }
        return `${tag}(${fields[0]})`;
      }
      return baseText;
    };

    // tooltip 的默认 format
    cartesianCommonSpec.tooltip.mark = cartesianCommonSpec.tooltip.mark ?? {};
    this._setTooltipFormat(cartesianCommonSpec.tooltip.mark, ctx);
    cartesianCommonSpec.tooltip.dimension = cartesianCommonSpec.tooltip.dimension ?? {};
    this._setTooltipFormat(cartesianCommonSpec.tooltip.dimension, ctx);
    return cartesianCommonSpec;
  }

  private _setTooltipFormat(tooltipSpec: any, ctx: any) {
    if (!tooltipSpec.updateContent) {
      tooltipSpec.updateContent = (prev: any) => {
        prev.forEach((item: any) => {
          item.key = waterfallTooltipFormat(item.key, ctx.chart.language);
        });
        return prev;
      };
    }
    if (!tooltipSpec.updateTitle) {
      tooltipSpec.updateTitle = (prev: any) => {
        prev.value = waterfallTooltipFormat(prev.value, ctx.chart.language);
        return prev;
      };
    }
  }

  static filterData(data: StandardData) {
    array(data).forEach((d: IDataValue) => {
      d.values = d.values.filter((_d, _i) => isValidNumber(_d[ChartValueField]) || isTotalTag(_d[ChartValueField]));
    });
  }

  static transformDataE(
    data: StandardData,
    ctx: { chart: EditorChart },
    total: { firstToTotal?: boolean; addLastTotal?: boolean }
  ) {
    array(data).forEach((d: IDataValue) => {
      d.values.forEach((_d, _i) => {
        if (isTotalTag(_d[ChartValueField])) {
          _d[WaterfallTotalTagField] = true;
          _d[ChartTypeField] = WaterfallTotalTagField;
        }
      });
    });
  }

  static transformDataToStack(
    data: StandardData,
    ctx: { chart: EditorChart },
    total: { firstToTotal?: boolean; addLastTotal?: boolean },
    fields: { [key: string]: {} }
  ) {
    WaterfallTemp.transformDataE(data, ctx, total);
    const totalDatums: any[] = [];
    let firstTotalValue = 0;
    let firstDimensionValue;
    const firstToTotal = total.firstToTotal === true; // 默认为
    const addLastTotal = total.addLastTotal !== false;
    array(data).forEach((d, index) => {
      if (firstToTotal && index === 0) {
        firstDimensionValue = d.values[0][ChartDimensionField];
      }
      d.values.forEach((_d, _i) => {
        if (isTotalTag(_d[ChartValueField])) {
          totalDatums.push({ ..._d });
          return;
        }
        if (firstToTotal && _i === 0) {
          firstTotalValue += _d[ChartValueField];
        } else {
          totalDatums.push({
            ..._d,
            [WaterfallRawTypeField]: _d[ChartValueField],
            [WaterfallRawDimensionField]: _d[ChartDimensionField],
            [ChartTypeField]:
              _d[ChartTypeField] +
              FieldLinkString +
              (_d[ChartValueField] >= 0
                ? copyWritings.waterfallPositive[ctx.chart.language]
                : copyWritings.waterfallNegative[ctx.chart.language])
          });
        }
      });
    });
    if (firstToTotal) {
      totalDatums.unshift({
        [WaterfallTotalValueField]: firstTotalValue,
        [ChartDimensionField]: firstDimensionValue,
        [WaterfallTotalTagField]: true,
        [ChartTypeField]: WaterfallTotalTagField
      });
    }
    // 最后的总计
    if (addLastTotal) {
      totalDatums.push({
        [WaterfallTotalTagField]: true,
        [ChartDimensionField]: WaterfallTotalTagField,
        [ChartTypeField]: WaterfallTotalTagField
      });
    }
    return [{ id: 'waterfall', sourceKey: 'total', values: totalDatums, fields }];
  }

  static transformDataToGroup(
    data: StandardData,
    ctx: { chart: EditorChart },
    total: { firstToTotal?: boolean; addLastTotal?: boolean },
    fields: { [key: string]: {} }
  ) {
    WaterfallTemp.transformDataE(data, ctx, total);
    const firstToTotal = total.firstToTotal === true; // 默认为
    const addLastTotal = total.addLastTotal !== false;
    const totalDatums: any[] = [];
    array(data).forEach(d => {
      d.values.forEach((_d, _i) => {
        // e 的总计与组总计保持一致
        if (isTotalTag(_d[ChartValueField])) {
          _d[ChartTypeField] = d.sourceKey + FieldLinkString + WaterfallTotalTagField;
          totalDatums.push({ ..._d });
          return;
        }

        const datum = {
          ..._d,
          [WaterfallRawTypeField]: _d[ChartValueField],
          [WaterfallRawDimensionField]: _d[ChartDimensionField],
          [ChartTypeField]:
            _d[ChartTypeField] +
            FieldLinkString +
            (_d[ChartValueField] >= 0
              ? copyWritings.waterfallPositive[ctx.chart.language]
              : copyWritings.waterfallNegative[ctx.chart.language]),
          [ChartDimensionField]: _d[ChartDimensionField] + FieldLinkString + _d[ChartTypeField]
        };
        if (firstToTotal && _i === 0) {
          // 转化第一条数据为 total
          datum[WaterfallTotalTagField] = true;
          datum[WaterfallTotalValueField] = datum[ChartValueField];
          datum[ChartTypeField] = d.sourceKey + FieldLinkString + WaterfallTotalTagField;
        }
        totalDatums.push(datum);
      });
      // 每一组有一个 total
      if (addLastTotal) {
        totalDatums.push({
          [WaterfallTotalTagField]: true,
          [ChartDimensionField]: WaterfallTotalTagField + FieldLinkString + d.sourceKey,
          [ChartTypeField]: d.sourceKey + FieldLinkString + WaterfallTotalTagField
        });
      }
    });
    return [{ id: 'waterfall', sourceKey: 'total', values: totalDatums }];
  }

  updateSpec(
    rawSpec: ISpec,
    editorSpec: IEditorSpec,
    ctx: { chart: EditorChart },
    updateAttribute?: IUpdateAttributeParam
  ): ISpec {
    super.updateSpec(rawSpec, editorSpec, ctx, updateAttribute);
    return WaterfallTemp.TempUpdateSpec(rawSpec, editorSpec, ctx, updateAttribute);
  }

  static TempUpdateSpec(
    rawSpec: ISpec,
    editorSpec: IEditorSpec,
    ctx: { chart: EditorChart },
    updateAttribute: IUpdateAttributeParam
  ) {
    // 处理瀑布图的总计标签，等 VChart 修正后去除 https://github.com/VisActor/VChart/issues/2166

    if (rawSpec.type === 'waterfall') {
      if ('totalLabel' in rawSpec) {
        (rawSpec as any).stackLabel = {
          ...defaultStackLabelStyle,
          ...rawSpec.stackLabel,
          ...getTotalLabelSpec(rawSpec.totalLabel.visible),
          ...rawSpec.totalLabel,
          position: 'withChange'
        };
        const lastFormat = (rawSpec as any).stackLabel.formatMethod;
        (rawSpec as any).stackLabel.formatMethod = (...args: any[]) =>
          formatStackLabel(rawSpec, editorSpec, lastFormat, ctx.chart.language, ...args);
        delete rawSpec.totalLabel;
      }
    } else if (rawSpec.series?.[0].type === 'waterfall' && rawSpec.series[0].totalLabel) {
      rawSpec.series.forEach(s => {
        (s as any).stackLabel = {
          ...defaultStackLabelStyle,
          // @ts-ignore
          ...s.stackLabel,
          ...getTotalLabelSpec(s.totalLabel.visible),
          visible: true,
          ...s.totalLabel,
          position: 'withChange'
        };
        const lastFormat = (s as any).stackLabel.formatMethod;
        (s as any).stackLabel.formatMethod = (...args: any[]) => {
          return formatStackLabel(rawSpec, editorSpec, lastFormat, ctx.chart.language, ...args);
        };
        delete s.totalLabel;
      });
    }
    WaterfallTemp.transformWithStackType(rawSpec, editorSpec, ctx, updateAttribute);
    return rawSpec;
  }

  static transformWithStackType(
    rawSpec: ISpec,
    editorSpec: IEditorSpec,
    ctx: { chart: EditorChart },
    updateAttribute: IUpdateAttributeParam
  ) {
    if (!rawSpec.series?.length) {
      return;
    }
    if (!editorSpec.modelSpec) {
      return;
    }
    // 瀑布图只有一个系列配置与一组数据
    const series = rawSpec.series[0] as IWaterfallSeriesSpec;
    // 如果没有设置过，设置为默认值
    const editorSeries = editorSpec.modelSpec.find(s => s.id === series.id);
    if (!editorSeries) {
      return;
    }
    if (!editorSeries.spec.stackType) {
      editorSeries.spec.stackType = defaultStackType;
    }
    if (updateAttribute) {
      // 更新时
      const seriesUpdateAttribute = updateAttribute?.modelSpec?.find(m => m.id === 'series-waterfall');
      // 如果没有更新
      if (
        !seriesUpdateAttribute ||
        !(
          'stackType' in seriesUpdateAttribute.spec ||
          'firstToTotal' in seriesUpdateAttribute.spec ||
          'addLastTotal' in seriesUpdateAttribute.spec
        )
      ) {
        return;
      }
    }

    if (editorSeries.spec.stackType === 'group') {
      // 从堆积到平铺
      const data = ctx.chart.specProcess.dataTempTransform.dataParser.getData();
      const info = ctx.chart.specProcess.dataTempTransform.dataParser.getDataInfo();
      WaterfallTemp.filterData(data);
      rawSpec.data = WaterfallTemp.transformDataToGroup(data, ctx, editorSeries.spec, {
        [ChartDimensionField]: {
          ...info[ChartDimensionField],
          domain: [...info[ChartDimensionField].domain, WaterfallTotalTagField],
          sortIndex: 0
        }
      });
    } else if (editorSeries.spec.stackType !== 'group') {
      // 从平铺到堆积
      const data = ctx.chart.specProcess.dataTempTransform.dataParser.getData();
      const info = ctx.chart.specProcess.dataTempTransform.dataParser.getDataInfo();
      WaterfallTemp.filterData(data);
      rawSpec.data = WaterfallTemp.transformDataToStack(data, ctx, editorSeries.spec, {
        [ChartDimensionField]: {
          ...info[ChartDimensionField],
          domain: [...info[ChartDimensionField].domain, WaterfallTotalTagField],
          sortIndex: 0
        }
      });
    }
  }

  checkSpecialValueEnable(v: any) {
    if (super.checkSpecialValueEnable(v)) {
      return true;
    }
    return isTotalTag(v);
  }

  processingVChart(ctx: { chart: EditorChart }) {
    super.processingVChart(ctx);
    // 令图表的总计系列默认使用统一的灰色
    const wfSeries = ctx.chart.vchart
      .getChart()
      .getAllSeries()
      .find(s => s.type === 'waterfall');
    if (!wfSeries) {
      return;
    }
    const mark = wfSeries.getMarkInName('bar');
    const lastProcess = mark.stateStyle.normal?.fill?.postProcess;
    mark.setPostProcess('fill', (result, datum, ...args) => {
      if (datum[ChartTypeField] === WaterfallTotalTagField || datum[ChartTypeField].endsWith(WaterfallTotalTagField)) {
        result = defaultTotalColor;
      }
      // 因为系列配置可能要在这里实现，所以后续系列配置逻辑也要在这里生效，补充逻辑
      return lastProcess ? lastProcess(result, datum, ...args) : result;
    });
  }
}
