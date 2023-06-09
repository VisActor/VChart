/* eslint-disable no-duplicate-imports */
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { AttributeLevel, DEFAULT_DATA_KEY, PREFIX, VGRAMMAR_HOOK_EVENT } from '../../constant';
import { MarkTypeEnum } from '../../mark/interface';
import type { IRectMark } from '../../mark/rect';
import type { ITextMark } from '../../mark/text';
import type { Datum, IRectMarkSpec, ITextMarkSpec } from '../../typings';
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import type { ITreemapSeriesSpec } from './interface';
import { registerDataSetInstanceTransform } from '../../data/register';
import type { ITreemapOpt } from '../../data/transforms/treemap';
import { treemap } from '../../data/transforms/treemap';
import { flatten } from '../../data/transforms/flatten';
import type { IBounds, IBoundsLike } from '@visactor/vutils';
import { isValidNumber, Bounds, Matrix, mixin } from '@visactor/vutils';
import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import type { TreemapNodeElement } from '@visactor/vgrammar-hierarchy';
import { DataView } from '@visactor/vdataset';
import { hierarchyDimensionStatistics } from '../../data/transforms/hierarchy-dimension-statistics';
import { addVChartProperty } from '../../data/transforms/add-property';
import { addHierarchyDataKey, initKeyMap } from '../../data/transforms/data-key';
import { DEFAULT_HIERARCHY_DEPTH, DEFAULT_HIERARCHY_ROOT } from '../../constant/hierarchy';
import { TreemapTooltipHelper } from './tooltip-helper';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { TransformSpec } from '@visactor/vgrammar';
import type { IZoomable } from '../../interaction/zoom/zoomable';
import { Zoomable } from '../../interaction/zoom/zoomable';
import type { IDrillable } from '../../interaction/drill/drillable';
import { Drillable } from '../../interaction/drill/drillable';
import { BaseSeries } from '../base/base-series';
import { VChart } from '../../core/vchart';
import { RectMark } from '../../mark/rect';
import { TextMark } from '../../mark/text';

VChart.useMark([RectMark, TextMark]);

