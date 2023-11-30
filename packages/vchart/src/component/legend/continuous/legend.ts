/**
 * @description color legend component
 */
import { debounce, isEmpty, isNil, isArray, get } from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import type { ISeries } from '../../../series/interface';
import type { IModelInitOption } from '../../../model/interface';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
// eslint-disable-next-line no-duplicate-imports
import { registerDataSetInstanceTransform } from '../../../data/register';
import { eachSeries } from '../../../util/model';
import { getFieldAlias } from '../../../util/data';
import { isDataDomainSpec } from '../../../util/type';
// eslint-disable-next-line no-duplicate-imports
import type { ILegend } from '../interface';
import type { IColorLegendSpec, IColorLegendTheme, ISizeLegendSpec } from './interface';
import {
  continuousLegendDataMake,
  continuousLegendFilter
} from '../../../data/transforms/legend-data/continuous/continuous';
import { ContinuousLegendMap, getContinuousLegendAttributes, isContinuousLegend } from './util';
import { BaseLegend } from '../base-legend';
import { ChartEvent } from '../../../constant';
import { Factory } from '../../../core/factory';
import { TransformLevel } from '../../../data/initialize';
import type { ILayoutRect } from '../../../typings/layout';

const SINGLE_SEQUENCE = ['#C4E7FF', '#98CAFF', '#75ACFF', '#518FF9', '#2775DC', '#005CBE', '#00429F', '#00287E'];
const SIZE = [2, 10];

export class ContinuousLegend<
  T extends IColorLegendSpec | ISizeLegendSpec = IColorLegendSpec | ISizeLegendSpec
