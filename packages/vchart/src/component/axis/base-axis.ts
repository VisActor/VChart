import { ticks } from '@visactor/vutils-extension';
// eslint-disable-next-line no-duplicate-imports
import type { ITickDataOpt } from '@visactor/vutils-extension';
import type { IBaseScale } from '@visactor/vscale';
import type { IGroup, IGraphic } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import type {
  IOrientType,
  IPolarOrientType,
  Datum,
  StringOrNumber,
  IGroup as ISeriesGroup,
  CoordinateType
} from '../../typings';
import { BaseComponent } from '../base/base-component';
import { CompilableData } from '../../compile/data';
import type { IAxis, ICommonAxisSpec, ITick } from './interface';
import type { IComponentOption } from '../interface';
import { eachSeries, getSeries } from '../../util/model';
import { mergeSpec } from '../../util/spec/merge-spec';
import type { ISeries } from '../../series/interface';
import { ChartEvent, LayoutZIndex } from '../../constant';
import { animationConfig } from '../../animation/utils';
import type { LooseFunction } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  degreeToRadian,
  pickWithout,
  isEqual,
  array,
  get,
  isArray,
  isBoolean,
  isFunction,
  isNil,
  isValid,
  maxInArray
} from '@visactor/vutils';
import { DEFAULT_TITLE_STYLE, transformAxisLineStyle } from './util';
import { transformAxisLabelStateStyle, transformStateStyle, transformToGraphic } from '../../util/style';
import type { ITransformOptions } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import { DataView } from '@visactor/vdataset';
import {
  GridEnum,
  registerAxis as registerVGrammarAxis,
  registerGrid as registerVGrammarGrid
} from '@visactor/vgrammar-core';
import type { IComponentMark } from '../../mark/component';
// eslint-disable-next-line no-duplicate-imports
import { registerComponentMark } from '../../mark/component';
import { Factory } from '../../core/factory';
// eslint-disable-next-line no-duplicate-imports
import { GroupFadeIn, GroupTransition } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { GroupFadeOut } from '@visactor/vrender-core';
import { scaleParser } from '../../data/parser/scale';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';

