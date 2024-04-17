import type { ISpec } from '../../../../libs/vchart/type';
import type { DataInfo, StandardData } from '../../data/interface';
import type { IChartTemp } from '../interface';
import type { IEditorSpec } from '../../spec-process/interface';
import type { IUpdateAttributeParam } from '../../../../core/interface';
import { findChartSpec, mergeSpec } from '../../utils/spec';
import { array, get, isArray, isObject, isValid } from '@visactor/vutils';
import type { EditorChart } from '../../chart';
import { processFormatConfig } from '../../utils/formatter';
import { MARKER_NOT_SUPPORT_TEMPLATE_OR_CHART, totalLabelChartList } from '../../../constant';
import { getSeriesLabelConfig } from '../../../../component/vchart-plugin/series-label/util';
import { barLinkAeolusChartList, seriesLabelAeolusChartList, seriesLabelChartList } from '../constant';
import { getBarLinkLineConfig } from '../../../../component/vchart-plugin/bar-link-line/util';
import { getSeriesKeyScalesMap, matchDatumWithScaleMap } from '../../utils/data';

export const EDITOR_SERIES_MARK_SINGLE = '_editor_series_mark_single';
export const EDITOR_SERIES_MARK_SINGLE_LEVEL = 100;

export abstract class BaseTemp implements IChartTemp {
  type: string;
  abstract getSpec(data: StandardData, info: DataInfo, ctx: { chart: EditorChart }, opt?: any): any;
  abstract checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean;
  clear() {
    // do nothing
  }

  getChartType() {
    return this.type;
  }

  /**
   * 使用编辑配置更新 vchart-spec ，会修改传入的原始图表配置
   * @param rawSpec 待更新的原始图表配置
   * @param editorSpec 编辑配置
   * @param ctx 图表上下文
   * @param updateAttribute 当前更新信息，如果没有更新信息的话，认为全量更新
   * @returns 返回更新后的图表配置
   */
  updateSpec(
    rawSpec: ISpec,
    editorSpec: IEditorSpec,
    ctx: { chart: EditorChart },
    updateAttribute?: IUpdateAttributeParam
  ) {
    // transform spec 的过程
    // 色板 考虑模版可能有配置 color 。还是放到 spec 的 color 中处理
    if ((!updateAttribute || updateAttribute.color) && editorSpec.color) {
      if (isArray(rawSpec.color) || !isObject(rawSpec.color)) {
        rawSpec.color = editorSpec.color;
      } else {
        rawSpec.color.range = editorSpec.color;
        // delete custom color from aeolus config
        if (rawSpec.color.specified) {
          delete rawSpec.color.specified;
        }
      }
    }
    // 模块样式
    if ((!updateAttribute || updateAttribute.modelSpec) && editorSpec.modelSpec) {
      editorSpec.modelSpec.forEach(s => {
        const chartSpec = findChartSpec(s, rawSpec);
        if (!chartSpec) {
          // 部分封装 chart series 配置会直接放到chart 上
          if (s.specKey === 'series' && s.specIndex === 0) {
            mergeSpec(rawSpec, s.spec);
          }
          return;
        }
        mergeSpec(chartSpec, s.spec);
      });
    }

    if (editorSpec.marker) {
      Object.keys(editorSpec.marker).forEach(key => {
        if (rawSpec[key]) {
          rawSpec[key] = rawSpec[key].filter(s => !s.name);
        } else {
          rawSpec[key] = [];
        }
        editorSpec.marker[key] && rawSpec[key].push(...editorSpec.marker[key]);
      });
    }

    const chartType = ctx.chart.specProcess.dataTempTransform.specTemp.type;
    const aeolusChartType = (ctx.chart.specProcess.dataTempTransform.specTemp as any)?._data?.chartType;
    // process formatConfig
    const traverseSpec = (spec: any, modelSpec?: any, specPath?: string[]) => {
      const specKeys = Object.keys(spec);
      if (specKeys.includes('formatConfig')) {
        processFormatConfig(ctx.chart, spec, modelSpec, specPath, chartType, aeolusChartType);
      }
      const currentModel = isValid(spec.name) || isValid(spec.id) ? spec : modelSpec;
      specKeys.forEach(specKey => {
        const currentSpecPath = (specPath ?? []).concat(specKey);
        if (specKey === 'data' || !isObject(spec[specKey])) {
          return;
        }
        traverseSpec(spec[specKey], currentModel, currentSpecPath);
      });
    };

    traverseSpec(rawSpec);

    // 从 chart 中发现的 spec 二次编辑
    // 标签布局策略
    // @ts-ignore
    rawSpec.labelLayout = 'region';

    // 如果当前图表不支持标注，则将标注删除
    const currentTemp = this.getChartType();
    if (
      MARKER_NOT_SUPPORT_TEMPLATE_OR_CHART.includes(currentTemp) ||
      MARKER_NOT_SUPPORT_TEMPLATE_OR_CHART.includes(rawSpec.type)
    ) {
      // @ts-ignore
      rawSpec.markArea = [];
      // @ts-ignore
      rawSpec.markLine = [];
    }

    // 如果当前图表不支持总计标签，则将总计标签删除
    if (!totalLabelChartList.includes(chartType) && !totalLabelChartList.includes(aeolusChartType)) {
      // @ts-ignore
      delete rawSpec.totalLabel;

      rawSpec.series &&
        rawSpec.series.length &&
        rawSpec.series.forEach(s => {
          delete s.totalLabel;
        });
    }

    if (
      seriesLabelChartList.includes(chartType) ||
      (aeolusChartType && seriesLabelAeolusChartList.includes(aeolusChartType))
    ) {
      // 处理系列标签
      (rawSpec as any).customMark = array((rawSpec as any).customMark).filter(
        (obj: any) => obj.componentType !== 'seriesLabel'
      );
      const seriesLabel = get(rawSpec, 'seriesLabel') ?? get(rawSpec.series?.[0], 'seriesLabel') ?? {};
      if (seriesLabel.visible) {
        const { position = 'end', ...rest } = seriesLabel;
        if (position === 'both-ends') {
          // 两端都展示
          (rawSpec as any).customMark.push(getSeriesLabelConfig('start', rest, ctx));
          (rawSpec as any).customMark.push(getSeriesLabelConfig('end', rest, ctx));
        } else {
          (rawSpec as any).customMark.push(getSeriesLabelConfig(position, rest, ctx));
        }
      }
    }

    // 处理风神图表的 barLink
    if (
      (editorSpec.temp === 'aeolus' && barLinkAeolusChartList.includes(editorSpec.data.value.chartType)) ||
      ['bar', 'barPercent', 'horizontalBar', 'horizontalBarPercent'].includes(editorSpec.temp)
    ) {
      // 判断 editorSpec 中是否有 barLink，有则添加 customMark
      (rawSpec as any).customMark = array((rawSpec as any).customMark).filter(
        (obj: any) => obj.componentType !== 'bar-link'
      );
      if (editorSpec.barLink?.enable) {
        // 处理系列标签
        (rawSpec as any).customMark.push(getBarLinkLineConfig(editorSpec.barLink.spec));
      }
    }

    // 开启 label 的拾取，主要是为了支持预览态的评论高亮，以及编辑态下的就地编辑
    if ((rawSpec as any).label) {
      (rawSpec as any).label.interactive = true;
    }
    if ((rawSpec as any).totalLabel) {
      (rawSpec as any).totalLabel.interactive = true;
    }

    rawSpec.series?.forEach((s: any) => {
      if (s.label) {
        s.label.interactive = true;
      }
      if (s.totalLabel) {
        s.totalLabel.interactive = true;
      }
    });

    // 在图表编辑模式下，需要开启 label 和 totalLabel 以及轴 grid 的事件拾取
    if (ctx.chart.mode === 'editor') {
      // 调整 grid 的交互层级高于 axis
      rawSpec.axes?.forEach((axis: any) => {
        if (!axis.grid) {
          axis.grid = {};
        }
        // axis.grid.zIndex = (axis.zIndex ?? 100) + 10;

        // 扩大 grid 的拾取范围
        axis.grid.style = {
          ...axis.grid.style,
          pickStrokeBuffer: 2
        };
      });
    }

    return rawSpec;
  }

