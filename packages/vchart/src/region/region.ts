import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEmpty, isEqual, array, isValid } from '@visactor/vutils';
import type { IGroupMark as IVGrammarGroupMark, ILayoutOptions, IMark } from '@visactor/vgrammar-core';
import { STATE_VALUE_ENUM_REVERSE } from '../compile/mark/interface';
import { DimensionTrigger } from '../interaction/dimension-trigger';
import { MarkTypeEnum } from '../mark/interface/type';
import type { ISeries } from '../series/interface';
import type { IModelOption } from '../model/interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IRegion, IRegionSpec, IRegionSpecInfo } from './interface';
import type { IGroupMark } from '../mark/group';
import type { IInteraction, ITrigger } from '../interaction/interface';
import { Interaction } from '../interaction/interaction';
import { AttributeLevel, ChartEvent, LayoutZIndex } from '../constant';
import type { IRectMark } from '../mark/rect';
import { AnimateManager } from '../animation/animate-manager';
import type { IAnimate } from '../animation/interface';
import type { ILayoutType, StringOrNumber } from '../typings';
import { IFilterMode } from '../component/data-zoom';
import { LayoutModel } from '../model/layout-model';
import { RegionSpecTransformer } from './region-transformer';

export class Region<T extends IRegionSpec = IRegionSpec> extends LayoutModel<T> implements IRegion {
  static type = 'region';
  static readonly transformerConstructor = RegionSpecTransformer;
  readonly transformerConstructor = RegionSpecTransformer as any;
  readonly modelType: string = 'region';
  static specKey = 'region';
  specKey: string = 'region';

  type = Region.type;
  protected _series: ISeries[] = [];
  layoutType: ILayoutType = 'region';
  layoutZIndex: number = LayoutZIndex.Region;

  animate?: IAnimate;

  interaction: IInteraction = new Interaction();

  declare getSpecInfo: () => IRegionSpecInfo;

  getMaxWidth() {
    return this._layout.maxWidth;
  }
  setMaxWidth(value: number) {
    this._layout.maxWidth = value;
  }

  getMaxHeight() {
    return this._layout.maxHeight;
  }
  setMaxHeight(value: number) {
    this._layout.maxHeight = value;
  }

  protected _groupMark!: IGroupMark;
  getGroupMark() {
    return this._groupMark;
  }

  protected _interactionMark!: IGroupMark;
  getInteractionMark() {
    return this._interactionMark;
  }

  getStackInverse() {
    return this._spec.stackInverse === true;
  }

  getStackSort() {
    return this._spec.stackSort === true;
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
    this.interaction.setDisableActiveEffect(this._option.disableTriggerEvent);
  }

  protected _getClipDefaultValue() {
    const chartSpec = this._option.getChart().getSpec();
    const hasDataZoom = (chartSpec as any).dataZoom?.some?.((entry: any) => {
      const filterMode = entry.filterMode ?? 'filter';
      return filterMode === 'axis';
    });
    const hasScrollBar = (chartSpec as any).scrollBar?.some?.((entry: any) => {
      const filterMode = entry.filterMode ?? 'axis';
      return filterMode === 'axis';
    });

    return hasDataZoom || hasScrollBar ? true : this._layout.layoutClip;
  }

  created(): void {
    this.initLayout();
    super.created();
    const clip = this._spec.clip ?? this._getClipDefaultValue();
    this._groupMark = this._createGroupMark('regionGroup', this.userId, this.layoutZIndex);
    // 交互层
    this._interactionMark = this._createGroupMark(
      'regionInteractionGroup',
      this.userId + '_interaction',
      LayoutZIndex.Interaction
    );

    // hack: region 的样式不能设置在groupMark上，因为groupMark目前没有计算dirtyBound，会导致拖影问题
    if (!isEmpty(this._spec.style)) {
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

  private _createGroupMark(name: string, userId: StringOrNumber, zIndex: number) {
    const groupMark = this._createMark({ type: MarkTypeEnum.group, name }) as IGroupMark;
    groupMark.setUserId(userId);
    groupMark.setZIndex(zIndex);
    const clip = this._spec.clip ?? this._getClipDefaultValue();
    this.setMarkStyle(
      groupMark,
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
      groupMark,
      {
        cornerRadius: this._spec.style?.cornerRadius
      },
      'normal',
      AttributeLevel.User_Mark
    );
    this._marks.addMark(groupMark);
    return groupMark;
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

  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    if (!isEqual(prevSpec?.style, spec?.style)) {
      result.reMake = true;
    }
    return result;
  }

  reInit(spec?: T) {
    super.reInit(spec);
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
        (isValid(opt.specIndex) ? array(opt.specIndex).includes(s.getSpecIndex()) : true) &&
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
    this.event.emit(ChartEvent.regionSeriesDataFilterOver, { model: this, chart: this.getChart() });
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
    if (this._option.disableTriggerEvent) {
      return;
    }

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

  getBoundsInRect = () => {
    return {
      x1: this._layout.getLayoutStartPoint().x,
      y1: this._layout.getLayoutStartPoint().y,
      x2: this._layout.getLayoutStartPoint().x + this._layout.getLayoutRect().width,
      y2: this._layout.getLayoutStartPoint().y + this._layout.getLayoutRect().height
    };
  };

  onLayoutEnd(ctx: any): void {
    this._series.forEach(s => s.onLayoutEnd(ctx));
    super.onLayoutEnd(ctx);
  }
}