export abstract class AxisComponent<T extends ICommonAxisSpec & Record<string, any> = any> // FIXME: 补充公共类型，去掉 Record<string, any>
  extends BaseComponent<T>
  implements IAxis
{
  static specKey = 'axes';
  specKey = 'axes';

  protected _orient: IPolarOrientType | IOrientType;
  getOrient() {
    return this._orient;
  }

  protected _scale!: IBaseScale;
  getScale() {
    return this._scale;
  }

  protected _scales: IBaseScale[] = [];
  getScales() {
    return this._scales;
  }

  protected _tickData: CompilableData[] = [];
  getTickData(index = 0) {
    return this._tickData[index];
  }

  // 与系列的关联关系
  // 优先级：id > index
  // 最终结果：series & region取交集
  protected _seriesUserId?: StringOrNumber[];
  protected _seriesIndex?: number[];
  protected _regionUserId?: StringOrNumber[];
  protected _regionIndex?: number[];

  /**
   * if axis will be shown
   */
  protected _visible: boolean = true;
  get visible() {
    return this._visible;
  }

  /** 轴是否产生反转的真实值，在横向图表的竖轴上可能和用户在 spec 上配的值相反 */
  protected _inverse: boolean;
  getInverse() {
    return this._inverse;
  }

  protected _tick: ITick | undefined = undefined;
  protected abstract computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[];
  abstract valueToPosition(value: any): number;
  protected abstract axisHelper(): any;
  protected abstract getSeriesStatisticsField(s: ISeries): string[];
  protected abstract updateSeriesScale(): void;
  protected abstract collectData(depth: number, rawData?: boolean): { min: number; max: number; values: any[] }[];
  abstract transformScaleDomain(): void;

  protected _dataFieldText: string;
  protected _axisMark: IComponentMark;
  protected _gridMark: IComponentMark;

  protected _coordinateType: CoordinateType;

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._visible = spec.visible ?? true;
    this._coordinateType = 'none';
  }

  protected _getNeedClearVRenderComponents(): IGraphic[] {
    return [];
  }

  getVRenderComponents() {
    return array(this._axisMark?.getProduct()?.getGroupGraphicItem());
  }

  created() {
    super.created();
    //series and regions
    this.setSeriesAndRegionsFromSpec();
    // event
    this.initEvent();
    // scales
    this.initScales();
    this.updateSeriesScale();
    // data，当且仅当轴展示的时候处理
    this.getVisible() && this._initData();

    if (this._visible) {
      // 创建语法元素
      const axisMark = this._createMark(
        { type: 'component', name: `axis-${this.getOrient()}` },
        {
          componentType: this.getOrient() === 'angle' ? 'circleAxis' : 'axis',
          mode: this._spec.mode,
          noSeparateStyle: true,
          skipTheme: true // skip theme of vgrammar to avoid merge
        }
      );
      this._axisMark = axisMark;
      axisMark.setZIndex(this.layoutZIndex);
      if (isValid(this._spec.id)) {
        axisMark.setUserId(this._spec.id);
      }
      this._marks.addMark(axisMark);

      if (this._spec.grid?.visible) {
        const gridMark = this._createMark(
          { type: 'component', name: `axis-${this.getOrient()}-grid` },
          {
            componentType: this.getOrient() === 'angle' ? GridEnum.circleAxisGrid : GridEnum.lineAxisGrid,
            mode: this._spec.mode,
            noSeparateStyle: true,
            skipTheme: true
          }
        );
        gridMark.setZIndex(this._spec.grid?.style?.zIndex ?? this._spec.grid?.zIndex ?? LayoutZIndex.Axis_Grid);
        this._marks.addMark(gridMark);
        this._gridMark = gridMark;
      }

      // interactive
      if (isBoolean(this._spec.interactive)) {
        this._marks.forEach(m => m.setInteractive(this._spec.interactive));
      }

      // Tip: 支持 spec.animationAppear.axis，并且坐标轴默认关闭动画
      if (
        this._option.animation !== false &&
        get(this._option.getChart().getSpec(), 'animation') !== false &&
        this._spec.animation === true
      ) {
        const axisAnimateConfig = animationConfig(Factory.getAnimationInKey('axis')?.(), {
          appear:
            this._spec.animationAppear ??
            get(this._option.getChart().getSpec(), 'animationAppear.axis') ??
            get(this._option.getChart().getSpec(), 'animationAppear'),
          disappear:
            this._spec.animationDisappear ??
            get(this._option.getChart().getSpec(), 'animationDisappear.axis') ??
            get(this._option.getChart().getSpec(), 'animationDisappear'),
          enter:
            this._spec.animationEnter ??
            get(this._option.getChart().getSpec(), 'animationEnter.axis') ??
            get(this._option.getChart().getSpec(), 'animationEnter'),
          exit:
            this._spec.animationExit ??
            get(this._option.getChart().getSpec(), 'animationExit.axis') ??
            get(this._option.getChart().getSpec(), 'animationExit'),
          update:
            this._spec.animationUpdate ??
            get(this._option.getChart().getSpec(), 'animationUpdate.axis') ??
            get(this._option.getChart().getSpec(), 'animationUpdate')
        });
        // 因为坐标轴的更新动画中处理了 enter，所以需要将 enter 的参数传入
        if (axisAnimateConfig.enter) {
          axisAnimateConfig.update[0].customParameters = {
            enter: axisAnimateConfig.enter[0]
          };
        }
        this._marks.forEach(m => m.setAnimationConfig(axisAnimateConfig));
      }
    }
  }

  // data
  protected _initData() {
    const tickData = this._initTickDataSet(this._tickTransformOption());
    tickData.target.addListener('change', this._forceLayout.bind(this));
    this._tickData = [new CompilableData(this._option, tickData)];
  }

  protected isSeriesDataEnable() {
    let enable = true;
    eachSeries(
      this._regions,
      s => {
        if (isArray(s.getViewDataStatistics()?.latestData)) {
          enable = false;
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return enable;
  }

  protected setSeriesAndRegionsFromSpec() {
    const { seriesId, seriesIndex, regionId, regionIndex } = this._spec;
    isValid(seriesId) && (this._seriesUserId = array(seriesId));
    isValid(regionId) && (this._regionUserId = array(regionId));
    isValid(seriesIndex) && (this._seriesIndex = array(seriesIndex));
    isValid(regionIndex) && (this._regionIndex = array(regionIndex));
    this._regions = this._option.getRegionsInUserIdOrIndex(this._regionUserId as string[], this._regionIndex);
    // _regions 被更新了，layoutBindRegionID 也要更新
    this.layout.layoutBindRegionID = this._regions.map(x => x.id);
  }

  getBindSeriesFilter() {
    return {
      userId: this._seriesUserId,
      specIndex: this._seriesIndex
    };
  }

  protected initEvent() {
    this.event.on(
      ChartEvent.scaleUpdate,
      { filter: ({ model }) => model?.id === this.id },
      this.effect.scaleUpdate.bind(this)
    );
    const viewStatistics = getSeries(this._regions, {
      userId: this._seriesUserId,
      specIndex: this._seriesIndex
    })
      .map(s => s.getViewDataStatistics())
      .filter(v => !!v);

    if (viewStatistics.length > 1) {
      this._option.dataSet.multipleDataViewAddListener(viewStatistics, 'change', () => {
        this.updateScaleDomain();
      });
    } else if (viewStatistics.length === 1) {
      viewStatistics[0].target.addListener('change', () => {
        this.updateScaleDomain();
      });
    }

    eachSeries(
      this._regions,
      s => {
        s.event.on(ChartEvent.rawDataUpdate, { filter: ({ model }) => model?.id === s.id }, () => {
          // 只清除，不更新，在需要时，更新一次。避免多系列下多次更新
          this._clearRawDomain();
        });
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
  }

  protected updateScaleDomain() {
    // 留给各个类型的 axis 来 override
  }

  protected _clearRawDomain() {
    // 留给各个类型的 axis 来 override
  }

  protected computeData(updateType?: 'domain' | 'range' | 'force'): void {
    if (this._tickData && this._tickData.length && (updateType === 'force' || !isEqual(this._scale.range(), [0, 1]))) {
      this._tickData.forEach(tickData => {
        tickData.getDataView().reRunAllTransform();
        tickData.updateData();
      });
    }
  }

  protected initScales() {
    this._scales = [this._scale];
    const groups: ISeriesGroup[] = [];
    eachSeries(
      this._regions,
      s => {
        const g = s.getGroups();
        g && groups.push(g);
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    if (groups.length !== 0) {
      const depth = maxInArray(groups.map(g => g.fields.length));
      for (let i = 1; i < depth; i++) {
        const scale = this._scale.clone();
        this._scales.push(scale);
      }
    }
    // this.updateScaleDomain();
  }

  /** Update API **/
  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    result.reRender = true;
    if (prevSpec?.type !== spec?.type) {
      result.reMake = true;
      return result;
    }
    return result;
  }

  protected getLabelFormatMethod() {
    const formatterImpl = Factory.getFormatter();
    const { formatMethod, formatter } = this._spec.label;
    return formatMethod
      ? (value: any, datum: any, index: number) => formatMethod(datum.rawValue, datum)
      : formatter && formatterImpl
      ? (value: any, datum: any, index: number) => formatterImpl(formatter, datum.rawValue, datum)
      : null;
  }

  protected _delegateAxisContainerEvent(component: IGroup) {
    component.addEventListener('*', ((event: any, type: string) =>
      this._delegateEvent(component as unknown as IGraphic, event, type)) as LooseFunction);
  }

  protected _getAxisAttributes() {
    const spec = this._spec;

    const axisAttrs: any = {
      orient: this.getOrient(),
      select: this._option.disableTriggerEvent === true ? false : spec.select,
      hover: this._option.disableTriggerEvent === true ? false : spec.hover
    };

    // 属性均需要显示开启
    if (spec.domainLine && spec.domainLine.visible) {
      axisAttrs.line = transformAxisLineStyle(spec.domainLine);
    } else {
      axisAttrs.line = { visible: false };
    }

    if (spec.label && spec.label.visible) {
      const labelSpec = pickWithout(spec.label, ['style', 'formatMethod', 'state']);
      axisAttrs.label = labelSpec;
      if (spec.label.style) {
        axisAttrs.label.style = isFunction(spec.label.style)
          ? (datum: Datum, index: number, data: Datum[], layer?: number) => {
              const style = spec.label.style(datum.rawValue, index, datum, data, layer);
              return transformToGraphic(mergeSpec({}, this._theme.label?.style, style));
            }
          : transformToGraphic(spec.label.style);
      }
      if (spec.label.formatMethod) {
        axisAttrs.label.formatMethod = (value: any, datum: any, index: number) => {
          return spec.label.formatMethod(datum.rawValue, datum);
        };
      }
      if (spec.label.state) {
        axisAttrs.label.state = transformAxisLabelStateStyle(spec.label.state);
      }
    } else {
      axisAttrs.label = {
        visible: false
      };
    }

    if (spec.tick && spec.tick.visible) {
      axisAttrs.tick = {
        visible: spec.tick.visible,
        length: spec.tick.tickSize,
        inside: spec.tick.inside,
        alignWithLabel: spec.tick.alignWithLabel,
        dataFilter: spec.tick.dataFilter
      };
      if (spec.tick.style) {
        axisAttrs.tick.style = isFunction(spec.tick.style)
          ? (value: number, index: number, datum: Datum, data: Datum[]) => {
              const style = (spec.tick.style as any)(value, index, datum, data);
              return transformToGraphic(mergeSpec({}, this._theme.tick?.style, style));
            }
          : transformToGraphic(spec.tick.style);
      }
      if (spec.tick.state) {
        axisAttrs.tick.state = transformStateStyle(spec.tick.state);
      }
    } else {
      axisAttrs.tick = {
        visible: false
      };
    }

    if (spec.subTick && spec.subTick.visible) {
      axisAttrs.subTick = {
        visible: spec.subTick.visible,
        length: spec.subTick.tickSize,
        inside: spec.subTick.inside,
        count: spec.subTick.tickCount
      };
      if (spec.subTick.style) {
        axisAttrs.subTick.style = isFunction(spec.subTick.style)
          ? (value: number, index: number, datum: Datum, data: Datum[]) => {
              const style = (spec.subTick.style as any)(value, index, datum, data);
              return transformToGraphic(mergeSpec({}, this._theme.subTick?.style, style));
            }
          : transformToGraphic(spec.subTick.style);
      }
      if (spec.subTick.state) {
        axisAttrs.subTick.state = transformStateStyle(spec.subTick.state);
      }
    } else {
      axisAttrs.subTick = {
        visible: false
      };
    }

    if (spec.title && spec.title.visible) {
      const {
        autoRotate,
        angle,
        style: titleStyle = {},
        background: titleBackgroundSpec,
        state: titleState,
        shape: titleShapeSpec,
        ...restTitleAttrs
      } = spec.title;
      let titleAngle = angle;
      let titleTextStyle;
      if (spec.orient === 'left' || spec.orient === 'right') {
        // 处理纵轴的标题样式
        if (autoRotate && isNil(titleAngle)) {
          titleAngle = spec.orient === 'left' ? -90 : 90;
          titleTextStyle = DEFAULT_TITLE_STYLE[spec.orient];
        }
      }

      axisAttrs.title = {
        ...restTitleAttrs,
        autoRotate: false, // 默认不对外提供该配置
        angle: titleAngle ? degreeToRadian(titleAngle) : null,
        textStyle: mergeSpec({}, titleTextStyle, transformToGraphic(titleStyle)),
        pickable: titleStyle.pickable !== false,
        childrenPickable: titleStyle.pickable !== false,
        state: {}
      };

      if (titleShapeSpec && titleShapeSpec.visible) {
        axisAttrs.title.shape = {
          ...titleShapeSpec,
          style: transformToGraphic(titleShapeSpec.style)
        };
        if (titleShapeSpec.state) {
          axisAttrs.title.state.shape = transformStateStyle(titleShapeSpec.state);
        }
      } else {
        axisAttrs.title.shape = { visible: false };
      }

      if (titleBackgroundSpec && titleBackgroundSpec.visible) {
        axisAttrs.title.background = {
          ...titleBackgroundSpec,
          style: transformToGraphic(titleBackgroundSpec.style)
        };
        if (titleBackgroundSpec.state) {
          axisAttrs.title.state.background = transformStateStyle(titleBackgroundSpec.state);
        }
      } else {
        axisAttrs.title.background = { visible: false };
      }

      if (titleState) {
        axisAttrs.title.state.text = transformStateStyle(titleState);
      }
    } else {
      axisAttrs.title = {
        visible: false
      };
    }

    if (spec.background && spec.background.visible) {
      axisAttrs.panel = {
        visible: true
      };
      if (spec.background.style) {
        axisAttrs.panel.style = transformToGraphic(spec.background.style);
      }
      if (spec.background.state) {
        axisAttrs.panel.state = transformStateStyle(spec.background.state);
      }
    } else {
      axisAttrs.panel = {
        visible: false
      };
    }

    return axisAttrs;
  }

  protected _getGridAttributes() {
    const spec = this._spec;
    return {
      alternateColor: spec.grid.alternateColor,
      alignWithLabel: spec.grid.alignWithLabel,
      style: isFunction(spec.grid.style)
        ? () => {
            return (datum: Datum, index: number) => {
              const style = spec.grid.style(datum.datum?.rawValue, index, datum.datum);
              return transformToGraphic(mergeSpec({}, this._theme.grid?.style, style));
            };
          }
        : transformToGraphic(spec.grid.style),
      subGrid:
        spec.subGrid.visible === false
          ? { visible: false }
          : {
              type: 'line',
              visible: spec.subGrid.visible,
              alternateColor: spec.subGrid.alternateColor,
              style: transformToGraphic(spec.subGrid.style)
            }
    };
  }

  protected _initTickDataSet<T extends ITickDataOpt>(options: T, index: number = 0) {
    registerDataSetInstanceParser(this._option.dataSet, 'scale', scaleParser);
    registerDataSetInstanceTransform(this._option.dataSet, 'ticks', ticks);
    const tickData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_ticks_${index}` })
      .parse(this._scales[index], {
        type: 'scale'
      })
      .transform(
        {
          type: 'ticks',
          options
        },
        false
      );
    return tickData;
  }

  protected _tickTransformOption(): ITickDataOpt {
    const tick = this._tick || {};
    const label = this._spec.label || {};
    const { tickCount, forceTickCount, tickStep, tickMode } = tick;
    const { style: labelStyle, formatMethod: labelFormatter, minGap: labelGap } = label;
    return {
      sampling: this._spec.sampling !== false,
      tickCount,
      forceTickCount,
      tickStep,
      tickMode,
      axisOrientType: this._orient,
      coordinateType: this._coordinateType,

      labelStyle,
      labelFormatter,
      labelGap
    };
  }

  addTransformToTickData(options: ITransformOptions, execute?: boolean) {
    this._tickData.forEach(tickData => {
      tickData?.getDataView()?.transform(options, execute);
    });
  }

  dataToPosition(values: any[]): number {
    return this._scale.scale(values);
  }
}

export const registerAxis = () => {
  registerVGrammarAxis();
  registerVGrammarGrid();
  registerComponentMark();
  Factory.registerAnimation('axis', () => ({
    appear: {
      custom: GroupFadeIn
    },
    update: {
      custom: GroupTransition
    },
    exit: {
      custom: GroupFadeOut
    }
  }));
};
