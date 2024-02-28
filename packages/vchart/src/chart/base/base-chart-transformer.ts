import { array, has, isValid } from '@visactor/vutils';
import type { IChartSpec, IRegionSpec, ISeriesSpec } from '../../typings';
import type { IChartSpecInfo, IChartSpecTransformer, IChartSpecTransformerOption } from '../interface';
import type { IModelConstructor, IModelSpecInfo } from '../../model/interface';
import type { IRegionConstructor } from '../../region/interface';
import { Factory } from '../../core';
import type { ISeriesConstructor } from '../../series';
import type { IComponentConstructor } from '../../component/interface/common';
import { ComponentTypeEnum } from '../../component/interface';
import { setProperty } from '@visactor/vutils-extension';
import { getRelatedRegionInfo, getRelatedSeriesInfo } from './util';

export class BaseChartSpecTransformer<T extends IChartSpec> implements IChartSpecTransformer {
  readonly type: string;
  readonly seriesType: string;

  protected _option: IChartSpecTransformerOption;

  constructor(option: IChartSpecTransformerOption) {
    this._option = option;
    this.type = option.type;
    this.seriesType = option.seriesType;
  }

  /** 此方法不建议重写 */
  initChartSpec(chartSpec: T): IChartSpecInfo {
    this.transformSpec(chartSpec);
    return this.transformModelSpec(chartSpec);
  }

  /**
   * 转换 chart spec。包含以下步骤：
   * - 将图表 spec 统一转换为 common 图表 spec
   * - 图表层级的在初始化阶段的 spec 修改
   */
  transformSpec(chartSpec: T): void {
    if (!chartSpec.region || chartSpec.region.length === 0) {
      chartSpec.region = [{}];
    }
    if (!has(chartSpec, 'tooltip')) {
      chartSpec.tooltip = {};
    }
    if (isValid(chartSpec.stackInverse)) {
      chartSpec.region.forEach(
        (r: IRegionSpec) => !isValid(r.stackInverse) && (r.stackInverse = chartSpec.stackInverse)
      );
    }
  }

