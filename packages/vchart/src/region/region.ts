import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isEqual } from '@visactor/vutils';
import type { IGroupMark as IVGrammarGroupMark, ILayoutOptions, IMark } from '@visactor/vgrammar-core';
import { STATE_VALUE_ENUM_REVERSE } from '../compile/mark/interface';
import { DimensionTrigger } from '../interaction/dimension-trigger';
import { MarkTypeEnum } from '../mark/interface';
import { BaseModel } from '../model/base-model';
import type { ISeries } from '../series/interface';
import type { IModelOption, ILayoutItem } from '../model/interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IRegion, IRegionSpec } from './interface';
import type { IGroupMark } from '../mark/group';
import type { IInteraction, ITrigger } from '../interaction/interface';
import { Interaction } from '../interaction/interaction';
import { AttributeLevel, ChartEvent, LayoutZIndex } from '../constant';
import { array, isValid } from '../util';
import type { IRectMark } from '../mark/rect';
import { AnimateManager } from '../animation/animate-manager';
import type { IAnimate } from '../animation/interface';
import type { StringOrNumber } from '../typings';
import { IFilterMode } from '../component/data-zoom/constant';

export class Region<T extends IRegionSpec = IRegionSpec> extends BaseModel<T> implements IRegion {
  static type = 'region';
  readonly modelType: string = 'region';

  type = Region.type;
  protected _series: ISeries[] = [];
  layoutType: ILayoutItem['layoutType'] = 'region';
  layoutZIndex: number = LayoutZIndex.Region;

  animate?: IAnimate;

  interaction: IInteraction = new Interaction();

  protected _maxRegionWidth?: number;
  getMaxWidth() {
    return this._maxRegionWidth;
  }
  setMaxWidth(value: number) {
    this._maxRegionWidth = value;
  }

  protected _maxRegionHeight?: number;
  getMaxHeight() {
    return this._maxRegionHeight;
  }
  setMaxHeight(value: number) {
    this._maxRegionHeight = value;
  }

  protected _groupMark!: IGroupMark;
  getGroupMark() {
    return this._groupMark;
  }
  getStackInverse() {
    return this._spec.stackInverse === true;
  }

  protected _backgroundMark?: IRectMark;
  protected _foregroundMark?: IRectMark;

  protected _trigger: ITrigger;

  constructor(spec: T, ctx: IModelOption) {
    super(spec, ctx);
    this.userId = spec.id;
    this.coordinate = spec.coordinate ?? 'cartesian';
    if (this._option.animation) {
      this.animate = new AnimateManager({
        getCompiler: ctx.getCompiler
      });
    }
    // 层级应当支持配置
    if (isValid(spec.zIndex)) {
      this.layoutZIndex = spec.zIndex;
    }
  }

  protected _getClipDefaultValue() {
    const chartSpec = this._option.getChart().getSpec();
    const hasDataZoom = (chartSpec as any).dataZoom?.some?.((entry: any) => {
      const filterMode = entry.filterMode ?? IFilterMode.filter;
      return filterMode === IFilterMode.axis;
    });
    const hasScrollBar = (chartSpec as any).scrollBar?.some?.((entry: any) => {
      const filterMode = entry.filterMode ?? IFilterMode.axis;
      return filterMode === IFilterMode.axis;
    });

    return hasDataZoom || hasScrollBar ? true : this.layoutClip;
  }

  _initTheme() {
    // do nothing, region don't need to parse theme
  }

  created(): void {
    super.created();
    this._groupMark = this._createMark({ type: MarkTypeEnum.group, name: 'regionGroup' }) as IGroupMark;
    this._groupMark.setUserId(this.userId);
    this._groupMark.setZIndex(this.layoutZIndex);
    const clip = this._spec.clip ?? this._getClipDefaultValue();
    this.setMarkStyle(
      this._groupMark,
      {
        x: () => this.getLayoutStartPoint().x,
        y: () => this.getLayoutStartPoint().y,
        width: () => this.getLayoutRect().width,
        height: () => this.getLayoutRect().height,
        clip
      },
      'normal',
      AttributeLevel.Built_In
    );
    this.setMarkStyle(
      this._groupMark,
      {
        cornerRadius: this._spec.style?.cornerRadius
      },
      'normal',
      AttributeLevel.User_Mark
    );
    this._marks.addMark(this._groupMark);
    // hack: region 的样式不能设置在groupMark上，因为groupMark目前没有计算dirtyBound，会导致拖影问题
    if (this._spec.style) {
      this._backgroundMark = this._createMark({ type: MarkTypeEnum.rect, name: 'regionBackground' }) as IRectMark;
      if (clip) {
        this._foregroundMark = this._createMark({ type: MarkTypeEnum.rect, name: 'regionForeground' }) as IRectMark;
      }
      [this._backgroundMark, this._foregroundMark].forEach(mark => {
        if (mark) {
          mark.created();
          this.setMarkStyle(
            mark,
            {
              width: () => this.getLayoutRect().width,
              height: () => this.getLayoutRect().height
            },
            'normal',
            AttributeLevel.Built_In
          );
          this._groupMark.addMark(mark);
        }
      });
      this._backgroundMark && this._backgroundMark.setZIndex(0);
      this._foregroundMark && this._foregroundMark.setZIndex(LayoutZIndex.Mark + 1);
    }
    this.createTrigger();
  }

