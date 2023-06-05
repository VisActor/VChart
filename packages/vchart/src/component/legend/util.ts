import type { ILegendCommonSpec, ITitle } from './interface';
import { isEmpty, merge } from '@visactor/vutils';
import { transformToGraphic } from '../../util/style';

export function transformLegendTitleAttributes(title: ITitle) {
  const transformedTitle = {
    ...title
  };
  if (!isEmpty(title.style)) {
    transformedTitle.textStyle = transformToGraphic(title.style);
  }
  if (!isEmpty(title.textStyle)) {
    merge(transformedTitle.textStyle, transformToGraphic(title.textStyle));
  }

  if (title.shape?.style) {
    transformToGraphic(transformedTitle.shape.style);
  }

  if (title.background?.style) {
    transformToGraphic(transformedTitle.background.style);
  }
  return transformedTitle;
}

/**
 * 根据图例 spec.orient 参数判断是水平还是垂直布局
 * @param spec
 * @returns
 */
export function getLayout(spec: ILegendCommonSpec) {
  return spec.orient === 'bottom' || spec.orient === 'top' ? 'horizontal' : 'vertical';
}
