import { has, isValid } from '@visactor/vutils';
import type { IChartSpec, IRegionSpec, ISeriesSpec } from '../../typings';
import type { IChartSpecInfo, IChartSpecTransformer, IChartSpecTransformerOption } from '../interface';
import type { IModelConstructor, IModelSpecInfo } from '../../model/interface';
import type { IRegionConstructor } from '../../region/interface';
import { Factory } from '../../core';
import type { ISeriesConstructor } from '../../series';
import type { IComponentConstructor } from '../../component/interface/common';
import { ComponentTypeEnum } from '../../component/interface';
import { setProperty } from '@visactor/vutils-extension';

export class BaseChartSpecTransformer<T extends IChartSpec> implements IChartSpecTransformer {
  readonly type: string;
  readonly seriesType: string;

  protected _option: IChartSpecTransformerOption;

  protected get _layoutRect() {
    return this._option.getLayoutRect?.();
  }

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

  /** 将图表 spec 统一转换为 common chart spec */
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

  /** 转换 model spec，应用主题 */
  transformModelSpec(chartSpec: T): IChartSpecInfo {
    const chartSpecInfo: IChartSpecInfo = {};
    // 预处理 model spec
    for (const forEachModelInSpec of [
      this.forEachRegionInSpec.bind(this),
      this.forEachSeriesInSpec.bind(this),
      this.forEachComponentInSpec.bind(this)
    ]) {
      forEachModelInSpec(chartSpec, (constructor: IModelConstructor, specInfo: IModelSpecInfo) => {
        const { spec, specPath, type } = specInfo;
        const transformer = new constructor.transformerConstructor({
          type,
          getTheme: this._option.getTheme
        });
        const { spec: newSpec, theme } = transformer.transformSpec(spec, chartSpec);
        setProperty(chartSpec, specPath, newSpec);
        setProperty(chartSpecInfo, specPath, {
          ...specInfo,
          spec: newSpec,
          theme
        });
      });
    }
    return chartSpecInfo;
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

      animation: chartSpec.animation,
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

      morph: chartSpec.morph
    };
    return series;
  }

  /** 枚举 spec 中每个有效的 region */
  forEachRegionInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: IRegionConstructor, specInfo: IModelSpecInfo) => K
  ): K[] {
    const regionSpec = (chartSpec.region as IRegionSpec[]) ?? [];
    return regionSpec.map((spec, index) =>
      callbackfn(Factory.getRegionInType('region'), {
        spec,
        specIndex: index,
        specPath: ['region', index],
        type: 'region'
      })
    );
  }

  /** 枚举 spec 中每个有效的 series */
  forEachSeriesInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: ISeriesConstructor, specInfo: IModelSpecInfo) => K
  ): K[] {
    const seriesSpec = (chartSpec.series as ISeriesSpec[]) ?? [];
    return seriesSpec.map((spec, index) =>
      callbackfn(Factory.getSeriesInType(spec.type), {
        spec,
        specIndex: index,
        specPath: ['series', index],
        type: spec.type
      })
    );
  }

  /** 枚举 spec 中每个有效的 component */
  forEachComponentInSpec<K>(
    chartSpec: T,
    callbackfn: (constructor: IComponentConstructor, specInfo: IModelSpecInfo) => K
  ): K[] {
    const results: K[] = [];
    const components = Factory.getComponents();

    // 坐标轴组件只需要调用一次
    let cartesianAxis: IComponentConstructor;
    let polarAxis: IComponentConstructor;
    let geoCoordinate: IComponentConstructor;
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
        noAxisComponents.push(cmp);
      }
    }

    let hasInitAxis = false;
    // NOTE: 坐标轴组件需要在其他组件之前创建
    if (cartesianAxis) {
      const infoList = cartesianAxis.getSpecInfo(chartSpec);
      if (infoList?.length > 0) {
        hasInitAxis = true;
        infoList.forEach(info => {
          results.push(callbackfn(cartesianAxis, info));
        });
      }
    }

    if (polarAxis && !hasInitAxis) {
      const infoList = polarAxis.getSpecInfo(chartSpec);
      if (infoList?.length > 0) {
        hasInitAxis = true;
        infoList.forEach(info => {
          results.push(callbackfn(polarAxis, info));
        });
      }
    }

    if (geoCoordinate && !hasInitAxis) {
      geoCoordinate.getSpecInfo(chartSpec)?.forEach(info => {
        results.push(callbackfn(geoCoordinate, info));
      });
    }

    noAxisComponents.forEach(C => {
      C.getSpecInfo(chartSpec)?.forEach(info => {
        results.push(callbackfn(C, info));
      });
    });

    return results;
  }
}