  /**
   * updateSpec 之后，处理一些特殊 spec 逻辑，属于后处理，当前spec已经更新完成。
   * @param rawSpec 原图表配置
   * @param editorSpec 编辑配置
   * @param ctx 图表上下文
   * @returns 返回更新后的图表配置
   */
  transformSpec(rawSpec: ISpec, editorSpec: IEditorSpec, ctx: { chart: EditorChart }) {
    let regionClip = false;
    if (rawSpec.region) {
      rawSpec.region.forEach(r => {
        if (r.clip) {
          regionClip = true;
        }
      });
    }
    if (regionClip) {
      // @ts-ignore
      if (rawSpec.totalLabel) {
        // @ts-ignore
        rawSpec.totalLabel.clampForce = true;
        // @ts-ignore
        rawSpec.totalLabel.overlap = true;
      }
      if (rawSpec.series) {
        rawSpec.series.forEach(s => {
          if (s.totalLabel) {
            // @ts-ignore
            s.totalLabel.clampForce = true;
            // @ts-ignore
            s.totalLabel.overlap = true;
          }
          // 瀑布图堆积标签没有防重叠
        });
      }
    }

    return rawSpec;
  }

  checkSpecialValueEnable(v: any) {
    // 除了数字外的其他内容都不支持
    return false;
  }

  processingVChart(ctx: { chart: EditorChart }) {
    this._setSingleMarkStyle(ctx);
  }

  private _setSingleMarkStyle(ctx: { chart: EditorChart }) {
    if (!ctx.chart.specProcess.getEditorSpec().markStyle) {
      return;
    }
    ctx.chart.specProcess.getEditorSpec().markStyle.forEach(i => {
      const chart = ctx.chart.vchart.getChart();
      const series = chart.getSeriesInIndex([i.seriesIndex])[0];
      if (!series) {
        return;
      }
      const mark = series.getMarkInName(i.markName);
      if (!mark) {
        return;
      }
      const keyScaleMap = getSeriesKeyScalesMap(series);
      const stateKey = EDITOR_SERIES_MARK_SINGLE + i.id;
      mark.setStyle(
        {
          ...i.style
        },
        stateKey,
        EDITOR_SERIES_MARK_SINGLE_LEVEL
      );
      chart.updateState({
        [stateKey]: {
          filter: (datum: any) => matchDatumWithScaleMap(i.itemKeys, i.itemKeyMap, keyScaleMap, datum),
          level: 10
        }
      });
    });
  }
}
