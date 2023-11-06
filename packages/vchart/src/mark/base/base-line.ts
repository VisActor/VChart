import { isValidScaleType } from '@visactor/vscale';
import type { StateValueType } from '../../compile/mark';
import type { ConvertToMarkStyleSpec, ILineLikeMarkSpec } from '../../typings/visual';
import { isFunction, isNil } from '@visactor/vutils';
import { BaseMark } from './base-mark';
import type { IMarkStyle, StyleConvert } from '../interface';

export abstract class BaseLineMark<T extends ILineLikeMarkSpec = ILineLikeMarkSpec> extends BaseMark<T> {
  protected abstract _getIgnoreAttributes(): string[];

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
    level: number = 0,
    stateStyle = this.stateStyle
  ): void {
    if (isNil(style)) {
      return;
    }

    if (stateStyle[state] === undefined) {
      stateStyle[state] = {};
    }

    const ignoreAttributes = this._getIgnoreAttributes();
    const segmentAttributes = [
      'strokeWidth',
      'lineWidth',
      'lineDash',
      'strokeDash',
      'lineJoin',
      'stroke',
      'strokeOpacity',
      'opacity',
      'fill',
      'fillOpacity',
      'texture',
      'texturePadding',
      'textureSize',
      'textureColor'
    ];
    const isUserLevel = this.isUserLevel(level);
    let enableSegments = false;
    Object.keys(style).forEach(attr => {
      const attrStyle = style[attr];
      if (isNil(attrStyle) || ignoreAttributes.includes(attr)) {
        return;
      }
      if (
        isUserLevel &&
        segmentAttributes.includes(attr) &&
        (isValidScaleType(attrStyle?.type) || attrStyle?.scale || isFunction(attrStyle))
      ) {
        enableSegments = true;
      }

      let styleConverter = this._styleConvert(attrStyle);

      if (isUserLevel && attr === 'angle') {
        styleConverter = this.convertAngleToRadian(styleConverter as StyleConvert<number>);
      }

      this.setAttribute(attr as any, styleConverter, state, level, stateStyle);
    });

    if (enableSegments) {
      this.setAttribute('enableSegments', true, state, level, stateStyle);
    }
  }
}
