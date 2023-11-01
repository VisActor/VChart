import type { Dict, IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { throttle, PointService, isEqual, array, isArray, isNumber, get, isBoolean } from '@visactor/vutils';

import { RenderModeEnum } from '../../typings/spec/common';
import type { BaseEventParams, EventType } from '../../event/interface';
import type { IModelLayoutOption, IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base/base-component';
import type { IPadding, Maybe, StringOrNumber } from '../../typings';
import { outOfBounds } from '../../util/math';
import type { LayoutItem } from '../../model/layout-item';
import type { IComponentOption } from '../interface';
import type {
  ICrossHair,
  CrossHairTrigger,
  ICartesianCrosshairSpec,
  IPolarCrosshairSpec,
  ICrosshairTheme,
  ICrosshairCategoryFieldSpec
} from './interface';
import { Event_Bubble_Level, Event_Source_Type, LayoutZIndex } from '../../constant';
import { getDefaultCrosshairTriggerEventByMode } from './config';
import type { IPolarAxis } from '../axis/polar/interface';
import type { IAxis } from '../axis/interface';

type IBound = { x1: number; y1: number; x2: number; y2: number };
type IAxisInfo<T> = Map<number, IBound & { axis: T }>;

export interface IHair {
  /** 是否展示 crosshair 辅助图形 */
  visible: boolean;
  /** 类型 */
  type: 'rect' | 'line';
  /** 样式 */
  style?: Dict<any>;
  label?: {
    /** 文本是否可见 */
    visible: boolean;
    /** 格式化函数 */
    formatMethod?: (text: StringOrNumber | string[], position: string) => string | string[];
    /** 文本样式 */
    textStyle?: Dict<any>;
    minWidth?: number;
    maxWidth?: number;
    padding?: IPadding | number | number[];
    panel?: Dict<any>;
    zIndex?: number;
  };
}

const ORIENT_MAP = {
  x: ['top', 'bottom'],
  y: ['left', 'right'],
  category: ['angle'],
  value: ['radius']
};

export abstract class BaseCrossHair<T extends ICartesianCrosshairSpec | IPolarCrosshairSpec>
  extends BaseComponent<T>
  implements ICrossHair
{
  layoutType: LayoutItem['layoutType'] = 'absolute';
  gridZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.CrossHair_Grid;
  labelZIndex: LayoutItem['layoutZIndex'] = LayoutZIndex.CrossHair;
  trigger: CrossHairTrigger = 'hover';
  enable: boolean;
  showDefault: boolean;
  triggerOff: CrossHairTrigger | 'none' = 'hover'; // 为none则不消失

  protected declare _theme: Maybe<ICrosshairTheme>;

  get enableRemain(): boolean {
    return this.triggerOff === 'none';
  }

  protected _crosshairConfig: ICartesianCrosshairSpec | IPolarCrosshairSpec;
  private _limitBounds: Maybe<IBoundsLike>;

  constructor(spec: T, options: IComponentOption) {
    super(spec, {
      ...options
    });
    this.enable = true;
    this.showDefault = true;
  }

  protected abstract _showDefaultCrosshair(): void;
  protected abstract _layoutCrosshair(x: number, y: number): void;
  protected abstract _parseFieldInfo(): void;
  abstract hide(): void;

  protected _getLimitBounds() {
    if (!this._limitBounds) {
      const { width, height } = this._option.globalInstance.getChart()?.getCanvasRect() ?? {
        width: 0,
        height: 0
      };
      this._limitBounds = {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height
      };
    }
    return this._limitBounds;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._crosshairConfig = this._spec;
    this._parseCrosshairSpec();
  }

  created() {
    super.created();
    // event
    this._initEvent();
  }

  /**
   * updateSpec
   */
  _compareSpec() {
    const result = super._compareSpec();
    if (!result.reMake && !isEqual(this._originalSpec, this._spec)) {
      result.reRender = true;
      result.reMake = true;
    }
    return result;
  }

  protected _initEvent() {
    const triggerConfig = this._getTriggerEvent();
    if (triggerConfig) {
      const { in: triggerEvent, out: outTriggerEvent } = triggerConfig;
      array(triggerEvent).forEach((eventName, index) =>
        this._registerEvent(eventName, isArray(outTriggerEvent) ? outTriggerEvent[index] : outTriggerEvent)
      );
    }
  }

  private _registerEvent(inEventName: EventType, outEventName: EventType) {
    this.event.on(inEventName, { source: Event_Source_Type.chart }, this._handleEvent);
    this.event.on(outEventName, { level: Event_Bubble_Level.chart }, (...arg: any) => {
      if (this.enableRemain) {
        return;
      }
      this.hide();
    });
  }

  private _eventOff(eventName: EventType) {
    this.event.off(eventName, this._handleEvent);
  }

  updateLayoutAttribute() {
    this._limitBounds = null;
    this._showDefaultCrosshair();
  }

  private _handleEvent = throttle((params: any) => {
    const { event } = params as BaseEventParams;
    const x = (event as any).viewX - this.getLayoutStartPoint().x;
    const y = (event as any).viewY - this.getLayoutStartPoint().y;
    // 索引到datum
    this.showDefault = false;
    this._layoutCrosshair(x, y);
  }, 10);

  private _getTriggerEvent() {
    const { mode = RenderModeEnum['desktop-browser'] } = this._option;
    const triggerConfig = getDefaultCrosshairTriggerEventByMode(mode);
    if (triggerConfig) {
      const trigger = this.trigger || 'hover';
      const outTrigger = (trigger: CrossHairTrigger) => (trigger === 'click' ? 'clickOut' : 'hoverOut');
      if (isArray(trigger)) {
        // 同时配置了多个触发事件
        let inResult: string[] = [];
        let outResult: string[] = [];
        trigger.forEach(item => {
          inResult = inResult.concat(triggerConfig[item]);
          outResult = outResult.concat(triggerConfig[outTrigger(item)]);
        });
        return {
          in: inResult,
          out: outResult
        };
      }
      return {
        in: triggerConfig[trigger],
        out: triggerConfig[outTrigger(trigger)]
      };
    }
    return null;
  }

  protected _getAxisInfoByField<T = IAxis>(field: 'x' | 'y' | 'category' | 'value') {
    // 加判空防止某些特殊时刻（如 updateSpec 时）鼠标滑过图表导致报错
    const axesComponents = this._option?.getComponentsByKey?.('axes') as IAxis[];
    if (!axesComponents?.length) {
      return null;
    }
    let bindingAxesIndex: number[] = get(this._spec, `${field}Field.bindingAxesIndex`);
    if (!bindingAxesIndex) {
      bindingAxesIndex = [];
      axesComponents.forEach((item, index) => {
        if (ORIENT_MAP[field].includes(item.getOrient())) {
          bindingAxesIndex.push(index);
        }
      });
    }
    if (!bindingAxesIndex.length) {
      return null;
    }

    const map: IAxisInfo<T> = new Map();
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    const { x: sx, y: sy } = this.getLayoutStartPoint();
    bindingAxesIndex.forEach(idx => {
      (x1 = Infinity), (y1 = Infinity), (x2 = -Infinity), (y2 = -Infinity);
      const axis = axesComponents.find(axis => axis.getSpecIndex() === idx);
      if (!axis) {
        return;
      }
      const regions = axis.getRegions();
      regions.forEach(r => {
        x1 = Math.min(x1, r.getLayoutStartPoint().x - sx);
        y1 = Math.min(y1, r.getLayoutStartPoint().y - sy);
        x2 = Math.max(x2, r.getLayoutStartPoint().x + r.getLayoutRect().width - sx);
        y2 = Math.max(y2, r.getLayoutStartPoint().y + r.getLayoutRect().height - sy);
      });
      map.set(idx, { x1, y1, x2, y2, axis: axis as unknown as T });
    });

    return map;
  }

  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  onLayoutEnd(ctx: IModelLayoutOption): void {
    this.setLayoutRect(this._regions[0].getLayoutRect());
    this.setLayoutStartPosition(this._regions[0].getLayoutStartPoint());

    super.onLayoutEnd(ctx);
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }

  protected _releaseEvent(): void {
    const triggerConfig = this._getTriggerEvent();
    if (triggerConfig) {
      const { in: triggerEvent, out: outTriggerEvent } = triggerConfig;
      if (isArray(triggerEvent)) {
        triggerEvent.forEach(eachTriggerEvent => this._eventOff(eachTriggerEvent));
      } else {
        this._eventOff(triggerEvent);
      }
      if (isArray(outTriggerEvent)) {
        outTriggerEvent.forEach(eachTriggerEvent => this._eventOff(eachTriggerEvent));
      } else {
        this._eventOff(outTriggerEvent);
      }
    }
  }

  protected _firstSeries<T>(): T | null {
    for (let i = 0; i < this._regions.length; i++) {
      const r = this._regions[i];
      const series = r.getSeries();
      for (let j = 0; j < series.length; j++) {
        const s = series[j];
        if (s) {
          return s as unknown as T;
        }
      }
    }
    return null;
  }

  protected _parseCrosshairSpec() {
    this._parseFieldInfo();

    const { trigger, triggerOff, labelZIndex, gridZIndex } = this._crosshairConfig;
    if (trigger) {
      this.trigger = trigger;
    }
    if (triggerOff) {
      this.triggerOff = triggerOff;
    } else {
      this.triggerOff = this.trigger;
    }
    if (labelZIndex !== undefined) {
      this.labelZIndex = labelZIndex;
    }
    if (gridZIndex !== undefined) {
      this.gridZIndex = gridZIndex;
    }
  }

  protected _parseField(field: ICrosshairCategoryFieldSpec, fieldName: string) {
    const hair = {} as any;
    const { line, label, visible } = field;
    hair.visible = visible;
    hair.type = line?.type || 'line';
    const style = line?.style || {};
    const { strokeOpacity, fillOpacity, opacity, stroke, fill, lineWidth, ...restStyle } = style as any;
    const isLineType = hair.type === 'line';
    let finalOpacity = isLineType ? strokeOpacity : fillOpacity;
    if (isNumber(opacity)) {
      finalOpacity = (finalOpacity ?? 1) * opacity;
    }
    hair.style = {
      opacity: finalOpacity,
      pickable: false,
      visible: isBoolean(line?.visible) ? line.visible : true,
      ...restStyle
    };
    if (isLineType) {
      hair.style.stroke = stroke || fill;
      hair.style.lineWidth = line?.width || lineWidth || 2;
    } else {
      hair.style.fill = fill || stroke;

      if (this._originalSpec[fieldName]?.line?.style?.stroke) {
        hair.style.stroke = this._originalSpec[fieldName].line.style.stroke;
      }
      if (typeof line.width === 'string') {
        const percent = parseInt(line.width.substring(0, line.width.length - 1), 10) / 100;
        hair.style.sizePercent = percent;
      } else if (typeof line?.width === 'number') {
        hair.style.size = line.width;
      }
    }
    const labelBackground = label?.labelBackground;
    const labelStyle = label?.style || {};
    const { fill: rectFill = 'rgba(47, 59, 82, 0.9)', stroke: rectStroke, ...rectStyle } = labelBackground?.style || {};
    hair.label = {
      visible: !!label?.visible,
      formatMethod: label?.formatMethod,
      minWidth: labelBackground?.minWidth,
      maxWidth: labelBackground?.maxWidth,
      padding: labelBackground?.padding,
      textStyle: {
        fontSize: 14,
        pickable: false,
        ...labelStyle,
        fill: labelStyle?.fill ?? '#fff',
        stroke: get(labelStyle, 'stroke')
      },
      panel: {
        visible: isBoolean(labelBackground?.visible) ? labelBackground?.visible : !!labelBackground,
        pickable: false,
        fill: rectFill,
        stroke: rectStroke,
        ...rectStyle
      },
      zIndex: this.labelZIndex,
      childrenPickable: false,
      pickable: false
    };

    return hair;
  }

  protected _filterAxisByPoint<T>(axisMap: IAxisInfo<T>, relativeX: number, relativeY: number) {
    axisMap &&
      axisMap.forEach((item, i) => {
        const axis = item.axis as unknown as IAxis | IPolarAxis;
        if (outOfBounds(item, relativeX, relativeY)) {
          axisMap.delete(axis.getSpecIndex());
        }
        if ((axis as IPolarAxis).type.startsWith('polarAxis')) {
          // 极坐标下需要判断是否在半径内
          const center = (axis as IPolarAxis).getCenter();
          const innerRadius = (axis as IPolarAxis).getInnerRadius();
          const outerRadius = (axis as IPolarAxis).getOuterRadius();
          const distance = PointService.distancePP({ x: relativeX, y: relativeY }, center);
          if (distance > outerRadius || distance < innerRadius) {
            axisMap.delete((axis as IPolarAxis).getSpecIndex());
          }
        }
      });
    return axisMap;
  }
}
