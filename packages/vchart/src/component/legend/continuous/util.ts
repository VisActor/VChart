/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IColorLegendSpec, ISizeLegendSpec } from './interface';
import { ColorContinuousLegend, SizeContinuousLegend } from '@visactor/vrender-components';
import { isEmpty, merge, isValid } from '@visactor/vutils';
import { transformComponentStyle, transformToGraphic } from '../../../util/style';
import { transformLegendTitleAttributes } from '../util';

// 获取连续图例组件属性
export function getContinuousLegendAttributes(spec: IColorLegendSpec | ISizeLegendSpec) {
  const {
    // 需要进行样式转换的属性
    title = {},
    handler = {},
    rail = {},
    track = {},
    startText,
    endText,
    handlerText,
    sizeBackground,
    background = {},

    // 以下不属于 legend 需要的属性，单独拿出来以免污染传递给组件的属性
    type,
    id,
    visible,
    orient,
    position,
    data,
    defaultSelected,
    field,
    filter,
    regionId,
    regionIndex,
    seriesIndex,
    seriesId,
    padding, // vchart 布局模块已经处理了

    ...restSpec
  } = merge({}, spec);

  const attrs = restSpec;

  // transform title
  if (title.visible) {
    attrs.title = transformLegendTitleAttributes(title);
  }

  // handlerStyle
  attrs.showHandler = handler.visible !== false;
  if (!isEmpty(handler.style)) {
    attrs.handlerStyle = transformToGraphic(handler.style);
  }
  if (isValid(rail.width)) {
    attrs.railWidth = rail.width;
  }
  if (isValid(rail.height)) {
    attrs.railHeight = rail.height;
  }
  if (!isEmpty(rail.style)) {
    attrs.railStyle = transformToGraphic(rail.style);
  }
  if (!isEmpty(track.style)) {
    attrs.trackStyle = transformToGraphic(track.style);
  }

  attrs.startText = transformComponentStyle(startText);
  attrs.endText = transformComponentStyle(endText);
  attrs.handlerText = transformComponentStyle(handlerText);

  if (!isEmpty(sizeBackground)) {
    attrs.sizeBackground = transformToGraphic(sizeBackground);
  }

  if (background.visible && !isEmpty(background.style)) {
    merge(attrs, background.style);
    if (isValid(background.padding)) {
      attrs.padding = background.padding;
    }
  }

  return attrs;
}

export function isContinuousLegend(type: string) {
  return type === 'color' || type === 'size';
}

export const ContinuousLegendMap = {
  color: ColorContinuousLegend,
  size: SizeContinuousLegend
};
