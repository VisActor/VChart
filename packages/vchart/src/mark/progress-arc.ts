import { Factory } from './../core/factory';
import { isFunction, isValid } from '@visactor/vutils';
import type { DataView } from '@visactor/vdataset';
import type { StateValueType } from '../typings/spec';
import type { ConvertToMarkStyleSpec, IProgressArcMarkSpec } from '../typings/visual';
import type { IMarkRaw, IMarkStateStyle, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { BaseArcMark } from './arc';
import type { IAttributeOpt } from '../compile/mark/interface';
import { registerVGrammarArcAnimation } from '../animation/config';
import { registerArcGraphic } from '@visactor/vgrammar-core';

export type IProgressArcMark = IMarkRaw<IProgressArcMarkSpec>;

export class ProgressArcMark extends BaseArcMark<IProgressArcMarkSpec> implements IProgressArcMark {
  static readonly type = MarkTypeEnum.arc;
  static readonly constructorType = MarkTypeEnum.progressArc;

  protected _cacheStateStyle: IMarkStateStyle<IProgressArcMarkSpec> = {};

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IProgressArcMarkSpec> = {
      ...super._getDefaultStyle(),
      innerPadding: 0,
      outerPadding: 0
    };
    return defaultStyle;
  }

  protected _filterStyle(
    style: Partial<IMarkStyle<IProgressArcMarkSpec>>,
    state: StateValueType,
    level: number,
    stateStyle = this.stateStyle
  ): Partial<ConvertToMarkStyleSpec<IProgressArcMarkSpec>> | Partial<IMarkStyle<IProgressArcMarkSpec>> {
    // 记录 radius 缓存
    if (isValid(style.innerRadius)) {
      this.setAttribute(
        'innerRadius',
        this._styleConvert<'innerRadius'>(style.innerRadius),
        state,
        level,
        this._cacheStateStyle
      );
    }
    if (isValid(style.outerRadius)) {
      this.setAttribute(
        'outerRadius',
        this._styleConvert<'innerRadius'>(style.outerRadius),
        state,
        level,
        this._cacheStateStyle
      );
    }

    const innerPadding = style.innerPadding ?? stateStyle[state]?.innerPadding?.style;
    const outerPadding = style.outerPadding ?? stateStyle[state]?.outerPadding?.style;
    const innerRadius =
      style.innerRadius ?? this._cacheStateStyle[state]?.innerRadius?.style ?? stateStyle[state]?.innerRadius?.style;
    const outerRadius =
      style.outerRadius ?? this._cacheStateStyle[state]?.outerRadius?.style ?? stateStyle[state]?.outerRadius?.style;

    if (innerRadius === 0 && outerRadius === 0) {
      return style;
    }

    // 情况一：本次改动了 padding
    const paddingModified =
      (isValid(style.innerPadding) && isValid(innerRadius)) || (isValid(style.outerPadding) && isValid(outerRadius));

    // 情况二：本次改动了 radius，但是 padding 已经提前设置且不为 0
    const radiusModified = (isValid(style.innerRadius) && innerPadding) || (isValid(style.outerRadius) && outerPadding);

    // 如果触发任意一种情况，则重新计算 radius
    if (paddingModified || radiusModified) {
      const newStyle = Object.assign({}, style);

      if (innerPadding && isValid(innerRadius)) {
        // 将 innerPadding 应用到 innerRadius
        if (isFunction(innerRadius)) {
          newStyle.innerRadius = (item: any, ctx: any, opt?: IAttributeOpt, source?: DataView) => {
            const result = innerRadius(item, ctx, opt, source) as number;
            const padding = isFunction(innerPadding)
              ? (innerPadding(item, ctx, opt, source) as number)
              : (innerPadding as number);
            return result + padding;
          };
        } else {
          if (isFunction(innerPadding)) {
            newStyle.innerRadius = (item: any, ctx: any, opt?: IAttributeOpt, source?: DataView) => {
              const padding = innerPadding(item, ctx, opt, source) as number;
              return (innerRadius as number) + padding;
            };
          } else {
            newStyle.innerRadius = (innerRadius as number) + (innerPadding as number);
          }
        }
      }

      if (outerPadding && isValid(outerRadius)) {
        // 将 outerPadding 应用到 outerRadius
        if (isFunction(outerRadius)) {
          newStyle.outerRadius = (item: any, ctx: any, opt?: IAttributeOpt, source?: DataView) => {
            const result = outerRadius(item, ctx, opt, source) as number;
            const padding = isFunction(outerPadding)
              ? (outerPadding(item, ctx, opt, source) as number)
              : (outerPadding as number);
            return result - padding;
          };
        } else {
          if (isFunction(outerPadding)) {
            newStyle.outerRadius = (item: any, ctx: any, opt?: IAttributeOpt, source?: DataView) => {
              const padding = outerPadding(item, ctx, opt, source) as number;
              return (outerRadius as number) - padding;
            };
          } else {
            newStyle.outerRadius = (outerRadius as number) - (outerPadding as number);
          }
        }
      }

      return newStyle;
    }

    return style;
  }
}

export const registerProgressArcMark = () => {
  registerArcGraphic();
  registerVGrammarArcAnimation();
  Factory.registerMark(ProgressArcMark.constructorType, ProgressArcMark);
};
