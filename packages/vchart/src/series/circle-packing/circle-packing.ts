/* eslint-disable no-duplicate-imports */
import { isNil, mixin } from '@visactor/vutils';

import type { ICirclePackingOpt } from '../../data/transforms/circle-packing';
import type { ICirclePackingSeriesSpec } from './interface';

import type { IMarkSpec } from '../../typings/spec/common';
import { Factory } from '../../core/factory';
import type { Datum, IArcMarkSpec, ITextMarkSpec } from '../../typings';

import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';

import { CartesianSeries } from '../cartesian/cartesian';
import { registerDataSetInstanceTransform } from '../../data/register';
import { circlePackingLayout } from '../../data/transforms/circle-packing';
import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { IArcMark } from '../../mark/arc';
import { STATE_VALUE_ENUM } from '../../compile/mark/interface';
import { AttributeLevel, DEFAULT_DATA_KEY } from '../../constant';
import { DEFAULT_HIERARCHY_DEPTH, DEFAULT_HIERARCHY_ROOT } from '../../constant/hierarchy';
import type { CirclePackingNodeElement } from '@visactor/vgrammar-hierarchy';
import { flatten } from '../../data/transforms/flatten';
import { CirclePackingTooltipHelper } from './tooltip-helper';
import type { ITextMark } from '../../mark/text';
import { addHierarchyDataKey, initHierarchyKeyMap } from '../../data/transforms/data-key';
import { addVChartProperty } from '../../data/transforms/add-property';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerScaleInOutAnimation } from '../../animation/config';
import type { IStateAnimateSpec } from '../../animation/spec';
import { registerCirclePackingAnimation, type CirclePackingAppearPreset } from './animation';
import type { IDrillable } from '../../interaction/drill/drillable';
import { Drillable } from '../../interaction/drill/drillable';
import { ArcMark } from '../../mark/arc';
import { TextMark } from '../../mark/text';
import { circlePackingSeriesMark } from './constant';

export class CirclePackingSeries<
  T extends ICirclePackingSeriesSpec = ICirclePackingSeriesSpec
> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.circlePacking;
  type = SeriesTypeEnum.circlePacking;

  static readonly mark: SeriesMarkMap = circlePackingSeriesMark;

  // 映射字段
  protected _categoryField!: string;
  protected _valueField!: string;
  // 配置
  private _layoutPadding: number | number[];
  private _circlePacking: IMarkSpec<IArcMarkSpec>;
  private _label: IMarkSpec<ITextMarkSpec>;
  // Mark
  private _circlePackingMark: IArcMark;
  private _labelMark: ITextMark;

  // 钻取功能开启
  private _drill?: boolean;

  setCategoryField(f: string): string {
    this._categoryField = f;
    return this._categoryField;
  }

  getCategoryField() {
    return this._categoryField;
  }

  setValueField(f: string): string {
    this._valueField = f;
    return this._valueField;
  }

  getValueField() {
    return this._valueField;
  }

  getDimensionField() {
    return [this._categoryField];
  }

  getMeasureField(): string[] {
    return [this._valueField];
  }

  setAttrFromSpec(): void {
    super.setAttrFromSpec();

    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);
    this.setSeriesField(this._spec.seriesField ?? DEFAULT_HIERARCHY_ROOT);

    if (this._spec.drill) {
      (this as unknown as IDrillable).initDrillable({
        event: this.event,
        mode: this._option.mode,
        drillField: () => this._spec.drillField ?? DEFAULT_DATA_KEY,
        getRawData: () => this.getRawData()
      });
    }

    this._circlePacking = this._spec.circlePacking;
    this._label = this._spec.label;
    this._layoutPadding = this._spec.layoutPadding;
  }

  protected initData(): void {
    super.initData();

    const rawData = this.getRawData();

    if (isNil(rawData)) {
      return;
    }

    if (this._spec.drill) {
      // 对原始数据进行上卷下钻筛选
      (this as unknown as IDrillable).initDrillableData(this._dataSet);
    }

    // 注册布局算法
    registerDataSetInstanceTransform(this._dataSet, 'circlePackingLayout', circlePackingLayout);
    // 注册扁平化算法
    registerDataSetInstanceTransform(this._dataSet, 'flatten', flatten);

    // 布局算法
    rawData.transform({
      type: 'circlePackingLayout',
      options: (): ICirclePackingOpt => {
        return {
          nodeKey: this._categoryField,
          padding: this._layoutPadding,
          includeRoot: false,
          width: this.getLayoutRect().width || 1,
          height: this.getLayoutRect().height || 1
        };
      }
    });

    // 布局结果进行扁平化处理
    rawData.transform({
      type: 'flatten',
      options: {
        callback: (node: CirclePackingNodeElement) => {
          if (node.datum) {
            const nodeData = node.datum[node.depth];
            return { ...node, ...nodeData };
          }
          return node;
        }
      }
    });
  }

  protected _addDataIndexAndKey() {
    const rawData = this.getRawData();
    if (isNil(rawData?.dataSet)) {
      return;
    }
    // 为原始数据, 添加层级属性
    registerDataSetInstanceTransform(rawData.dataSet, 'addVChartProperty', addVChartProperty);
    rawData.transform({
      type: 'addVChartProperty',
      options: {
        beforeCall: initHierarchyKeyMap.bind(this),
        call: addHierarchyDataKey
      }
    });
  }

  initMark(): void {
    this._initCirclePackingMark();
    this._initLabelMark();
  }

  initMarkStyle(): void {
    this._initCirclePackingMarkStyle();
    this._initLabelMarkStyle();
  }

  private _initCirclePackingMark() {
    if (this._circlePacking?.visible === false) {
      return;
    }

    const circlePacking = this._createMark(CirclePackingSeries.mark.circlePacking, {
      isSeriesMark: true
    }) as IArcMark;

    this._circlePackingMark = circlePacking;
    this._trigger.registerMark(circlePacking);
  }

  private _initCirclePackingMarkStyle() {
    if (isNil(this._circlePackingMark)) {
      return;
    }

    this.setMarkStyle(
      this._circlePackingMark,
      {
        x: d => d.x,
        y: d => d.y,
        outerRadius: d => d.radius,
        innerRadius: 0,
        startAngle: 0,
        endAngle: Math.PI * 2,
        fill: this.getColorAttribute(),
        zIndex: d => d.depth
        // Todo 内置根节点和叶节点透明度
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  private _initLabelMark() {
    if (this._label?.visible === false) {
      return;
    }
    const labelMark = this._createMark(CirclePackingSeries.mark.label, {
      isSeriesMark: false
    }) as IArcMark;

    this._labelMark = labelMark;
    this._trigger.registerMark(labelMark);
  }

  private _initLabelMarkStyle() {
    if (isNil(this._labelMark)) {
      return;
    }

    this.setMarkStyle(
      this._labelMark,
      {
        x: d => d.x,
        y: d => d.y,
        text: d => {
          return d.key;
        },
        cursor: 'pointer'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  getStatisticFields() {
    const fields = super.getStatisticFields();
    return fields.concat([
      {
        key: this._categoryField,
        operations: ['values']
      },
      {
        key: this._valueField,
        operations: ['max', 'min']
      },
      {
        key: DEFAULT_HIERARCHY_DEPTH,
        operations: ['max', 'min', 'values']
      },
      {
        key: DEFAULT_HIERARCHY_ROOT,
        operations: ['values']
      }
    ]);
  }

  protected initTooltip() {
    this._tooltipHelper = new CirclePackingTooltipHelper(this);
    this._tooltipHelper.updateTooltipSpec();
    this._circlePackingMark && this._tooltipHelper.activeTriggerSet.mark.add(this._circlePackingMark);
    this._labelMark && this._tooltipHelper.activeTriggerSet.mark.add(this._labelMark);
  }

  initAnimation(): void {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<CirclePackingAppearPreset>)?.preset;

    this.getMarksInType(MarkTypeEnum.arc).forEach(mark => {
      mark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('circlePacking')?.(undefined, appearPreset),
          userAnimationConfig(mark.name, this._spec)
        )
      );
    });

    this.getMarksInType(MarkTypeEnum.text).forEach(mark => {
      mark.setAnimationConfig(
        animationConfig(Factory.getAnimationInKey('scaleInOut')?.(), userAnimationConfig(mark.name, this._spec))
      );
    });
  }

  initEvent() {
    super.initEvent();
    if (this._spec.drill) {
      (this as unknown as IDrillable).bindDrillEvent();
    }
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._rawData.reRunAllTransform();
  }

  // make sure this function fast
  protected _noAnimationDataKey(datum: Datum, index: number): unknown | undefined {
    return undefined;
  }

  getActiveMarks(): IMark[] {
    return [this._circlePackingMark];
  }
}

mixin(CirclePackingSeries, Drillable);

export const registerCirclePackingSeries = () => {
  Factory.registerMark(ArcMark.type, ArcMark);
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(CirclePackingSeries.type, CirclePackingSeries);
  registerScaleInOutAnimation();
  registerCirclePackingAnimation();
};
