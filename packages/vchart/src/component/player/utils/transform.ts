import type { ContinuousPlayerAttributes, DiscretePlayerAttributes, Datum } from '@visactor/vrender-components';
import type { IPlayer } from '../interface';
import type { IRectGraphicAttribute, ISymbolGraphicAttribute } from '@visactor/vrender';
import type { IRectMarkSpec, ISymbolMarkSpec } from '../../../typings';
import { transformToGraphic } from '../../../util/style';
import type { BaseGraphicAttributes } from '@visactor/vrender-components/es/core/type';

/**
 * IRectMarkSpec => IRectGraphicAttribute
 */
const rectToAttribute = (markSpec: IRectMarkSpec): IRectGraphicAttribute => {
  const result: IRectGraphicAttribute = {
    ...(markSpec as unknown as IRectGraphicAttribute)
  };

  // TODO: 是否要迁移到transformToGraphic ?
  if (markSpec.cornerRadius) {
    result.borderRadius = markSpec.cornerRadius;
  } else if (
    markSpec.cornerRadiusBottomLeft ||
    markSpec.cornerRadiusBottomRight ||
    markSpec.cornerRadiusTopLeft ||
    markSpec.cornerRadiusTopRight
  ) {
    result.borderRadius = [
      markSpec?.cornerRadiusTopLeft ?? 0,
      markSpec?.cornerRadiusTopRight ?? 0,
      markSpec?.cornerRadiusBottomRight ?? 0,
      markSpec?.cornerRadiusBottomLeft ?? 0
    ];
  }

  return transformToGraphic(result) as IRectGraphicAttribute;
};

/**
 * ISymbolMarkSpec => ISymbolGraphicAttribute
 */
const symbolToAttribute = (markSpec: ISymbolMarkSpec): ISymbolGraphicAttribute => {
  const result: ISymbolGraphicAttribute = {
    ...(markSpec as unknown as ISymbolGraphicAttribute)
  };

  return transformToGraphic(result) as ISymbolGraphicAttribute;
};

const baseToAttribute = <T>(spec: BaseGraphicAttributes<T>) => {
  const result: BaseGraphicAttributes<T> = {
    ...spec,
    style: {
      ...transformToGraphic(spec.style)
    }
  };
  return result;
};

const transformToAttrs = (spec: IPlayer) => {
  // slider
  const trackStyle = rectToAttribute(spec?.slider?.trackStyle ?? {});
  const railStyle = rectToAttribute(spec?.slider?.railStyle ?? {});
  const handlerStyle = symbolToAttribute(spec?.slider?.handlerStyle ?? {});

  // controllers
  const start = baseToAttribute<ISymbolMarkSpec>(spec?.controller?.start ?? {});
  const pause = baseToAttribute<ISymbolMarkSpec>(spec?.controller?.pause ?? {});
  const backward = baseToAttribute<ISymbolMarkSpec>(spec?.controller?.backward ?? {});
  const forward = baseToAttribute<ISymbolMarkSpec>(spec?.controller?.forward ?? {});

  return {
    ...spec,
    direction: spec.direction,
    interval: spec.interval,
    visible: spec.visible,
    orient: spec.orient,
    slider: {
      ...spec.slider,
      trackStyle: trackStyle,
      railStyle: railStyle,
      handlerStyle: handlerStyle
    },
    controller: {
      ...spec.controller,
      start: start,
      pause: pause,
      backward: backward,
      forward: forward
    }
  };
};

/**
 * 连续型播放器spec转换为Attrs
 */
export const transformContinuousSpecToAttrs = (spec: IPlayer, data: Datum[]): ContinuousPlayerAttributes => ({
  ...(transformToAttrs(spec) as any),
  data,
  type: 'continuous'
});

export const transformDiscreteSpecToAttrs = (spec: IPlayer, data: Datum[]): DiscretePlayerAttributes => ({
  ...(transformToAttrs(spec) as any),
  data,
  type: 'discrete'
});