> extends BaseLegend<T> {
  static specKey = 'legends';
  specKey: string = 'legends';
  static type = ComponentTypeEnum.continuousLegend;
  type = ComponentTypeEnum.colorLegend;
  name: string = ComponentTypeEnum.colorLegend;

  protected declare _theme: IColorLegendTheme; // TODO: 看下是否需要区分

  private _field: string | undefined;
  private _legendType: string;

  static createComponent(spec: any, options: IComponentOption) {
    const legendSpec = spec.legends;
    if (!legendSpec) {
      return undefined;
    }
    if (!isArray(legendSpec)) {
      if (isContinuousLegend(legendSpec.type)) {
        return new ContinuousLegend(legendSpec, {
          ...options,
          specIndex: 0
        });
      }

      return undefined;
    }
    const legends: ILegend[] = [];
    legendSpec.forEach((s: IColorLegendSpec | ISizeLegendSpec, i: number) => {
      if (isContinuousLegend(s.type)) {
        legends.push(new ContinuousLegend(s, { ...options, specIndex: i }));
      }
    });
    return legends;
  }

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);

    // 这里需要区分下是 colorLegend 还是 sizeLegend
    const legendName = this._spec.type === 'color' ? ComponentTypeEnum.colorLegend : ComponentTypeEnum.sizeLegend;
    this.type = legendName;
    this.name = legendName;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._field = this._spec.field;
    this._legendType = this._spec.type;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    eachSeries(
      this._regions,
      s => {
        s.addViewDataFilter({
          type: 'continuousLegendFilter',
          options: {
            selected: () => this._selectedData,
            field: () => this._field,
            data: () => this._legendData.getLatestData()
          },
          level: TransformLevel.legendFilter
        });
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
  }

  private _getScaleInGlobal() {
    const globalScale = this._option.globalScale;
    let scaleKey = this._spec.scale;
    if (!scaleKey) {
      scaleKey = this._legendType;
    }
    return globalScale.getScale(scaleKey);
  }

  protected _initLegendData(): DataView {
    registerDataSetInstanceTransform(this._option.dataSet, 'continuousLegendFilter', continuousLegendFilter);
    registerDataSetInstanceTransform(this._option.dataSet, 'continuousLegendDataMake', continuousLegendDataMake);
    const legendData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_data` });
    legendData.transform({
      type: 'continuousLegendDataMake',
      options: {
        series: () => {
          return this._regions.reduce((pre, r) => {
            pre.push(...r.getSeries());
            return pre;
          }, [] as ISeries[]);
        },
        field: () => this._field,
        scale: this._getScaleInGlobal.bind(this)
      }
    });
    return legendData;
  }

  protected _initSelectedData(): void {
    if (this._spec.defaultSelected) {
      this._selectedData = [...this._spec.defaultSelected];
    } else {
      this._selectedData = this._legendData.getLatestData();
    }
  }

  private _addDefaultTitleText(attrs: any) {
    if (attrs.title?.visible && isNil(attrs.title.text) && isNil(attrs.title.style?.text)) {
      const field = this._field;
      if (field) {
        // 默认使用第0个系列的对应别名
        const series = this._regions?.[0]?.getSeries()[0];
        if (!series) {
          return;
        }
        // 如果没有别名继续保持 空字符串
        attrs.title.text = getFieldAlias(series.getRawData(), field);
        return;
      }
      let scaleKey = this._spec.scale;
      if (!scaleKey) {
        scaleKey = this._legendType;
      }
      const scaleSpec = this._option.globalScale.getScaleSpec(scaleKey);
      if (!isDataDomainSpec(scaleSpec?.domain)) {
        return;
      }
      const dataInfo = scaleSpec.domain[0];
      if (dataInfo.fields.length === 0) {
        return;
      }
      // 如果没有别名继续保持 空字符串
      attrs.title.text = getFieldAlias(this._option.dataSet.getDataView(dataInfo.dataId), dataInfo.fields[0]);
      return;
    }
  }

  protected _getLegendAttributes(rect: ILayoutRect) {
    const layout = this.layoutOrient === 'bottom' || this.layoutOrient === 'top' ? 'horizontal' : 'vertical';
    const align = layout === 'horizontal' ? 'bottom' : this.layoutOrient;

    // 获取关联的 scale 以获取 colors / size
    let visualMappingRange = [];
    const scale = this._getScaleInGlobal();
    if (scale && scale.type === 'linear') {
      visualMappingRange = scale.range();
    }
    if (isEmpty(visualMappingRange)) {
      visualMappingRange = this._legendType === 'color' ? SINGLE_SEQUENCE : SIZE;
    }
    let min = this._legendData.getLatestData()[0] ?? 0;
    let max = this._legendData.getLatestData()[1] ?? 1;

    const isSame = this._legendData.getLatestData()[0] === this._legendData.getLatestData()[1];
    if (isSame) {
      min = Math.min(0, this._legendData.getLatestData()[0]);
      max = this._legendData.getLatestData()[0] === 0 ? 1 : Math.max(0, this._legendData.getLatestData()[0]);
    }

    const attrs: any = {
      layout,
      align,
      zIndex: this.layoutZIndex,
      min,
      max,
      value: this._spec.defaultSelected,
      [this._legendType === 'color' ? 'colors' : 'sizeRange']: visualMappingRange,
      ...getContinuousLegendAttributes(this._spec)
    };
    this._addDefaultTitleText(attrs);
    return attrs;
  }

  protected _getLegendConstructor() {
    return ContinuousLegendMap[this._legendType];
  }

  protected _initEvent() {
    if (this._legendComponent) {
      const doFilter = this._spec.filter !== false;
      this._legendComponent.addEventListener(
        'change',
        debounce((e: any) => {
          const selectedData = get(e, 'detail.value');
          if (doFilter) {
            this.setSelectedData(selectedData);
          }
          this.event.emit(ChartEvent.legendFilter, { model: this, value: selectedData, event: e });
        }, 30)
      );
    }
  }
}

export const registerContinuousLegend = () => {
  Factory.registerComponent(ContinuousLegend.type, ContinuousLegend);
};