  /**
   * 转换 model spec。包含以下步骤：
   * - model 层级的主题合并
   * - model 层级的在初始化阶段的 spec 修改，如添加 label spec
   */
  transformModelSpec(chartSpec: T): IChartSpecInfo {
    const transform = (constructor: IModelConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => {
      const { spec, specPath, specInfoPath, type } = specInfo;
      const transformer = new constructor.transformerConstructor({
        type,
        getTheme: this._option.getTheme
      });
      // 调用 model 自己的 transformer 进行转换
      const transformResult = transformer.transformSpec(spec, chartSpec, chartSpecInfo);
      setProperty(chartSpec, specPath, transformResult.spec);
      setProperty(chartSpecInfo, specInfoPath ?? specPath, {
        ...specInfo,
        ...transformResult
      });
    };
    return this.createSpecInfo(chartSpec, transform);
  }

  /** 遍历图表 spec 中包含的所有的 model，进行 spec 转换并生成图表 spec info */
  createSpecInfo(
    chartSpec: T,
    transform?: (
      /** 当前 model 的类 */
      constructor: IModelConstructor,
      /** 当前 model 的 spec info */
      specInfo: IModelSpecInfo,
      /** 图表 spec info */
      chartSpecInfo?: IChartSpecInfo
    ) => void
  ): IChartSpecInfo {
    if (!transform) {
      transform = (constructor: IModelConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => {
        const { spec, specPath, specInfoPath, type } = specInfo;
        const transformer = new constructor.transformerConstructor({
          type,
          getTheme: this._option.getTheme
        });
        setProperty(chartSpecInfo, specInfoPath ?? specPath, {
          ...specInfo,
          theme: transformer.getTheme(spec, chartSpec)
        });
      };
    }

    const currentChartSpecInfo: IChartSpecInfo = {};

    // 预处理 region
    this.forEachRegionInSpec(chartSpec, transform, currentChartSpecInfo);
    // 预处理 series
    this.forEachSeriesInSpec(chartSpec, transform, currentChartSpecInfo);
    // 记录每个 series 关联的 region
    currentChartSpecInfo.series?.forEach((seriesSpecInfo, i) => {
      const relatedRegion =
        getRelatedRegionInfo(seriesSpecInfo, currentChartSpecInfo) ?? currentChartSpecInfo.region ?? [];
      const region = relatedRegion[0];
      if (region) {
        if (!region.seriesIndexes) {
          region.seriesIndexes = [];
        }
        region.seriesIndexes.push(i);
        seriesSpecInfo.regionIndexes = region.regionIndexes.slice();
      }
    });
    // 预处理 component
    this.forEachComponentInSpec(chartSpec, transform, currentChartSpecInfo);
    // 记录每个 component 关联的 region、series
    Object.values(currentChartSpecInfo.component ?? {}).forEach(specInfoList =>
      specInfoList.forEach((componentSpecInfo, i) => {
        if (!componentSpecInfo) {
          return;
        }
        if (!componentSpecInfo.regionIndexes) {
          const relatedRegion =
            getRelatedRegionInfo(componentSpecInfo, currentChartSpecInfo) ?? currentChartSpecInfo.region ?? [];
          componentSpecInfo.regionIndexes = relatedRegion.map(region => region.regionIndexes[0]);
        }
        if (!componentSpecInfo.seriesIndexes) {
          const seriesInfo = getRelatedSeriesInfo(componentSpecInfo, currentChartSpecInfo);
          if (!seriesInfo) {
            const seriesIndexSet = new Set<number>();
            (componentSpecInfo.regionIndexes ?? []).forEach(regionIndex => {
              const region = currentChartSpecInfo.region?.[regionIndex];
              region?.seriesIndexes?.forEach(seriesIndex => seriesIndexSet.add(seriesIndex));
            });
            componentSpecInfo.seriesIndexes = Array.from(seriesIndexSet);
          } else {
            componentSpecInfo.seriesIndexes = seriesInfo.map(({ seriesIndexes }) => seriesIndexes[0]);
          }
        }
      })
    );
    return currentChartSpecInfo;
  }

  protected _isValidSeries(seriesType: string): boolean {
    return true;
  }

  protected _getDefaultSeriesSpec(chartSpec: any) {
    const series: any = {
      dataKey: chartSpec.dataKey,

      hover: chartSpec.hover,
      select: chartSpec.select,

      label: chartSpec.label,

      seriesStyle: chartSpec.seriesStyle,

      animation: chartSpec.animation ?? this._option.animation,
      animationThreshold: chartSpec.animationThreshold ?? this._option.getTheme?.().animationThreshold,
      animationAppear: chartSpec.animationAppear,
      animationDisappear: chartSpec.animationDisappear,
      animationEnter: chartSpec.animationEnter,
      animationUpdate: chartSpec.animationUpdate,
      animationExit: chartSpec.animationExit,
      animationNormal: chartSpec.animationNormal,

      extensionMark: chartSpec.extensionMark,

      large: chartSpec.large,
      largeThreshold: chartSpec.largeThreshold,
      progressiveStep: chartSpec.progressiveStep,
      progressiveThreshold: chartSpec.progressiveThreshold,
      background: chartSpec.seriesBackground,

      invalidType: chartSpec.invalidType,

      seriesField: chartSpec.seriesField,

      morph: chartSpec.morph,

      interactions: chartSpec.interactions
    };
    return series;
  }

  /** 遍历 spec 中每个有效的 region */
  forEachRegionInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: IRegionConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ): K[] {
    const regionSpec = (chartSpec.region as IRegionSpec[]) ?? [];
    return regionSpec.map((spec, index) =>
      callbackfn(
        Factory.getRegionInType('region'),
        {
          spec,
          specPath: ['region', index],
          type: 'region',
          regionIndexes: [index]
        },
        chartSpecInfo
      )
    );
  }

  /** 遍历 spec 中每个有效的 series */
  forEachSeriesInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: ISeriesConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ): K[] {
    const seriesSpec = (chartSpec.series as ISeriesSpec[]) ?? [];
    return seriesSpec.map((spec, index) =>
      callbackfn(
        Factory.getSeriesInType(spec.type),
        {
          spec,
          specPath: ['series', index],
          type: spec.type,
          seriesIndexes: [index]
        },
        chartSpecInfo
      )
    );
  }

