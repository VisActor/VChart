import { IElementChartSpec } from './../../../dsl-interface';
import { ISpec } from '@visactor/vchart';
import { IChartTemp } from '../interface';
import { DataInfo, StandardData } from '../../data/interface';
import { ElementChart } from '../../../chart/element';
import { isArray, isObject, isValid } from '@visactor/vutils';
import { findChartSpec, mergeSpec } from '../../../../utils/chart';

export const EDITOR_SERIES_MARK_SINGLE = '_editor_series_mark_single';
export const EDITOR_SERIES_MARK_SINGLE_LEVEL = 100;

export abstract class BaseTemp implements IChartTemp {
  type: string;
  abstract getSpec(data: StandardData, info: DataInfo, ctx: { chart: ElementChart }, opt?: any): any;
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
  updateSpec(rawSpec: ISpec, config: IElementChartSpec['config'], ctx: { chart: ElementChart }) {
    // transform spec 的过程
    // 色板 考虑模版可能有配置 color 。还是放到 spec 的 color 中处理
    if (config.attribute.color) {
      if (isArray(rawSpec.color) || !isObject(rawSpec.color)) {
        rawSpec.color = config.attribute.color;
      } else {
        rawSpec.color.range = config.attribute.color;
        // delete custom color from aeolus config
        if (rawSpec.color.specified) {
          delete rawSpec.color.specified;
        }
      }
    }
    // 模块样式
    if (config.attribute.moduleSpec) {
      config.attribute.moduleSpec.forEach(s => {
        const chartSpec = findChartSpec(s, rawSpec);
        mergeSpec(chartSpec, s.spec);
      });
    }

    if (config.attribute.marker) {
      Object.keys(config.attribute.marker).forEach(key => {
        if (rawSpec[key]) {
          rawSpec[key] = rawSpec[key].filter(s => !s.name);
        } else {
          rawSpec[key] = [];
        }
        config.attribute.marker[key] && rawSpec[key].push(...config.attribute.marker[key]);
      });
    }

    // process formatConfig
    const traverseSpec = (spec: any, moduleSpec?: any, specPath?: string[]) => {
      const specKeys = Object.keys(spec);
      const currentModel = isValid(spec.name) || isValid(spec.id) ? spec : moduleSpec;
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

    return rawSpec;
  }

  /**
   * updateSpec 之后，处理一些特殊 spec 逻辑，属于后处理，当前spec已经更新完成。
   * @param rawSpec 原图表配置
   * @param editorSpec 编辑配置
   * @param ctx 图表上下文
   * @returns 返回更新后的图表配置
   */
  transformSpec(rawSpec: ISpec, editorSpec: IElementChartSpec['config'], ctx: { chart: ElementChart }) {
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

  processingVChart(ctx: { chart: ElementChart }) {}
}