  init(option: any) {
    super.init(option);
    this.initMark();
    this.initSeriesDataflow();
    this.initInteraction();
    this.initTrigger();
  }
  initMark() {
    this._initBackgroundMarkStyle();
    this._initForegroundMarkStyle();
  }

  protected _initBackgroundMarkStyle() {
    if (this._backgroundMark) {
      this.setMarkStyle(
        this._backgroundMark,
        {
          fillOpacity: this._spec.style?.fill ? 1 : 0,
          ...this._spec.style
        },
        'normal',
        AttributeLevel.User_Mark
      );
      if (this._spec.clip ?? this._getClipDefaultValue()) {
        this.setMarkStyle(
          this._backgroundMark,
          {
            strokeOpacity: 0
          },
          'normal',
          AttributeLevel.Built_In
        );
      }
    }
  }

  protected _initForegroundMarkStyle() {
    if (this._foregroundMark) {
      this.setMarkStyle(
        this._foregroundMark,
        {
          ...this._spec.style,
          fillOpacity: 0
        },
        'normal',
        AttributeLevel.User_Mark
      );
    }
  }

  _compareSpec() {
    const result = super._compareSpec();
    if (!isEqual(this._originalSpec?.style, this._spec?.style)) {
      result.reMake = true;
    }
    return result;
  }

  reInit(theme?: any) {
    super.reInit(theme);
    this._initBackgroundMarkStyle();
    this._initForegroundMarkStyle();
  }

  addSeries(s: ISeries) {
    if (!s) {
      return;
    }
    if (!this._series.includes(s)) {
      this._series.push(s);
    }
  }

  removeSeries(s: ISeries) {
    if (!s) {
      return;
    }
    const index = this._series.findIndex(s_ => s_ === s);
    if (index >= 0) {
      this._series.splice(index, 1);
    }
  }

  getSeries(
    opt: {
      name?: string;
      userId?: StringOrNumber | StringOrNumber[];
      specIndex?: number | number[];
      id?: StringOrNumber;
      type?: string;
      coordinateType?: CoordinateType;
      dataName?: string;
    } = {}
  ): ISeries[] {
    return this._series.filter(
      s =>
        (opt.name ? s?.name === opt.name : true) &&
        (opt.userId ? array(opt.userId).includes(s.userId) : true) &&
        (isValid(opt.specIndex) && s.getSpecIndex ? array(opt.specIndex).includes(s.getSpecIndex()) : true) &&
        (opt.id ? s.id === opt.id : true) &&
        (opt.type ? s.type === opt.type : true) &&
        (opt.coordinateType ? s.coordinate === opt.coordinateType : true) &&
        (opt.dataName ? s.getRawData?.()?.name === opt.dataName : true)
    );
  }

  getSeriesInName(name: string): ISeries {
    return this.getSeries({ name })[0];
  }
  getSeriesInUserId(userId: string): ISeries {
    return this.getSeries({ userId })[0];
  }
  getSeriesInId(id: number): ISeries {
    return this.getSeries({ id })[0];
  }
  getSeriesInType(type: string): ISeries[] {
    return this.getSeries({ type });
  }
  getSeriesInCoordinateType(coordinateType: CoordinateType): ISeries[] {
    return this.getSeries({ coordinateType });
  }
  getSeriesInDataName(dataName: string): ISeries[] {
    return this.getSeries({ dataName });
  }

  onRender(ctx: any): void {
    // do nothing
  }

  initSeriesDataflow() {
    const viewDataFilters = this._series.map(s => s.getViewDataFilter() ?? s.getViewData()).filter(v => !!v);
    this._option.dataSet.multipleDataViewAddListener(viewDataFilters, 'change', this.seriesDataFilterOver);
  }

  seriesDataFilterOver = () => {
    this.event.emit(ChartEvent.regionSeriesDataFilterOver, { model: this });
    this._series.forEach(s => {
      if (s.getViewDataFilter()) {
        s.reTransformViewData();
      }
    });
  };

  release() {
    super.release();
    this._series = [];
  }
  /** dimension */
  createTrigger() {
    const triggerOptions = {
      ...this._option,
      model: this,
      interaction: this.interaction
    };
    this._trigger = new DimensionTrigger(triggerOptions);
  }

  initTrigger() {
    // register all mark
    // trigger check mark enable
    this._series.forEach(s => {
      s.getMarksWithoutRoot().forEach(m => {
        this._trigger.registerMark(m);
      });
    });
    this._trigger.init();
  }

  initInteraction() {
    // 注册所有支持反选状态mark
    this._series.forEach(s => {
      s.getMarksWithoutRoot().forEach(m => {
        for (const key in STATE_VALUE_ENUM_REVERSE) {
          if (!isEmpty(m.stateStyle[STATE_VALUE_ENUM_REVERSE[key]])) {
            this.interaction.registerMark(STATE_VALUE_ENUM_REVERSE[key], m);
          }
        }
      });
    });
  }

  compileMarks(group?: string | IVGrammarGroupMark) {
    this.getMarks().forEach(m => {
      m.compile({ group });
      m.getProduct()
        ?.configure({
          context: {
            model: this
          }
        })
        .layout(
          (group: IVGrammarGroupMark, children: IMark[], parentLayoutBounds: IBoundsLike, options?: ILayoutOptions) => {
            // console.log('region mark layout');
          }
        );
    });
  }

  compile() {
    this.animate?.compile();
    this.compileMarks();
  }
}
