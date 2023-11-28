import type { IBounds, IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { IEffect, IModelInitOption } from '../../../model/interface';
import type { ICartesianSeries } from '../../../series/interface';
import type { IRegion } from '../../../region/interface';
import type { ICartesianAxisCommonSpec, IAxisHelper, ICartesianAxisCommonTheme } from './interface';
import { isArray, isValid, isValidNumber, mergeSpec, eachSeries, isNil, isUndefined } from '../../../util';
import type { IOrientType } from '../../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../typings/space';
import type { IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import { Factory } from '../../../core/factory';
import { autoAxisType, isXAxis, getOrient, isZAxis, isYAxis, transformInverse } from './util/common';
import { ChartEvent, DEFAULT_LAYOUT_RECT_LEVEL, LayoutZIndex, USER_LAYOUT_RECT_LEVEL } from '../../../constant';
import { LayoutLevel } from '../../../constant/index';
import pluginMap from '../../../plugin/components';
import type { StringOrNumber } from '../../../typings/common';
import type { IPoint } from '../../../typings/coordinate';
import type { ILayoutRect, ILayoutType } from '../../../typings/layout';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface/type';
import { HOOK_EVENT } from '@visactor/vgrammar-core';
import type { LineAxisAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { isValidCartesianAxis } from '../util';
import type { IAxis, ITick } from '../interface';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../../data/register';
import { scaleParser } from '../../../data/parser/scale';
import type { ICartesianTickDataOpt } from '@visactor/vutils-extension';
// eslint-disable-next-line no-duplicate-imports
import { ticks } from '@visactor/vutils-extension';
import type { DataSet } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import { DataView } from '@visactor/vdataset';
import { CompilableData } from '../../../compile/data/compilable-data';
import { AxisComponent } from '../base-axis';
import type { IGraphic, IText } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { createText } from '@visactor/vrender-core';

const CartesianAxisPlugin = [pluginMap.AxisSyncPlugin];

export abstract class CartesianAxis<T extends ICartesianAxisCommonSpec = ICartesianAxisCommonSpec>
  extends AxisComponent<T>
  implements IAxis
{
  static type = ComponentTypeEnum.cartesianAxis;
  type = ComponentTypeEnum.cartesianAxis;
  name: string = ComponentTypeEnum.cartesianAxis;

  protected readonly _defaultBandPosition = 0.5;
  protected readonly _defaultBandInnerPadding = 0.1;
  protected readonly _defaultBandOuterPadding = 0.3;

  // 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
  declare directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';

  layoutType: ILayoutType = 'region-relative';
  layoutZIndex: number = LayoutZIndex.Axis;
  layoutLevel: number = LayoutLevel.Axis;

  protected _dataSet: DataSet;

  layout3dBox?: { width: number; height: number; length: number };

  protected _orient: IOrientType = 'left';
  getOrient() {
    return this._orient;
  }

  protected _autoIndentOnce: boolean = false;
  protected _hasAutoIndent: boolean = false;
  set autoIndentOnce(v: boolean) {
    this._autoIndentOnce = v;
  }

  protected _scales: IBaseScale[] = [];
  getScales() {
    return this._scales;
  }

  protected declare _theme: ICartesianAxisCommonTheme;

  protected _tick: ITick | undefined = undefined;

  private _axisStyle: Partial<LineAxisAttributes>;
  private _latestBounds: IBounds;
  private _verticalLimitSize: number;
  private _unitText: IText;

  protected _layoutCache: {
    width: number;
    height: number;
    _lastComputeOutBounds: IBoundsLike;
  } = { width: 0, height: 0, _lastComputeOutBounds: { x1: 0, x2: 0, y1: 0, y2: 0 } };

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    this._orient = getOrient(spec, ['z']);
    if (isZAxis(this._orient)) {
      this.layoutType = 'absolute';
    }
    this._dataSet = options.dataSet;
  }

  static createAxis(spec: any, options: IComponentOption, isHorizontal: boolean = false): IAxis {
    const axisType = spec.type ?? autoAxisType(spec.orient, isHorizontal);
    const componentName = `${CartesianAxis.type}-${axisType}`;
    const C = Factory.getComponentInKey(componentName);
    if (C) {
      return new C(
        {
          ...spec,
          type: axisType
        },
        options
      ) as IAxis;
    }
    options.onError(`Component ${componentName} not found`);
    return null;
  }

  static createComponent(spec: any, options: IComponentOption) {
    const regions = options.getRegionsInIndex();
    if (regions.find(r => r.coordinate !== 'cartesian')) {
      return null;
    }
    let axesSpec = spec[CartesianAxis.specKey];
    if (!axesSpec) {
      return null;
    }
    const isHorizontal = spec.direction === Direction.horizontal;
    if (!isArray(axesSpec)) {
      // 如果非法，或者只有一个z轴就不创建
      if (!isValidCartesianAxis(axesSpec)) {
        return null;
      }
      return CartesianAxis.createAxis(axesSpec, options, isHorizontal);
    }
    // 处理spec
    const zAxis = axesSpec.filter(s => s.orient === 'z')[0];
    let valid = true;
    if (zAxis) {
      const xAxis = axesSpec.filter(s => s.orient === 'bottom')[0];
      const yAxis = axesSpec.filter(s => isYAxis(s.orient))[0];
      // 必须有x和y，且x必须是bottom
      valid = axesSpec.length === 3 && xAxis && yAxis;
    }
    if (!valid) {
      axesSpec = axesSpec.filter(s => s.orient !== 'z');
    }
    const axes: IAxis[] = [];
    axesSpec.forEach((s: any, i: any) => {
      if (!isValidCartesianAxis(s)) {
        return;
      }
      axes.push(
        CartesianAxis.createAxis(
          s,
          {
            ...options,
            specIndex: i
          },
          isHorizontal
        ) as IAxis
      );
    });
    return axes;
  }

  initLayout(): void {
    super.initLayout();
    this._layout.autoIndent = this._spec.autoIndent !== false;
    this._layout.layoutOrient = this._orient;
  }

  setLayout3dBox(box3d: { width: number; height: number; length: number }) {
    this.layout3dBox = box3d;
  }

  effect: IEffect = {
    scaleUpdate: params => {
      this.computeData(params?.value);
      eachSeries(
        this._regions,
        s => {
          const orient = this.getOrient();

          if (isXAxis(orient)) {
            (s as ICartesianSeries).setXAxisHelper(this.axisHelper());
          } else if (isYAxis(orient)) {
            (s as ICartesianSeries).setYAxisHelper(this.axisHelper());
          } else if (isZAxis(orient)) {
            (s as ICartesianSeries).setZAxisHelper(this.axisHelper());
          }
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );
    }
  };

  protected abstract computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[];
  abstract valueToPosition(value: any): number;

  protected updateScaleRange() {
    let isScaleChange = false;
    const { width, height } = this.getLayoutRect();
    const inverse = this._spec.inverse;
    let newRange: number[] = [];
    if (isXAxis(this.getOrient())) {
      if (isValidNumber(width)) {
        newRange = inverse ? [width, 0] : [0, width];
      }
    } else if (isZAxis(this.getOrient())) {
      if (isValidNumber(width)) {
        newRange = inverse ? [width, 0] : [0, width];
        this._scale.range(newRange);
      }
    } else {
      if (isValidNumber(height)) {
        newRange = inverse ? [0, height] : [height, 0];
      }
    }

    const [start, end] = this._scale.range();
    if (newRange[0] !== start || newRange[1] !== end) {
      isScaleChange = true;
      this._scale.range(newRange);
    }

    return isScaleChange;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    this.pluginService?.load(CartesianAxisPlugin.map(P => new P()));
    this.callPlugin(plugin => {
      this.pluginService && plugin.onInit && plugin.onInit(this.pluginService, this);
    });
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();

    if (this.visible) {
      const isX = isXAxis(this.getOrient());
      if (isX) {
        if (isUndefined(this._spec.maxHeight)) {
          this._spec.maxHeight = '30%';
        }
      } else if (isUndefined(this._spec.maxWidth)) {
        this._spec.maxWidth = '30%';
      }

      const axisStyle: any = this._getAxisAttributes();
      axisStyle.label.formatMethod = this.getLabelFormatMethod();
      axisStyle.verticalFactor = this.getOrient() === 'top' || this.getOrient() === 'right' ? -1 : 1;
      this._axisStyle = axisStyle;
    }
    this._tick = this._spec.tick;
  }

  protected getSeriesStatisticsField(s: ICartesianSeries) {
    let f: string[];
    if (isXAxis(this.getOrient())) {
      f = s.fieldX;
    } else if (isZAxis(this.getOrient())) {
      f = s.fieldZ;
    } else {
      f = s.fieldY;
    }
    if (isContinuous(this._scale.type)) {
      return f;
    }
    return [f[0]];
  }

  protected _initTickData(sampling: boolean) {
    registerDataSetInstanceParser(this._option.dataSet, 'scale', scaleParser);
    registerDataSetInstanceTransform(this._option.dataSet, 'ticks', ticks);

    const label = this._spec.label || {};
    const tick = this._tick || {};
    const tickData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_ticks` })
      .parse(this._scale, {
        type: 'scale'
      })
      .transform(
        {
          type: 'ticks',
          options: {
            sampling,
            tickCount: tick.tickCount,
            forceTickCount: tick.forceTickCount,
            tickStep: tick.tickStep,
            tickMode: tick.tickMode,
            noDecimals: tick.noDecimals,

            axisOrientType: this._orient,
            coordinateType: 'cartesian',

            labelStyle: label.style,
            labelFormatter: label.formatMethod,
            labelGap: label.minGap,

            labelLastVisible: label.lastVisible,
            labelFlush: label.flush
          } as ICartesianTickDataOpt
        },
        false
      );
    tickData.target.addListener('change', this._forceLayout.bind(this));

    this._tickData = new CompilableData(this._option, tickData);
  }

  protected _initData() {
    this._initTickData(this._spec.sampling !== false); // default do sampling
  }

  protected axisHelper(): IAxisHelper {
    const getScale = (depth: number = 0) => {
      return this._scales[depth];
    };
    return {
      isContinuous: isContinuous(this._scale.type),
      dataToPosition: this.dataToPosition.bind(this),
      getScale,
      getAxisType: () => this.type,
      getAxisId: () => this.id,
      isInverse: () => this._spec.inverse === true
    };
  }

  /** LifeCycle API**/
  afterCompile() {
    const product = this._axisMark?.getProduct();
    if (product) {
      product.addEventListener(HOOK_EVENT.AFTER_ELEMENT_ENCODE, () => {
        if (this._isLayout === false) {
          // 布局结束之后再进行插件的调用
          // 插件在布局后
          if (isXAxis(this.getOrient())) {
            this.callPlugin(plugin => {
              this.pluginService &&
                plugin.onDidLayoutHorizontal &&
                plugin.onDidLayoutHorizontal(this.pluginService, this);
            });
          } else {
            this.callPlugin(plugin => {
              this.pluginService && plugin.onDidLayoutVertical && plugin.onDidLayoutVertical(this.pluginService, this);
            });
          }
          this._delegateAxisContainerEvent(product.getGroupGraphicItem());

          // 更新单位的显示位置
          if (this._unitText) {
            const bounds = product.graphicItem.AABBBounds;
            const pos = isXAxis(this._orient)
              ? {
                  x: bounds.x2,
                  y: this.getLayoutStartPoint().y
                }
              : {
                  x: this.getLayoutStartPoint().x,
                  y: bounds.y1
                };

            this._unitText.setAttributes(pos);
          }
        }
      });
    }
    this.callPlugin(plugin => {
      this.pluginService && plugin.onDidCompile && plugin.onDidCompile(this.pluginService, this);
    });
  }

  onLayoutEnd(ctx: any): void {
    const isRangeChange = this.updateScaleRange();
    if (isRangeChange) {
      this.event.emit(ChartEvent.scaleUpdate, { model: this, value: 'range' });
      // 这里会执行 computeData ，会执行系列scale更新
    } else {
      this.updateSeriesScale();
    }
    super.onLayoutEnd(ctx);
  }

  onRender(ctx: any): void {
    // do nothing
  }

  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  update(ctx: IComponentOption) {
    // TODO
  }

  resize(ctx: IComponentOption) {
    // TODO
  }

  protected collectScale() {
    const scales: IBaseScale[] = [];
    eachSeries(
      this._regions,
      s => {
        scales.push(
          this.getOrient() === 'left' || this.getOrient() === 'right'
            ? (s as ICartesianSeries).scaleY
            : (s as ICartesianSeries).scaleX
        );
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return scales;
  }

  protected collectData(depth?: number) {
    const data: { min: number; max: number; values: any[] }[] = [];
    eachSeries(
      this._regions,
      s => {
        let field: string | string[];
        if (depth > 0) {
          field = s.getGroups()?.fields?.[depth];
        } else {
          if (isXAxis(this.getOrient())) {
            field = (s as ICartesianSeries).fieldX2
              ? [...(s as ICartesianSeries).fieldX, (s as ICartesianSeries).fieldX2]
              : (s as ICartesianSeries).fieldX;
          } else if (isZAxis(this.getOrient())) {
            field = (s as ICartesianSeries).fieldZ;
          } else {
            field = (s as ICartesianSeries).fieldY;
          }
        }
        field = (isArray(field) ? (isContinuous(this._scale.type) ? field : [field[0]]) : [field]) as string[];
        if (!depth) {
          this._dataFieldText = s.getFieldAlias(field[0]);
        }
        const seriesData = s.getViewDataStatistics?.();
        if (field) {
          field.forEach(f => {
            if (seriesData?.latestData?.[f]) {
              data.push(seriesData.latestData[f]);
            }
          });
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
    return data;
  }

  protected updateSeriesScale() {
    const orient = this.getOrient();
    eachSeries(
      this._regions,
      s => {
        if (isXAxis(orient)) {
          (s as ICartesianSeries).setScaleX(this._scale);
          (s as ICartesianSeries).setXAxisHelper(this.axisHelper());
        } else if (isYAxis(orient)) {
          (s as ICartesianSeries).setScaleY(this._scale);
          (s as ICartesianSeries).setYAxisHelper(this.axisHelper());
        } else if (isZAxis(orient)) {
          (s as ICartesianSeries).setScaleZ(this._scale);
          (s as ICartesianSeries).setZAxisHelper(this.axisHelper());
        }
      },
      {
        userId: this._seriesUserId,
        specIndex: this._seriesIndex
      }
    );
  }

  _transformLayoutPosition = (pos: Partial<IPoint>) => {
    let { x, y } = pos;
    if (isValidNumber(x)) {
      x += Number(this._orient === 'left') * this.getLayoutRect().width;
    }
    if (isValidNumber(y)) {
      y += Number(this._orient === 'top') * this.getLayoutRect().height;
    }
    return { x, y };
  };

  _transformLayoutRect = (result: ILayoutRect) => {
    if (!this._visible) {
      return result;
    }
    const bounds = this._latestBounds.clone().translate(-this.getLayoutStartPoint().x, -this.getLayoutStartPoint().y);
    switch (this._layout.layoutOrient) {
      case 'left':
        if (this._layout.layoutRectLevelMap.width === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.width = bounds.x1 < 0 ? -bounds.x1 : 0;
        }
        break;
      case 'right':
        if (this._layout.layoutRectLevelMap.width === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.width = bounds.x2 > 0 ? bounds.x2 : 0;
        }
        break;
      case 'top':
        if (this._layout.layoutRectLevelMap.height === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.height = bounds.y1 < 0 ? -bounds.y1 : 0;
        }
        break;
      case 'bottom':
        if (this._layout.layoutRectLevelMap.height === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.height = bounds.y2 > 0 ? bounds.y2 : 0;
        }
        break;
      default:
        break;
    }
    result.width = Math.ceil(result.width);
    result.height = Math.ceil(result.height);
    return this._layout.setRectInSpec(this._layoutCacheProcessing(result));
  };
  /**
   * bounds 预计算
   * @param rect
   * @returns
   */
  getBoundsInRect(rect: ILayoutRect): IBoundsLike {
    let result: IBoundsLike = { x1: 0, y1: 0, x2: 0, y2: 0 };
    if (!this._visible) {
      return result;
    }
    this._verticalLimitSize = isXAxis(this.getOrient()) ? rect.height : rect.width;

    this.setLayoutRect(rect);
    const isChanged = this.updateScaleRange();
    if (isChanged) {
      this.computeData('range');
    }
    const context = { skipLayout: false };
    const isX = isXAxis(this.getOrient());
    if (this.pluginService) {
      isX
        ? this.callPlugin(plugin => {
            plugin.onWillLayoutHorizontal && plugin.onWillLayoutHorizontal(this.pluginService, context, this);
          })
        : this.callPlugin(plugin => {
            plugin.onWillLayoutVertical && plugin.onWillLayoutVertical(this.pluginService, context, this);
          });
    }
    const product = this._axisMark.getProduct();
    let hasBounds = false;

    if (!context.skipLayout) {
      const attrs = this._getUpdateAttribute(true);
      const axisComponent = product.getGroupGraphicItem();

      const spec = mergeSpec({ ...this.getLayoutStartPoint() }, this._axisStyle, attrs, { line: { visible: false } });
      const updateBounds = axisComponent.getBoundsWithoutRender(spec);

      hasBounds = true;
      this._latestBounds = updateBounds;
      if (isFinite(updateBounds.width())) {
        // 因为轴单位在某些区域显示的时候，是不参与轴某个方向的包围盒计算的，
        // 所以不太合适放在轴组件内支持，所以就在 VChart 层的轴组件上通过添加 text 图元支持
        result = this._appendAxisUnit(updateBounds, isX);
      }
    }

    if (!hasBounds) {
      this._latestBounds = product.getBounds();
    }
    return result;
  }

  updateLayoutAttribute(): void {
    if (!this.visible) {
      return;
    }
    const startPoint = this.getLayoutStartPoint();
    // 正式的更新布局属性
    const { grid: updateGridAttrs, ...updateAxisAttrs } = this._getUpdateAttribute(false);
    const axisProduct = this._axisMark.getProduct(); // 获取语法元素
    const axisAttrs = mergeSpec({ x: startPoint.x, y: startPoint.y }, this._axisStyle, updateAxisAttrs);
    axisProduct.encode(axisAttrs);

    if (this._gridMark) {
      const gridProduct = this._gridMark.getProduct(); // 获取语法元素
      gridProduct.encode(mergeSpec({ x: startPoint.x, y: startPoint.y }, this._getGridAttributes(), updateGridAttrs));
    }

    super.updateLayoutAttribute();
  }

  private _getTitleLimit(isX: boolean) {
    if (this._spec.title.visible && isNil(this._spec.title.style?.maxLineWidth)) {
      const angle = this._axisStyle.title?.angle ?? this._spec.title.style?.angle ?? 0;
      if (isX) {
        const width = this.getLayoutRect().width;
        const cosValue = Math.abs(Math.cos(angle));
        // VRender 接收到的limit是考虑角度计算后的宽度
        // TODO：还需要考虑angle后，高度是否太高，综合计算一个limit，比如高度不能超过图表整体高度的1/4
        return cosValue < 1e-6 ? Infinity : width / cosValue;
      }
      const height = this.getLayoutRect().height;
      const sinValue = Math.abs(Math.sin(angle));

      // TODO：还需要考虑angle后，宽度是否太宽，综合计算一个limit，比如宽度度不能超过图表整体宽度的1/4
      return sinValue < 1e-6 ? Infinity : height / sinValue;
    }

    return null;
  }

  private _getUpdateAttribute(ignoreGrid: boolean) {
    // 获取更新的坐标轴属性
    let regionHeight = 0;
    let regionWidth = 0;

    if (!ignoreGrid) {
      const regions = this.getRegions();
      let { x: minX, y: minY } = regions[0].getLayoutStartPoint();
      let maxX = minX + regions[0].getLayoutRect().width;
      let maxY = minY + regions[0].getLayoutRect().height;

      for (let index = 1; index < regions.length; index++) {
        const region = regions[index];
        const { x, y } = region.getLayoutStartPoint();
        const { width, height } = region.getLayoutRect();

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, width + x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, height + y);
      }
      regionHeight = Math.abs(maxY - minY);
      regionWidth = Math.abs(maxX - minX);
    }

    const { width, height } = this.getLayoutRect();
    const isX = isXAxis(this._orient);
    const isY = isYAxis(this._orient);
    const isZ = isZAxis(this._orient);
    let end = { x: 0, y: 0 };
    let gridLength = 0;
    let axisLength = 0;
    const depth = this.layout3dBox ? this.layout3dBox.length : 0;
    if (isX) {
      end = { x: width, y: 0 };
      gridLength = regionHeight;
      axisLength = width;
    } else if (isY) {
      end = { x: 0, y: height };
      gridLength = regionWidth;
      axisLength = height;
    }
    if (isZ) {
      const directionStr = this.directionStr ?? 'r2l';
      const depthZ = this.layout3dBox ? this.layout3dBox.width : 0;
      let anchor3d = [0, 0];
      let alpha = -Math.PI / 2;
      let z = 0;
      if (directionStr === 'l2r') {
        z = this.layout3dBox.length;
        anchor3d = [0, 0, 0];
        alpha = Math.PI / 2;
      }
      const items = this.getLabelItems(width);
      const axisAttrs: any = {
        start: { x: 0, y: 0 },
        end: { x: depth, y: 0 },
        z: z,
        alpha,
        anchor3d,
        title: {
          text: this._spec.title.text || this._dataFieldText,
          maxWidth: this._getTitleLimit(isX)
        },
        items
      };
      if (!ignoreGrid) {
        axisAttrs.grid = {
          type: 'line',
          start: { x: 0, y: 0 },
          end: { x: depth, y: 0 },
          items: items[0],
          verticalFactor: this._axisStyle.verticalFactor,
          depth: depthZ,
          length: regionHeight,
          z: z,
          alpha,
          anchor3d
        };
      }
      return axisAttrs;
    }
    let verticalMinSize = isX ? this.layout.minHeight : this.layout.minWidth;
    if (
      (isX && this._layout.layoutRectLevelMap.height === USER_LAYOUT_RECT_LEVEL) ||
      (isY && this._layout.layoutRectLevelMap.width === USER_LAYOUT_RECT_LEVEL)
    ) {
      verticalMinSize = this._verticalLimitSize;
    }
    const items = this.getLabelItems(axisLength);
    const attrs: any = {
      start: { x: 0, y: 0 },
      end,
      title: {
        text: this._spec.title.text || this._dataFieldText,
        maxWidth: this._getTitleLimit(isX)
      },
      items,
      verticalLimitSize: this._verticalLimitSize,
      verticalMinSize
    };
    if (!ignoreGrid) {
      attrs.grid = {
        type: 'line',
        start: { x: 0, y: 0 },
        end,
        items: items[0],
        verticalFactor: this._axisStyle.verticalFactor,
        depth,
        length: gridLength
      };
    }

    return attrs;
  }

  protected initEvent() {
    super.initEvent();

    if (this.visible) {
      // 布局结束之后处理 0 基线问题
      this.event.on(ChartEvent.layoutEnd, this._fixAxisOnZero);
      // 图表resize后，需要正常布局，清除布局缓存
      this.event.on(ChartEvent.layoutRectUpdate, () => {
        this._clearLayoutCache();
      });
    }
  }

  private _fixAxisOnZero = () => {
    // 在布局结束之后调整坐标轴零基线
    const { onZero, visible } = this._spec.domainLine;
    if (this.visible && onZero && visible !== false) {
      const { onZeroAxisId, onZeroAxisIndex } = this._spec.domainLine;
      const axesComponents = this._option.getComponentsByKey('axes') as IAxis[];
      const isX = isXAxis(this.getOrient());

      // 判断坐标轴是否可用
      const isValidAxis = (item: any) => {
        return (
          (isX ? !isXAxis(item.orient) : isXAxis(item.orient)) &&
          isContinuous(item.getScale().type) &&
          item
            .getTickData()
            .getLatestData()
            ?.find((d: any) => d.value === 0)
        );
      };
      const relativeAxes = axesComponents.filter(item => isValidAxis(item));
      if (relativeAxes.length) {
        let bindAxis;
        if (isValid(onZeroAxisId)) {
          bindAxis = relativeAxes.find(axis => axis.id === onZeroAxisId);
        } else if (isValid(onZeroAxisIndex)) {
          const indexAxis = axesComponents[onZeroAxisIndex];
          if (isValidAxis(indexAxis)) {
            bindAxis = indexAxis;
          }
        } else {
          // 默认绑定第一条的相对坐标轴
          bindAxis = relativeAxes[0];
        }
        if (bindAxis) {
          const axisMark = this._axisMark.getProduct();
          // 找到了绑定的 axis，获取基线的位置
          const position = bindAxis.valueToPosition(0);
          // 获取偏移量
          if (isX) {
            axisMark.encode({
              line: {
                ...this._axisStyle.line,
                dy: this._orient === 'bottom' ? -(bindAxis.getScale().range()[0] - position) : position
              }
            });
          } else {
            axisMark.encode({
              line: {
                ...this._axisStyle.line,
                dx: this._orient === 'left' ? position : -(bindAxis.getScale().range()[1] - position)
              }
            });
          }
        }
      }
    }
  };

  protected _layoutCacheProcessing(rect: ILayoutRect) {
    ['width', 'height'].forEach(key => {
      if (rect[key] < this._layoutCache[key]) {
        rect[key] = this._layoutCache[key];
      } else {
        this._layoutCache[key] = rect[key];
      }
    });

    // outBounds
    if (this._autoIndentOnce && this._hasAutoIndent) {
      // use cache
      ['x1', 'x2', 'y1', 'y2'].forEach(key => {
        this.layout.getLastComputeOutBounds()[key] = this._layoutCache._lastComputeOutBounds[key];
      });
    } else {
      this._hasAutoIndent = true;
      ['x1', 'x2', 'y1', 'y2'].forEach(key => {
        if (this.layout.getLastComputeOutBounds()[key] < this._layoutCache._lastComputeOutBounds[key]) {
          this.layout.getLastComputeOutBounds()[key] = this._layoutCache._lastComputeOutBounds[key];
        } else {
          this._layoutCache._lastComputeOutBounds[key] = this.layout.getLastComputeOutBounds()[key];
        }
      });
    }

    return rect;
  }

  _clearLayoutCache() {
    this._hasAutoIndent = false;
    this._layoutCache.width = 0;
    this._layoutCache.height = 0;
    this._layoutCache._lastComputeOutBounds = { x1: 0, x2: 0, y1: 0, y2: 0 };
  }

  onDataUpdate(): void {
    // clear layout cache
    this._clearLayoutCache();
  }

  protected _transformSpec() {
    // change spec by default logic
    const chartSpec = this._option.getChart().getSpec();
    this._spec.inverse = transformInverse(this._spec, chartSpec.direction === Direction.horizontal);
  }

  private _appendAxisUnit(bounds: IBounds, isX: boolean) {
    if (this._spec.unit && this._spec.unit.visible) {
      const { text, style } = this._spec.unit;
      let pos;
      let unitTextStyle: any;
      if (isX) {
        pos = {
          x: bounds.x2,
          y: this.getLayoutStartPoint().y
        };
        unitTextStyle = {
          textAlign: 'left',
          textBaseline: 'middle'
        };
      } else {
        pos = {
          x: this.getLayoutStartPoint().x,
          y: bounds.y1
        };
        unitTextStyle = {
          textAlign: this._orient === 'left' ? 'left' : 'right',
          textBaseline: 'bottom'
        };
      }

      unitTextStyle = {
        ...unitTextStyle,
        ...style,
        x: pos.x,
        y: pos.y,
        text
      };
      if (this._unitText) {
        this._unitText.setAttributes(unitTextStyle);
      } else {
        this._unitText = createText(unitTextStyle);
        this._unitText.name = 'axis-unit';
        this.getContainer()?.add(this._unitText);
      }

      // 左轴
      const textBounds = this._unitText.AABBBounds;
      if (!isX) {
        bounds.x1 += textBounds.x1 < bounds.x1 ? textBounds.x1 - bounds.x1 : 0;
        bounds.y1 += textBounds.y1 < bounds.y1 ? textBounds.y1 - bounds.y1 : 0;
      } else {
        bounds.x2 += textBounds.x2 > bounds.x2 ? textBounds.x2 - bounds.x2 : 0;
        bounds.y2 += textBounds.y2 > bounds.y2 ? textBounds.y2 - bounds.y2 : 0;
      }
    }

    return bounds;
  }

  getVRenderComponents(): IGraphic[] {
    return this._unitText ? [this._unitText] : [];
  }
}