  /** 遍历 spec 中每个有效的 component */
  forEachComponentInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: IComponentConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K,
    chartSpecInfo?: IChartSpecInfo
  ): K[] {
    const results: K[] = [];
    const components = Factory.getComponents();

    // 坐标轴组件只需要调用一次
    let cartesianAxis: IComponentConstructor;
    let polarAxis: IComponentConstructor;
    let geoCoordinate: IComponentConstructor;
    let label: IComponentConstructor;
    let totalLabel: IComponentConstructor;
    const noAxisComponents = [];
    for (let index = 0; index < components.length; index++) {
      const { cmp, alwaysCheck } = components[index];
      if (cmp.type.startsWith(ComponentTypeEnum.cartesianAxis)) {
        cartesianAxis = cmp;
      } else if (cmp.type.startsWith(ComponentTypeEnum.polarAxis)) {
        polarAxis = cmp;
      } else if (cmp.type === ComponentTypeEnum.geoCoordinate) {
        geoCoordinate = cmp;
      } else if (alwaysCheck || chartSpec[cmp.specKey ?? cmp.type]) {
        if (cmp.type === ComponentTypeEnum.label) {
          label = cmp;
        } else if (cmp.type === ComponentTypeEnum.totalLabel) {
          totalLabel = cmp;
        } else {
          noAxisComponents.push(cmp);
        }
      }
    }

    let hasInitAxis = false;
    // NOTE: 坐标轴组件需要在其他组件之前创建
    if (cartesianAxis) {
      const infoList = cartesianAxis.getSpecInfo(chartSpec, chartSpecInfo);
      if (infoList?.length > 0) {
        hasInitAxis = true;
        infoList.forEach(info => {
          const cmp = Factory.getComponentInKey(info.type);
          results.push(callbackfn(cmp, info, chartSpecInfo));
        });
      }
    }

    if (polarAxis && !hasInitAxis) {
      const infoList = polarAxis.getSpecInfo(chartSpec, chartSpecInfo);
      if (infoList?.length > 0) {
        hasInitAxis = true;
        infoList.forEach(info => {
          const cmp = Factory.getComponentInKey(info.type);
          results.push(callbackfn(cmp, info, chartSpecInfo));
        });
      }
    }

    if (geoCoordinate && !hasInitAxis) {
      geoCoordinate.getSpecInfo(chartSpec, chartSpecInfo)?.forEach(info => {
        results.push(callbackfn(geoCoordinate, info, chartSpecInfo));
      });
    }

    if (label && chartSpecInfo) {
      label.getSpecInfo(chartSpec, chartSpecInfo)?.forEach(info => {
        results.push(callbackfn(label, info, chartSpecInfo));
      });
    }
    if (totalLabel && chartSpecInfo) {
      totalLabel.getSpecInfo(chartSpec, chartSpecInfo)?.forEach(info => {
        results.push(callbackfn(totalLabel, info, chartSpecInfo));
      });
    }

    noAxisComponents.forEach(C => {
      C.getSpecInfo(chartSpec, chartSpecInfo)?.forEach(info => {
        results.push(callbackfn(C, info, chartSpecInfo));
      });
    });

    return results;
  }

  /** 处理series配置 */
  transformSeriesSpec(spec: T): void {
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach(s => {
        if (!this._isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
  }
}
