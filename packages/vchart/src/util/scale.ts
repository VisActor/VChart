/**
 * @description Scale 相关的工具函数
 */
import { isString, isValid } from '@visactor/vutils';
import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from '../scale/interface';
import { type IBaseScale, BandScale, LinearScale, OrdinalScale, PointScale, ThresholdScale } from '@visactor/vscale';
import type { IVisual, IVisualSpecBase } from '../typings/visual';
import { ColorOrdinalScale } from '../scale/color-ordinal-scale';

const defaultScaleMap = {
  linear: LinearScale,
  band: BandScale,
  point: PointScale,
  ordinal: OrdinalScale,
  threshold: ThresholdScale,
  colorOrdinal: ColorOrdinalScale
};

export function createScale(type: keyof typeof defaultScaleMap): IBaseScale | null {
  const scaleConstructor = defaultScaleMap[type];
  if (scaleConstructor) {
    return new scaleConstructor();
  }

  return null;
}

export function createScaleWithSpec(
  spec: IVisual<any>,
  context: {
    globalScale: IGlobalScale;
    seriesId: number;
  }
): IBaseScale | null {
  if ('scale' in spec && spec.scale) {
    if (isString(spec.scale) && context?.globalScale) {
      return context.globalScale.registerMarkAttributeScale(spec, context.seriesId);
    }
    return spec.scale as unknown as IBaseScale;
  }
  const scale = createScale((spec as IVisualSpecBase<any, any>).type);
  if (scale) {
    initScaleWithSpec(scale, spec as IVisualSpecBase<any, any>);
  }
  return scale;
}

// 需要一个通用的从spec初始化scale的方法，避免在scale属性更新后需要维护多组逻辑
function initScaleWithSpec(scale: IBaseScale, spec: IVisualSpecBase<any, any>) {
  if (!scale || !spec) {
    return;
  }

  if (spec.domain) {
    scale.domain(spec.domain);
  }

  if (spec.range) {
    scale.range(spec.range);
  }

  if (spec.specified && (<OrdinalScale>scale).specified) {
    (<OrdinalScale>scale).specified(spec.specified);
  }
}

export function valueInScaleRange(v: number, s?: IBaseScale) {
  if (!s) {
    return v;
  }
  const range = s.range();
  const min = Math.min(range[0], range[range.length - 1]);
  const max = Math.max(range[0], range[range.length - 1]);
  return Math.min(Math.max(min, v), max);
}

export function isSpecValueWithScale(specValue: any) {
  return isValid(specValue?.field) && isValid(specValue?.scale);
}
