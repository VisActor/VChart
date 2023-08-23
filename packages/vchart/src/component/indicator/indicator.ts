import { DataView } from '@visactor/vdataset';
import type { IComponentOption } from '../interface';
import { LayoutLevel, LayoutZIndex } from '../../constant';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { LayoutItem } from '../../model/layout-item';
import { BaseComponent } from '../base';
import type { IRegion } from '../../region/interface';
import type { IIndicator, IIndicatorItemSpec, IIndicatorTheme } from './interface';
import type { Maybe } from '../../typings';
import { isValid, isFunction, array, merge, eachSeries } from '../../util';
import { isEqual } from '@visactor/vutils';
import { indicatorMapper } from './util';
import type { IModel } from '../../model/interface';
import { registerDataSetInstanceTransform } from '../../data/register';
import { CompilableData } from '../../compile/data';
import { Indicator as IndicatorComponents } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { IndicatorAttributes } from '@visactor/vrender-components';
import type { IGraphic, INode } from '@visactor/vrender';
import { transformToGraphic } from '../../util/style';
import type { IVisualScale, IVisualSpecStyle, VisualType, FunctionType } from '../../typings/visual';

export class Indicator extends BaseComponent implements IIndicator {
  static speckey = 'indicator';
  static type = ComponentTypeEnum.indicator;
  type = ComponentTypeEnum.indicator;
  name: string = ComponentTypeEnum.indicator;

  layoutType: LayoutItem['layoutType'] = 'absolute';
  layoutZIndex: number = LayoutZIndex.Indicator;
  layoutLevel: number = LayoutLevel.Indicator;

  private _gap: number = 0;

  private _activeDatum: any = null;
  private _displayData!: CompilableData;

  private _title: IIndicatorItemSpec;
  private _content: IIndicatorItemSpec[];

  private _indicatorComponent: IndicatorComponents;
  private _cacheAttrs: IndicatorAttributes;

  protected declare _theme: Maybe<IIndicatorTheme>;

  static createComponent(spec: any, options: IComponentOption) {
    if (this.type !== Indicator.type) {
      return null;
    }
    const indicatorSpec = spec.indicator || options.defaultSpec;
    const indicators: IIndicator[] = array(indicatorSpec)
      .filter(s => s && s.visible !== false)
      .map((s, index) => new Indicator(s, { ...options, specIndex: index, specKey: Indicator.speckey }));
    return indicators;
  }

  created() {
    super.created();
    // data
    this.initData();
    // event
    this.initEvent();
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._gap = this._spec.gap || 0;
    this._title = this._spec.title;
    this._content = this._spec.content;
    this._regions = this._option.getRegionsInUserIdOrIndex(array(this._spec.regionId), array(this._spec.regionIndex));
  }

  onRender(ctx: any): void {
    // do nothing
  }

  // region
  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  // event
  protected initEvent() {
    const trigger = this._spec.trigger;
    if (trigger === 'none') {
      return;
    }

    if (this._spec.trigger === 'hover') {
      this.event.on('hovered', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(params.value[0]);
        }
      });
      this.event.on('unhovered', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(null);
        }
      });
    } else {
      this.event.on('selected', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(params.value[0]);
        }
      });
      this.event.on('unselected', params => {
        if (!params.model || this.isRelativeModel(params.model)) {
          this.updateDatum(null);
        }
      });
    }
  }

  private updateDatum(datum: any) {
    this._activeDatum = datum;
    this._displayData.updateData();
    const attrs = this._getIndicatorAttrs();
    this._createOrUpdateIndicatorComponent(attrs);
  }

  // data
  private initData() {
    registerDataSetInstanceTransform(this._option.dataSet, 'indicatorFilter', indicatorMapper);
    const displayData = new DataView(this._option.dataSet);
    displayData.transform({
      type: 'indicatorFilter',
      options: {
        title: this._title,
        content: this._content,
        datum: () => this._activeDatum
      }
    });

    displayData.target.addListener('change', this.updateDatum.bind(this));

    this._displayData = new CompilableData(this._option, displayData);
  }

  updateLayoutAttribute(): void {
    const attrs = this._getIndicatorAttrs();
    this._createOrUpdateIndicatorComponent(attrs);

    super.updateLayoutAttribute();
  }

  private _getIndicatorAttrs() {
    const region = this._regions[0];
    const { width, height } = region.getLayoutRect();
    const { x, y } = region.getLayoutStartPoint();

    const contentComponentSpec: IIndicatorItemSpec[] = [];
    array(this._spec.content).forEach((eachItem: IIndicatorItemSpec) => {
      const contentSpec = merge({}, this._theme.content, eachItem);
      contentComponentSpec.push({
        visible: contentSpec.visible !== false && (contentSpec.field ? this._activeDatum !== null : true),
        space: contentSpec.space || this._gap,
        autoLimit: contentSpec.autoLimit,
        autoFit: contentSpec.autoFit,
        fitPercent: contentSpec.fitPercent,
        style: {
          ...transformToGraphic(contentSpec.style),
          text: this._createText(contentSpec.field, contentSpec.style.text)
        }
      });
    });
    return {
      visible: this._spec.visible !== false && (this._spec.fixed !== false || this._activeDatum !== null),
      size: {
        width: width,
        height: height
      },
      zIndex: this.layoutZIndex,
      x: x,
      y: y,
      dx: this._spec.offsetX ?? 0,
      dy: this._spec.offsetY ?? 0,
      limitRatio: this._spec.limitRatio || Infinity,
      title: {
        visible: this._spec.title.visible !== false && (!isValid(this._spec.title.field) || this._activeDatum !== null),
        space: this._spec.title.space || this._gap,
        autoLimit: this._spec.title.autoLimit,
        autoFit: this._spec.title.autoFit,
        fitPercent: this._spec.title.fitPercent,
        style: {
          ...transformToGraphic(this._spec.title.style),
          text: this._createText(this._spec.title.field, this._spec.title.style.text)
        }
      },
      content: contentComponentSpec
    } as IndicatorAttributes;
  }

  private _createOrUpdateIndicatorComponent(attrs: IndicatorAttributes): IndicatorComponents {
    if (this._indicatorComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._indicatorComponent.setAttributes(attrs);
      }
    } else {
      const container = this.getContainer();
      //FIXME:类型“IndicatorAttributes”的参数不能赋给类型“Required<IndicatorAttributes>”的参数
      const indicator = new IndicatorComponents(attrs as any);
      indicator.name = 'indicator';
      container.add(indicator as unknown as INode);
      this._indicatorComponent = indicator;
      this._indicatorComponent.on('*', (event: any, type: string) =>
        this._delegateEvent(this._indicatorComponent as unknown as IGraphic, event, type)
      );
    }
    this._cacheAttrs = attrs;
    return this._indicatorComponent;
  }

  private _createText(
    field: string | undefined,
    text:
      | string
      | number
      | string[]
      | IVisualScale
      | VisualType<string>[]
      | FunctionType<string | number | string[]>
      | IVisualSpecStyle<unknown, string | number | string[]>
      | undefined
  ) {
    if (field) {
      return this._activeDatum ? this._activeDatum[field] : '';
    }
    if (isFunction(text)) {
      return text(this._activeDatum, undefined) ?? '';
    }
    return text ?? '';
  }

  private isRelativeModel(model: IModel) {
    return eachSeries(this._regions, s => model === s) || this._regions.includes(model as IRegion);
  }

  clear(): void {
    if (this._indicatorComponent) {
      this._container.removeChild(this._indicatorComponent as unknown as INode);
      this._indicatorComponent = null;
    }
    this._cacheAttrs = null;
    super.clear();
  }
}
