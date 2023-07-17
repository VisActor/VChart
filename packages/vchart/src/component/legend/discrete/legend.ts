import { isFunction, isNil, isValidNumber } from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';
import type { IDiscreteLegendSpec, IDiscreteLegendTheme } from './interface';
// eslint-disable-next-line no-duplicate-imports
import type { ISeries } from '../../../series/interface';
import type { IModelInitOption, ILayoutRect } from '../../../model/interface';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { getLegendAttributes } from './util';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { isArray, eachSeries, get, getFieldAlias, isDataDomainSpec } from '../../../util';
// eslint-disable-next-line no-duplicate-imports
import { LegendEvent } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { DiscreteLegend as LegendComponent } from '@visactor/vrender-components';
import type { ILegend } from '../interface';
import { discreteLegendDataMake, discreteLegendFilter } from '../../../data/transforms/legend-data/discrete';
import { BaseLegend } from '../base-legend';
import { ChartEvent } from '../../../constant';

export class DiscreteLegend extends BaseLegend {
  static type = ComponentTypeEnum.discreteLegend;
  type = ComponentTypeEnum.discreteLegend;
  name: string = ComponentTypeEnum.discreteLegend;

  protected declare _spec: IDiscreteLegendSpec;
  protected declare _theme: IDiscreteLegendTheme;

  static createComponent(spec: any, options: IComponentOption) {
    const legendSpec = spec.legends || options.defaultSpec;
    if (!legendSpec) {
      return undefined;
    }
    if (!isArray(legendSpec)) {
      if (!legendSpec.type || legendSpec.type === 'discrete') {
        return new DiscreteLegend(legendSpec, {
          ...options,
          specIndex: 0,
          specKey: 'legends'
        });
      }
      return undefined;
    }
    const legends: ILegend[] = [];
    legendSpec.forEach((s: IDiscreteLegendSpec, i: number) => {
      if (!s.type || s.type === 'discrete') {
        legends.push(new DiscreteLegend(s, { ...options, specIndex: i, specKey: 'legends' }));
      }
    });
    return legends;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    eachSeries(
      this._regions,
      s => {
        s.addViewDataFilter({
          type: 'discreteLegendFilter',
          options: {
            selected: () => this._selectedData,
            field: () => this._getSeriesLegendField(s),
            data: () => this._legendData.getLatestData().map((obj: any) => obj.key)
          }
        });
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
  }

  protected _initLegendData(): DataView {
    registerDataSetInstanceTransform(this._option.dataSet, 'discreteLegendFilter', discreteLegendFilter);
    registerDataSetInstanceTransform(this._option.dataSet, 'discreteLegendDataMake', discreteLegendDataMake);
    const legendData = new DataView(this._option.dataSet);
    legendData.transform({
      type: 'discreteLegendDataMake',
      options: {
        series: () => {
          return this._regions.reduce((pre, r) => {
            pre.push(...r.getSeries());
            return pre;
          }, [] as ISeries[]);
        },
        seriesField: (s: ISeries) => this._getSeriesLegendField(s)
      }
    });

    return legendData;
  }

  protected _getSeriesLegendField(s: ISeries) {
    const defaultField = s.getSeriesField();
    if (!this._spec.scaleName) {
      return defaultField;
    }
    if (!s.getRawData()) {
      return defaultField;
    }
    const scaleSpec = this._option.globalScale.getScaleSpec(this._spec.scaleName);
    if (!scaleSpec) {
      return defaultField;
    }
    if (this._spec.field) {
      return this._spec.field;
    }
    if (!isDataDomainSpec(scaleSpec.domain)) {
      return defaultField;
    }
    const seriesData = scaleSpec.domain.find(d => d.dataId === s.getRawData().name);
    if (!seriesData) {
      return defaultField;
    }
    return seriesData.fields?.[0] ?? defaultField;
  }

  protected _initSelectedData(): void {
    if (this._spec.defaultSelected) {
      this._selectedData = [...this._spec.defaultSelected];
    } else {
      this._selectedData = this._legendData.getLatestData().map((d: any) => d.key);
    }
  }

  private _addDefaultTitleText(attrs: any) {
    if (attrs.title?.visible && isNil(attrs.title.text) && isNil(attrs.title.style?.text)) {
      // 默认使用第0个系列的 seriesField 别名
      const series = this._regions?.[0]?.getSeries()[0];
      if (!series) {
        return;
      }
      // 如果没有别名继续保持 空字符串
      attrs.title.text = getFieldAlias(series.getRawData(), series.getSeriesField());
    }
  }

  protected _getLegendAttributes(rect: ILayoutRect) {
    const layout = this.layoutOrient === 'bottom' || this.layoutOrient === 'top' ? 'horizontal' : 'vertical';
    const attrs = {
      layout,
      items: this._getLegendItems(),
      zIndex: this.layoutZIndex,
      maxWidth: rect.width,
      maxHeight: rect.height,
      ...getLegendAttributes(this._spec, rect)
    };
    this._addDefaultTitleText(attrs);
    return attrs;
  }

  protected _getLegendConstructor() {
    return LegendComponent;
  }

  protected _initEvent() {
    if (this._legendComponent) {
      const doFilter = this._spec.filter !== false;
      this._legendComponent.addEventListener(LegendEvent.legendItemClick, (e: any) => {
        const selectedData = get(e, 'detail.currentSelected');
        doFilter && this.setSelectedData(selectedData);
        this.event.emit(ChartEvent.legendItemClick, { model: this, value: selectedData, event: e });
      });

      this._legendComponent.addEventListener(LegendEvent.legendItemHover, (e: any) => {
        const detail = get(e, 'detail');
        this.event.emit(ChartEvent.legendItemHover, { model: this, value: detail, event: e });
      });

      this._legendComponent.addEventListener(LegendEvent.legendItemUnHover, (e: any) => {
        const detail = get(e, 'detail');
        this.event.emit(ChartEvent.legendItemUnHover, { model: this, value: detail, event: e });
      });
    }
  }

  private _getLegendItems() {
    const originData = (this._legendData.getLatestData() || []).map((datum: any) => {
      const fill = datum.style('fill');
      const stroke = datum.style('stroke');
      const lineWidth = datum.style('lineWidth');
      const symbolType = datum.style('symbolType');
      const fillOpacity = datum.style('fillOpacity');
      const strokeOpacity = datum.style('strokeOpacity');
      const opacity = datum.style('opacity');
      const texture = datum.style('texture');
      const textureColor = datum.style('textureColor');
      const outerBorder = datum.style('outerBorder');
      const innerBorder = datum.style('innerBorder');

      return {
        label: datum.key,
        shape: {
          fill,
          symbolType: symbolType ?? datum.shapeType ?? 'circle',
          stroke: lineWidth === 0 || fill === stroke ? null : stroke,
          fillOpacity: isValidNumber(fillOpacity) ? fillOpacity : 1,
          strokeOpacity: isValidNumber(strokeOpacity) ? strokeOpacity : 1,
          opacity: isValidNumber(opacity) ? opacity : 1,
          texture: texture,
          texturePadding: texture ? 1 : null,
          textureSize: texture ? 4 : null,
          textureColor,
          innerBorder,
          outerBorder
        }
      };
    });
    return isFunction(this._spec.data) ? this._spec.data(originData) : originData;
  }
}
