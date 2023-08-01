/**
 * @todo vgrammar axis 支持 mode: '3d' 配置传入
 */
import type { IBounds, IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { IEffect, IModelInitOption, ILayoutRect } from '../../../model/interface';
import type { ICartesianSeries } from '../../../series/interface';
import type { IRegion } from '../../../region/interface';
import type { IAxisLocationCfg, ICartesianAxisCommonSpec, IAxisHelper, ICartesianAxisCommonTheme } from './interface';
import { isArray, isValid, isValidNumber, merge, eachSeries, getFieldAlias, isNil } from '../../../util';
import type { IOrientType } from '../../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../typings/space';
import type { IBaseScale, ILinearScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import type { LayoutItem } from '../../../model/layout-item';
import { Factory } from '../../../core/factory';
import { autoAxisType, isXAxis, getOrient, isZAxis, isYAxis } from './util';
import { ChartEvent, DEFAULT_LAYOUT_RECT_LEVEL, LayoutZIndex } from '../../../constant';
import { LayoutLevel } from '../../../constant/index';
import pluginMap from '../../../plugin/components';
import type { IPoint, StringOrNumber } from '../../../typings';
import type { IComponentOption } from '../../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../../interface';
import { HOOK_EVENT } from '@visactor/vgrammar';
import type { LineAxisAttributes } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { isValidCartesianAxis } from '../utils';
import type { IAxis, ITick } from '../interface';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../../data/register';
import { scaleParser } from '../../../data/parser/scale';
import type { ICartesianTickDataOpt } from '../../../data/transforms/tick-data';
// eslint-disable-next-line no-duplicate-imports
import { ticks } from '../../../data/transforms/tick-data';
import type { DataSet } from '@visactor/vdataset';
// eslint-disable-next-line no-duplicate-imports
import { DataView } from '@visactor/vdataset';
import { CompilableData } from '../../../compile/data';
import { AxisComponent } from '../base-axis';

const CartesianAxisPlugin = [pluginMap.AxisLabelOverlapPlugin, pluginMap.AxisSyncPlugin];

export abstract class CartesianAxis<T extends ICartesianAxisCommonSpec = ICartesianAxisCommonSpec>
  extends AxisComponent<T>
  implements IAxis
{
  static type = ComponentTypeEnum.cartesianAxis;
  type = ComponentTypeEnum.cartesianAxis;
  name: string = ComponentTypeEnum.cartesianAxis;

  // 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
  declare directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';

  layoutType: LayoutItem['layoutType'] = 'region-relative';
  layoutZIndex: number = LayoutZIndex.Axis;
  layoutLevel: number = LayoutLevel.Axis;

  protected _dataSet: DataSet;

  layout3dBox?: { width: number; height: number; length: number };

  protected _orient: IOrientType = 'left';
  get orient() {
    return this._orient;
  }

  get layoutOrient() {
    return this._layoutOrient;
  }
  set layoutOrient(v: IOrientType) {
    this._orient = v;
    this._layoutOrient = v;
  }

  protected _scales: IBaseScale[] = [];
  getScales() {
    return this._scales;
  }

  protected declare _theme: ICartesianAxisCommonTheme;

  protected _statisticsDomain: {
    domain: any[];
    index: { [key in StringOrNumber]: number };
  } = { domain: [], index: {} };
  getStatisticsDomain() {
    return this._statisticsDomain;
  }

  protected _tick: ITick | undefined = undefined;

  private _axisStyle: Partial<LineAxisAttributes>;
  private _latestBounds: IBounds;
  private _verticalLimitSize: number;

  constructor(spec: T, options: IComponentOption) {
    super(spec, {
      ...options
    });
    this._orient = getOrient(spec, ['z']);
    if (isZAxis(this._orient)) {
      this.layoutType = 'absolute';
    }
    isValid(spec.autoIndent) && (this._autoIndent = spec.autoIndent);
    this._layoutOrient = this._orient;
    this._dataSet = options.dataSet;
  }

  static createAxis(spec: any, options: IComponentOption, isHorizontal: boolean = false): IAxis {
    const axisType = spec.type ?? autoAxisType(spec.orient, isHorizontal);
    const componentName = `${CartesianAxis.type}-${axisType}`;
    const C = Factory.getComponentInKey(componentName);
    if (C) {
      // 这里处理下 direction === 'horizontal' 下的 Y 轴
      // 因为 Y 轴绘制的时候默认是从下至上绘制的，但是在 direction === 'horizontal' 场景下，图表应该是按照从上至下阅读的
      // 所以这里在这种场景下坐标轴会默认 inverse 已达到效果
      let inverse = spec.inverse;
      if (isHorizontal && !isXAxis(spec.orient)) {
        inverse = isValid(spec.inverse) ? !spec.inverse : true;
      }
      return new C(
        {
          ...spec,
          inverse
        },
        options
      ) as IAxis;
    }
    options.onError(`Component ${componentName} not found`);
    return null;
  }

  static createComponent(spec: any, options: IComponentOption) {
    if (!this.type.startsWith(CartesianAxis.type)) {
      return null;
    }
    const regions = options.getRegionsInIndex();
    if (regions.find(r => r.coordinate !== 'cartesian')) {
      return null;
    }
    let axesSpec = spec[CartesianAxis.specKey] || options.defaultSpec;
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
            specIndex: i,
            specKey: CartesianAxis.specKey
          },
          isHorizontal
        ) as IAxis
      );
    });
    return axes;
  }

  setLayout3dBox(box3d: { width: number; height: number; length: number }) {
    this.layout3dBox = box3d;
  }

  effect: IEffect = {
    scaleUpdate: () => {
      this.computeData();
      eachSeries(
        this._regions,
        s => {
          if (isXAxis(this.orient)) {
            (s as ICartesianSeries).setXAxisHelper(this.axisHelper());
          } else if (isYAxis(this.orient)) {
            (s as ICartesianSeries).setYAxisHelper(this.axisHelper());
          } else if (isZAxis(this.orient)) {
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
  abstract dataToPosition(values: any[], cfg?: IAxisLocationCfg): number;
  abstract valueToPosition(value: any): number;

  protected updateScaleRange() {
    let isScaleChange = false;
    const { width, height } = this.getLayoutRect();
    const inverse = this._spec.inverse;
    let newRange: number[] = [];
    if (isXAxis(this.orient)) {
      if (isValidNumber(width)) {
        newRange = inverse ? [width, 0] : [0, width];
      }
    } else if (isZAxis(this.orient)) {
      if (isValidNumber(width)) {
        // TODO 这里需要设置布局
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

    const isX = isXAxis(this.orient);
    if (isX) {
      if (isNil(this._spec.maxHeight)) {
        this._spec.maxHeight = '30%';
      }
    } else if (isNil(this._spec.maxWidth)) {
      this._spec.maxWidth = '30%';
    }

    const axisStyle: any = this._getAxisAttributes();
    axisStyle.label.formatMethod = this.getLabelFormatMethod();
    axisStyle.verticalFactor = this.orient === 'top' || this.orient === 'right' ? -1 : 1;
    this._axisStyle = axisStyle;

    this._tick = this._spec.tick;
  }

  protected getSeriesStatisticsField(s: ICartesianSeries) {
    let f: string[];
    if (isXAxis(this.orient)) {
      f = s.fieldX;
    } else if (isZAxis(this.orient)) {
      f = s.fieldZ;
    } else {
      f = s.fieldY;
    }
    if (isContinuous(this._scale.type)) {
      return f;
    }
    return [f[0]];
  }

  protected _initData() {
    registerDataSetInstanceParser(this._option.dataSet, 'scale', scaleParser);
    registerDataSetInstanceTransform(this._option.dataSet, 'ticks', ticks);

    const label = this._spec.label || {};
    const tick = this._tick || {};
    const tickData = new DataView(this._option.dataSet)
      .parse(this._scale, {
        type: 'scale'
      })
      .transform(
        {
          type: 'ticks',
          options: {
            sampling: this._spec.sampling !== false, // default do sampling
            tickCount: tick.tickCount,
            forceTickCount: tick.forceTickCount,
            tickStep: tick.tickStep,

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

  protected axisHelper(): IAxisHelper {
    const getScale = (depth: number = 0) => {
      return this._scales[depth];
    };
    return {
      dataToPosition: this.dataToPosition.bind(this),
      getScale,
      // TODO 轴可以设置domain
      getStatisticsDomain: () => this.getStatisticsDomain(),
      getAxisType: () => this.type,
      getAxisId: () => this.id
    };
  }

  /** LifeCycle API**/
  afterCompile() {
    const product = this.getMarks()[0]?.getProduct();
    if (product) {
      product.addEventListener(HOOK_EVENT.AFTER_ELEMENT_ENCODE, () => {
        if (this._isLayout === false) {
          // 布局结束之后再进行插件的调用
          // 插件在布局后
          if (isXAxis(this.orient)) {
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

          // 代理组件上的事件，目前坐标轴组件比较特殊，包含了网格线，但是事件这块只提供不包含网格线部分的响应
          this._delegateAxisContainerEvent(product.getGroupGraphicItem());
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
      this.event.emit(ChartEvent.scaleUpdate, { model: this });
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
          this.orient === 'left' || this.orient === 'right'
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
          if (isXAxis(this.orient)) {
            field = (s as ICartesianSeries).fieldX2
              ? [...(s as ICartesianSeries).fieldX, (s as ICartesianSeries).fieldX2]
              : (s as ICartesianSeries).fieldX;
          } else if (isZAxis(this.orient)) {
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
    eachSeries(
      this._regions,
      s => {
        if (isXAxis(this.orient)) {
          (s as ICartesianSeries).setScaleX(this._scale);
          (s as ICartesianSeries).setXAxisHelper(this.axisHelper());
        } else if (isYAxis(this.orient)) {
          (s as ICartesianSeries).setScaleY(this._scale);
          (s as ICartesianSeries).setYAxisHelper(this.axisHelper());
        } else if (isZAxis(this.orient)) {
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

  setLayoutStartPosition(pos: Partial<IPoint>): void {
    let { x, y } = pos;

    if (isValidNumber(x)) {
      x += Number(this._orient === 'left') * this.getLayoutRect().width;
    }
    if (isValidNumber(y)) {
      y += Number(this._orient === 'top') * this.getLayoutRect().height;
    }
    super.setLayoutStartPosition({ x, y });
  }

  computeBoundsInRect(rect: ILayoutRect) {
    const result = super.computeBoundsInRect(rect);
    if (!this._visible) {
      return result;
    }
    const bounds = this._latestBounds.clone().translate(-this.getLayoutStartPoint().x, -this.getLayoutStartPoint().y);
    switch (this._layoutOrient) {
      case 'left':
        if (this._layoutRectLevelMap.width === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.width = bounds.x1 < 0 ? -bounds.x1 : 0;
        }
        break;
      case 'right':
        if (this._layoutRectLevelMap.width === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.width = bounds.x2 > 0 ? bounds.x2 : 0;
        }
        break;
      case 'top':
        if (this._layoutRectLevelMap.height === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.height = bounds.y1 < 0 ? -bounds.y1 : 0;
        }
        break;
      case 'bottom':
        if (this._layoutRectLevelMap.height === DEFAULT_LAYOUT_RECT_LEVEL) {
          result.height = bounds.y2 > 0 ? bounds.y2 : 0;
        }
        break;
      default:
        break;
    }
    result.width = Math.ceil(result.width);
    result.height = Math.ceil(result.height);
    return result;
  }
  /**
   * bounds 预计算
   * @param rect
   * @returns
   */
  boundsInRect(rect: ILayoutRect): IBoundsLike {
    let result: IBoundsLike = { x1: 0, y1: 0, x2: 0, y2: 0 };
    if (!this._visible) {
      return result;
    }
    this._verticalLimitSize = isXAxis(this.orient) ? rect.height : rect.width;

    this.setLayoutRect(rect);
    this.updateScaleRange();
    this.computeData();
    const isX = isXAxis(this.orient);
    const context = { skipLayout: false };

    if (isX) {
      // 钩子直接传 vchart 的 component 实例
      this.pluginService &&
        this.callPlugin(plugin => {
          plugin.onWillLayoutHorizontal && plugin.onWillLayoutHorizontal(this.pluginService, context, this);
        });
    } else {
      this.pluginService &&
        this.callPlugin(plugin => {
          plugin.onWillLayoutVertical && plugin.onWillLayoutVertical(this.pluginService, context, this);
        });
    }
    const product = this.getMarks()[0].getProduct();
    this._latestBounds = product.getBounds();
    if (!context.skipLayout) {
      const attrs = this._getUpdateAttribute(true);
      const axisComponent = product.getGroupGraphicItem();
      const updateBounds = axisComponent.getBoundsWithoutRender(
        merge({ ...this.getLayoutStartPoint() }, this._axisStyle, attrs)
      );
      if (isFinite(updateBounds.width())) {
        result = updateBounds;
        this._latestBounds = updateBounds;
      }
    }
    return result;
  }

  updateLayoutAttribute(): void {
    if (!this.visible) {
      return;
    }
    // 正式的更新布局属性
    const attrs = this._getUpdateAttribute(false);
    const product = this.getMarks()[0].getProduct(); // 获取语法元素
    const axisAttrs = merge({ ...this.getLayoutStartPoint() }, this._axisStyle, attrs);
    product.encode(axisAttrs);

    super.updateLayoutAttribute();
  }

  private _getTitleLimit(isX: boolean) {
    if (this._spec.title.visible && isNil(this._spec.title.style?.maxLineWidth)) {
      const angle = this._spec.title.style?.angle || 0;
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
      return {
        start: { x: 0, y: 0 },
        end: { x: depth, y: 0 },
        z: z,
        alpha,
        anchor3d,
        grid: {
          type: 'line',
          depth: depthZ,
          length: regionHeight,
          visible: this._spec.grid.visible && !ignoreGrid
        },
        title: {
          text: this._spec.title.text || this._dataFieldText,
          maxWidth: this._getTitleLimit(isX)
        },
        items: this.getLabelItems(width)
      } as LineAxisAttributes;
    }
    const attrs: LineAxisAttributes = {
      start: { x: 0, y: 0 },
      end,
      grid: {
        type: 'line',
        depth,
        length: gridLength,
        visible: this._spec.grid.visible && !ignoreGrid
      },
      title: {
        text: this._spec.title.text || this._dataFieldText,
        maxWidth: this._getTitleLimit(isX)
      },
      items: this.getLabelItems(axisLength),
      verticalLimitSize: this._verticalLimitSize
    };

    return attrs;
  }

  protected initEvent() {
    super.initEvent();

    if (this.visible) {
      // 布局结束之后处理 0 基线问题
      this.event.on(ChartEvent.layoutEnd, this._fixAxisOnZero);
    }
  }

  private _fixAxisOnZero = () => {
    // 在布局结束之后调整坐标轴零基线
    const { onZero, visible } = this._spec.domainLine;
    if (this.visible && onZero && visible !== false) {
      const { onZeroAxisId, onZeroAxisIndex } = this._spec.domainLine;
      const axesComponents = this._option.getComponentsByKey('axes') as IAxis[];
      const isX = isXAxis(this.orient);

      // 判断坐标轴是否可用
      const isValidAxis = (item: any) => {
        return (
          (isX ? !isXAxis(item.orient) : isXAxis(item.orient)) &&
          isContinuous(item.getScale().type) &&
          (item.getScale() as ILinearScale).ticks().includes(0)
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
          const axisMark = this.getMarks()[0].getProduct();
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
}
