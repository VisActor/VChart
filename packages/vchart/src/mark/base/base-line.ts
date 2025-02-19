import { isValidScaleType } from '@visactor/vscale';
import type { StateValueType } from '../../compile/mark';
import type { ConvertToMarkStyleSpec, ILineLikeMarkSpec } from '../../typings/visual';
import type { IPointLike } from '@visactor/vutils';
import { isFunction, isNil } from '@visactor/vutils';
import { BaseMark } from './base-mark';
import type { IMarkGraphic, IMarkStyle } from '../interface';
import type { Datum } from '../../typings/common';
import type { ILine, ILineGraphicAttribute } from '@visactor/vrender-core';
import { isSegmentAttrEqual } from '../utils/line';
import type { IMarkSpec } from '../../typings/spec/common';

export const LINE_SEGMENT_ATTRIBUTES = [
  'stroke',
  'strokeOpacity',
  'lineDash',
  'lineDashOffset',
  'lineCap',
  'lineJoin',
  'lineWidth',
  'miterLimit'
];

export abstract class BaseLineMark<T extends ILineLikeMarkSpec = ILineLikeMarkSpec> extends BaseMark<T> {
  protected abstract _getIgnoreAttributes(): string[];

  protected _getSegmentAttributes() {
    return LINE_SEGMENT_ATTRIBUTES;
  }

  protected _segmentStyleKeys: string[] = [];

  initStyleWithSpec(spec: IMarkSpec<T>) {
    this._segmentStyleKeys = [];

    super.initStyleWithSpec(spec);
  }
  /**
   * @override
   * 之所以覆写是因为 vgrammar 侧默认都会处理 lineSegments，非常耗性能，所以需要 VChart 给一个标志位用于是否执行。
   * 由外部series调用，设置markStyle的接口。
   * @param style
   * @param level
   * @param state
   */
  setStyle<T>(
    style: Partial<ConvertToMarkStyleSpec<T>> | Partial<IMarkStyle<T>>,
    state: StateValueType = 'normal',
    level: number = 0
  ): void {
    if (isNil(style)) {
      return;
    }

    if (this.stateStyle[state] === undefined) {
      this.stateStyle[state] = {};
    }

    const ignoreAttributes = this._getIgnoreAttributes();
    const segmentAttributes = this._getSegmentAttributes();
    const isUserLevel = this.isUserLevel(level);

    Object.keys(style).forEach(attr => {
      const attrStyle = (style as any)[attr];
      if (isNil(attrStyle) || ignoreAttributes.includes(attr)) {
        return;
      }
      if (
        isUserLevel &&
        segmentAttributes.includes(attr) &&
        (isValidScaleType(attrStyle?.type) || attrStyle?.scale || isFunction(attrStyle))
      ) {
        if (!this._segmentStyleKeys.includes(attr)) {
          this._segmentStyleKeys.push(attr);
        }
      }

      const styleConverter = this._filterAttribute(attr as any, attrStyle, state, level, isUserLevel);

      this.setAttribute(attr as any, styleConverter, state, level);
    });
  }

  _isValidPointChannel = (channel: string) => {
    return ['x', 'y', 'defined'].includes(channel);
  };

  _getLineSegments(items: any[], points: IPointLike[]) {
    if (!this._segmentStyleKeys || !this._segmentStyleKeys.length) {
      return null;
    }

    const segments: { attrs: any; startIndex: number; endIndex?: number }[] = [];
    let prevSegmentAttrs: any = null;

    items.forEach((item, index) => {
      if (
        !prevSegmentAttrs ||
        !this._segmentStyleKeys.every(key => {
          return isSegmentAttrEqual(prevSegmentAttrs[key], item[key], key);
        })
      ) {
        if (segments.length) {
          segments[segments.length - 1].endIndex = index;
        }

        prevSegmentAttrs = item;
        segments.push({
          attrs: prevSegmentAttrs,
          startIndex: index
        });
      }
    });

    if (segments.length >= 2) {
      return segments.map(entry => {
        return {
          ...entry.attrs,
          points: points.slice(entry.startIndex, isNil(entry.endIndex) ? points.length : entry.endIndex)
        };
      });
    }

    return null;
  }

  _getPrevPoints(g: ILine) {
    const { points, segments } = g.attribute;

    return (
      points ??
      (segments
        ? segments.reduce((res: IPointLike[], seg: ILineGraphicAttribute) => {
            if (seg.points) {
              seg.points.forEach((point: IPointLike) => {
                res.push(point);
              });
            }

            return res;
          }, [])
        : null)
    );
  }

  _runPointsEncoder(newStyles: Record<string, (datum: Datum) => any>, g: IMarkGraphic, attrs: any = {}) {
    const data = g.context.data;
    const lineAttrs: any[] = [];
    const points: IPointLike[] = [];
    const commonAttrs: any = {};

    data.forEach((datum: Datum, index: number) => {
      points[index] = {} as IPointLike;
      lineAttrs[index] = {};

      Object.keys(newStyles).forEach(attrName => {
        if (this._isValidPointChannel(attrName)) {
          (points[index] as any)[attrName] = newStyles[attrName](datum);
        } else if (this._segmentStyleKeys.includes(attrName)) {
          lineAttrs[index][attrName] = newStyles[attrName](datum);
        } else if (index === 0) {
          commonAttrs[attrName] = newStyles[attrName](datum);
        }
      });

      // todo 上下文，似乎是动画相关的
      (points[index] as any).context = this._keyGetter(datum) ?? index;
    });

    if (this._segmentStyleKeys && this._segmentStyleKeys.length) {
      const segments = this._getLineSegments(lineAttrs, points);

      if (segments) {
        return {
          ...commonAttrs,
          ...lineAttrs[0],
          segments,
          points: null as IPointLike[]
        };
      }
    }

    return {
      ...commonAttrs,
      ...lineAttrs[0],
      points,
      segments: null as any[]
    };
  }

  _runEncoderOfGraphic(newStyles: Record<string, (datum: Datum) => any>, g: IMarkGraphic, attrs: any = {}) {
    const data = g.context.data;
    if (newStyles && Object.keys(newStyles).some(this._isValidPointChannel) && data && data.length) {
      return this._runPointsEncoder(newStyles, g, attrs);
    }

    return super._runEncoderOfGraphic(newStyles, g, attrs);
  }

  protected _getDataByKey(data: Datum[]) {
    return this._dataByGroup;
  }
}