export class TreeMapSeries extends CartesianSeries<any> {
  static readonly type: string = SeriesTypeEnum.treemap;
  type = SeriesTypeEnum.treemap;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.nonLeaf]: { name: SeriesMarkNameEnum.nonLeaf, type: MarkTypeEnum.rect },
    [SeriesMarkNameEnum.leaf]: { name: SeriesMarkNameEnum.leaf, type: MarkTypeEnum.rect },
    [SeriesMarkNameEnum.nonLeafLabel]: { name: SeriesMarkNameEnum.nonLeafLabel, type: MarkTypeEnum.text }
  };

  private _leafMark: IRectMark;
  private _nonLeafMark: IRectMark;
  private _labelMark: ITextMark;
  private _nonLeafLabelMark: ITextMark;

  protected declare _spec: ITreemapSeriesSpec;

  protected _categoryField!: string;
  getCategoryField() {
    return this._categoryField;
  }
  setCategoryField(f: string): string {
    this._categoryField = f;
    return this._categoryField;
  }

  protected _valueField!: string;
  getValueField() {
    return this._valueField;
  }
  setValueField(f: string): string {
    this._valueField = f;
    return this._valueField;
  }

  private _maxDepth: number;

  // global scale and translate matrix
  private _matrix: Matrix;

  // range for treemap layout, change while zoom and pan
  private _viewBox: IBounds = new Bounds();

  private _clickEnable: boolean = true;

  private _enableAnimationHook = this.enableMarkAnimation.bind(this);

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);
    this.setSeriesField(this._spec.seriesField ?? DEFAULT_HIERARCHY_ROOT);

    if (this._spec.roam) {
      (this as unknown as IZoomable).initZoomable(this.event, this._option.mode);
      this._matrix = new Matrix();
    }
    if (this._spec.drill) {
      (this as unknown as IDrillable).initDrillable({
        event: this.event,
        mode: this._option.mode,
        drillField: () => this._spec.drillField ?? DEFAULT_DATA_KEY,
        getRawData: () => this.getRawData()
      });
    }

    if (isValidNumber(this._spec.maxDepth)) {
      this._maxDepth = this._spec.maxDepth - 1;
    }
  }

  initData() {
    super.initData();
    // 矩形树图中原始数据为层次结果，图元数据为平坦化后的结构，具体逻辑如下：
    // spec.data => rawData(hierarchy) => viewDataFilter => treemap transform => flatten transform => viewData
    if (this._viewDataFilter) {
      // 对原始数据进行上卷下钻筛选
      if (this._spec.drill) {
        (this as unknown as IDrillable).initDrillableData(this._dataSet);
      }

      registerDataSetInstanceTransform(this._dataSet, 'treemap', treemap);
      registerDataSetInstanceTransform(this._dataSet, 'flatten', flatten);

      this.addViewDataFilter({
        type: 'treemap',
        options: {
          range: () => {
            return {
              x0: this._viewBox.x1,
              x1: this._viewBox.x2,
              y0: this._viewBox.y1,
              y1: this._viewBox.y2
            };
          },
          maxDepth: this._maxDepth,
          gapWidth: this._spec.gapWidth,
          padding: this._spec.nodePadding,
          splitType: this._spec.splitType,
          aspectRatio: this._spec.aspectRatio,
          labelPadding: this._spec.nonLeafLabel?.visible ? this._spec.nonLeafLabel?.padding : 0,
          labelPosition: this._spec.nonLeafLabel?.position,
          minVisibleArea: this._spec.minVisibleArea ?? 10,
          minChildrenVisibleArea: this._spec.minChildrenVisibleArea,
          minChildrenVisibleSize: this._spec.minChildrenVisibleSize
        } as ITreemapOpt
      });

      this.addViewDataFilter({
        type: 'flatten',
        options: {
          callback: (node: TreemapNodeElement) => {
            if (node.datum) {
              const nodeData = node.datum[node.depth];
              return { ...node, ...nodeData };
            }
            return node;
          }
        }
      });
    }
  }

  protected _addDataIndexAndKey() {
    if (this._rawData?.dataSet) {
      registerDataSetInstanceTransform(this._rawData.dataSet, 'addVChartProperty', addVChartProperty);
      this._rawData.transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap,
            call: addHierarchyDataKey.bind(this)
          }
        }
        // rawDataStatistic 需要统计 addHierarchyDataKey 的一些字段，所以必须要运行一下
        // false
      );
    }
  }

  protected _statisticRawData() {
    const rawDataName = `${PREFIX}_series_${this.id}_rawDataStatic`;
    this._rawDataStatistics = this._createHierarchyDataStatistics(rawDataName, [this._rawData]);
    this._rawData.target.removeListener('change', this._rawDataStatistics.reRunAllTransform);
    this._rawDataStatistics.reRunAllTransform();
  }

  protected _createHierarchyDataStatistics(dataName: string, rawData: DataView[]) {
    registerDataSetInstanceTransform(this._dataSet, 'hierarchyDimensionStatistics', hierarchyDimensionStatistics);
    registerDataSetInstanceTransform(this._dataSet, 'flatten', flatten);
    const data = new DataView(this._dataSet, { name: dataName });
    data.parse(rawData, {
      type: 'dataview'
    });
    data.transform(
      {
        type: 'hierarchyDimensionStatistics',
        options: {
          fields: () => {
            const fields = this.getStatisticFields();
            if (this._seriesField && this._seriesField !== this._categoryField) {
              fields.push({
                key: this._seriesField,
                operations: ['values']
              });
            }
            return fields;
          }
        }
      },
      false
    );
    return data;
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

  initMark() {
    const nonLeafMark = this._createMark(TreeMapSeries.mark.nonLeaf, { isSeriesMark: true });
    if (nonLeafMark) {
      nonLeafMark.setTransform([
        {
          type: 'filter',
          callback: (datum: TreemapNodeElement) => {
            return !this._shouldFilterElement(datum, 'nonLeaf');
          }
        } as TransformSpec
      ]);
      this._trigger.registerMark(nonLeafMark);
      this._nonLeafMark = nonLeafMark;
      this._tooltipHelper?.activeTriggerSet.mark.add(nonLeafMark);
    }

    const leafMark = this._createMark(TreeMapSeries.mark.leaf, { isSeriesMark: true });
    if (leafMark) {
      leafMark.setTransform([
        {
          type: 'filter',
          callback: (datum: TreemapNodeElement) => {
            return !this._shouldFilterElement(datum, 'leaf');
          }
        } as TransformSpec
      ]);
      this._leafMark = leafMark;
      this._trigger.registerMark(leafMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(leafMark);
    }

    if (this._spec.label?.visible) {
      const textMark = this._createMark(TreeMapSeries.mark.label, {
        skipBeforeLayouted: false
      });
      if (textMark) {
        textMark.setTransform([
          {
            type: 'filter',
            callback: (datum: TreemapNodeElement) => {
              return !this._shouldFilterElement(datum, 'leaf');
            }
          } as TransformSpec
        ]);
        this._labelMark = textMark;
        this._trigger.registerMark(textMark);
        this._tooltipHelper?.activeTriggerSet.mark.add(textMark);
      }
    }

    if (this._spec.nonLeafLabel?.visible) {
      const textMark = this._createMark(TreeMapSeries.mark.nonLeafLabel);
      if (textMark) {
        textMark.setTransform([
          {
            type: 'filter' as string,
            callback: (datum: TreemapNodeElement) => {
              return !this._shouldFilterElement(datum, 'nonLeaf');
            }
          } as TransformSpec
        ]);
        this._nonLeafLabelMark = textMark;
        this._trigger.registerMark(textMark);
        this._tooltipHelper?.activeTriggerSet.mark.add(textMark);
      }
    }
  }

  initMarkStyle() {
    this._initLeafMarkStyle();
    this._initNonLeafMarkStyle();
    this._initLabelMarkStyle();
    this._initNonLeafLabelMarkStyle();
  }

  protected _initLeafMarkStyle() {
    if (!this._leafMark) {
      return;
    }

    this.setMarkStyle<IRectMarkSpec>(
      this._leafMark,
      {
        x: datum => datum.x0,
        y: datum => datum.y0,
        x1: datum => datum.x1,
        y1: datum => datum.y1,
        fill: this.getColorAttribute()
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  protected _initNonLeafMarkStyle() {
    if (!this._nonLeafMark) {
      return;
    }
    this.setMarkStyle<IRectMarkSpec>(
      this._nonLeafMark,
      {
        x: datum => datum.x0,
        y: datum => datum.y0,
        x1: datum => datum.x1,
        y1: datum => datum.y1,
        fill: this.getColorAttribute()
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  protected _initLabelMarkStyle() {
    if (!this._labelMark) {
      return;
    }
    this.setMarkStyle<ITextMarkSpec>(
      this._labelMark,
      {
        visible: (datum, ctx, { element }) => {
          const isLeaf = datum.isLeaf;
          if (!isLeaf) {
            return false;
          }
          const bounds = element.getBounds() as IBoundsLike;
          const { y0, y1 } = datum;
          // 只需要判断高度，宽度放不下会由 limit 来处理
          return !!bounds && bounds.y1 > y0 && bounds.y2 < y1;
        },
        x: datum => (datum.x0 + datum.x1) / 2,
        y: datum => (datum.y0 + datum.y1) / 2,
        text: datum => {
          return datum.datum[datum.depth]?.[this.getDimensionField()[0]];
        },
        limit: (datum: Datum) => {
          return datum.x1 === datum.x0 ? Number.MIN_VALUE : datum.x1 - datum.x0;
        }
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  protected _initNonLeafLabelMarkStyle() {
    if (!this._nonLeafLabelMark) {
      return;
    }
    this.setMarkStyle<ITextMarkSpec>(
      this._nonLeafLabelMark,
      {
        visible: datum => !!datum.labelRect,
        x: datum => {
          if (datum.labelRect) {
            return (datum.labelRect.x0 + datum.labelRect.x1) / 2;
          }
          return (datum.x0 + datum.x1) / 2;
        },
        y: datum => {
          if (datum.labelRect) {
            return (datum.labelRect.y0 + datum.labelRect.y1) / 2;
          }
          return (datum.y0 + datum.y1) / 2;
        },
        text: datum => {
          return datum.datum[datum.depth]?.[this.getDimensionField()[0]];
        },
        limit: (datum: any) => {
          return datum.x1 === datum.x0 ? Number.MIN_VALUE : datum.x1 - datum.x0;
        }
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  initAnimation(): void {
    this.getMarksInType(MarkTypeEnum.rect).forEach(mark => {
      mark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.treemap(), userAnimationConfig(mark.name, this._spec))
      );
    });

    this.getMarksInType(MarkTypeEnum.text).forEach(mark => {
      mark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(mark.name, this._spec))
      );
    });
  }

  protected initEvent(): void {
    super.initEvent();
    // Roam
    if (this._spec.roam) {
      // 拖拽事件
      (this as unknown as IZoomable).initDragEventOfSeries(this);
      this.event.on('panmove', e => {
        this.handlePan(e as PanEventParam);
      });
      // 缩放事件
      (this as unknown as IZoomable).initZoomEventOfSeries(this);
      this.event.on('zoom', e => {
        this.handleZoom(e as ZoomEventParam);
      });
    }
    // Drill
    if (this._spec.drill) {
      (this as unknown as IDrillable).bindDrillEvent();
    }
  }

  protected _getDataIdKey() {
    return 'key';
  }

  protected initTooltip() {
    this._tooltipHelper = new TreemapTooltipHelper(this);
  }

  private _shouldFilterElement(datum: TreemapNodeElement, nodeType: 'leaf' | 'nonLeaf') {
    const isLeaf = datum.isLeaf;
    // 过滤掉非需要的节点
    return nodeType === 'leaf' ? !isLeaf : isLeaf;
  }

  handlePan(event: PanEventParam) {
    const { delta } = event;
    if (delta[0] === 0 && delta[1] === 0) {
      return;
    }
    this._matrix.reset();
    this._matrix.translate(delta[0], delta[1]);
    const { a, b, c, d, e, f } = this._matrix;
    this._matrix.multiply(a, b, c, d, e, f);

    this._viewBox.transformWithMatrix(this._matrix);

    this.reFilterViewData();
  }

  handleZoom(event: ZoomEventParam) {
    const { scale, scaleCenter } = event;
    if (scale === 1) {
      return;
    }

    this._matrix.reset();
    const { x, y } = scaleCenter;
    this._matrix.translate(x, y);
    this._matrix.scale(scale, scale);
    this._matrix.translate(-x, -y);
    const { a, b, c, d, e, f } = this._matrix;
    this._matrix.multiply(a, b, c, d, e, f);
    // 缩放过程中会有新增/减少的element，对应执行enter/exit动画，会使得缩放交互效果体验很差
    // 这里在缩放过程中先关闭所有动画
    this.disableMarkAnimation();
    this.event.on(VGRAMMAR_HOOK_EVENT.AFTER_DO_RENDER, this._enableAnimationHook);
    this._viewBox.transformWithMatrix(this._matrix);
    this.reFilterViewData();
  }

  getDimensionField() {
    return [this._categoryField];
  }

  getMeasureField(): string[] {
    return [this._valueField];
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._viewBox.set(0, 0, this.getLayoutRect().width, this.getLayoutRect().height);
    this._rawData.reRunAllTransform();
  }

  protected enableMarkAnimation() {
    this.getMarks().forEach(mark => {
      mark.getProduct().animate?.enable();
    });
    // 在所有动画执行之后关闭动画
    this.event.off(VGRAMMAR_HOOK_EVENT.AFTER_DO_RENDER, this._enableAnimationHook);
  }

  protected disableMarkAnimation() {
    this.getMarks().forEach(mark => {
      mark.getProduct().animate?.disable();
    });
  }

  getDefaultShapeType(): string {
    return 'square';
  }
}

mixin(TreeMapSeries, Zoomable);
mixin(TreeMapSeries, Drillable);
