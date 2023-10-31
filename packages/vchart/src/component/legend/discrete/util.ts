/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty, isValid } from '@visactor/vutils';
import type { ILayoutRect } from '../../../model/interface';
import { isPercent } from '../../../util/space';
import { mergeSpec } from '../../../util/spec/merge-spec';
import { transformComponentStyle, transformToGraphic } from '../../../util/style';
import { transformLegendTitleAttributes } from '../util';
import type { IDiscreteLegendSpec } from './interface';

export function getLegendAttributes(spec: IDiscreteLegendSpec, rect: ILayoutRect) {
  const {
    // 需要进行样式转换的属性
    title = {},
    item = {},
    pager = {},
    background = {},

    // 以下不属于 legend 需要的属性，单独拿出来以免污染传递给组件的属性
    type,
    id,
    visible,
    orient,
    position,
    data,
    filter,
    regionId,
    regionIndex,
    seriesIndex,
    seriesId,
    padding, // vchart 布局模块已经处理了

    ...restSpec
  } = mergeSpec({}, spec);

  const attrs: any = restSpec;

  // transform title
  if (title.visible) {
    attrs.title = transformLegendTitleAttributes(title);
  }

  // transform item
  if (!isEmpty(item.focusIconStyle)) {
    transformToGraphic(item.focusIconStyle);
  }
  item.shape = transformComponentStyle(item.shape);
  item.label = transformComponentStyle(item.label);
  item.value = transformComponentStyle(item.value);
  item.background = transformComponentStyle(item.background);

  if (isPercent(item.maxWidth)) {
    item.maxWidth = (Number(item.maxWidth.substring(0, item.maxWidth.length - 1)) * rect.width) / 100;
  }
  if (isPercent(item.width)) {
    item.width = (Number(item.width.substring(0, item.width.length - 1)) * rect.width) / 100;
  }
  if (isPercent(item.height)) {
    item.height = (Number(item.height.substring(0, item.height.length - 1)) * rect.width) / 100;
  }
  attrs.item = item;

  // transform pager
  if (!isEmpty(pager.textStyle)) {
    transformToGraphic(pager.textStyle);
  }
  transformComponentStyle(pager.handler);
  attrs.pager = pager;

  if (background.visible && !isEmpty(background.style)) {
    mergeSpec(attrs, background.style);
    if (isValid(background.padding)) {
      attrs.padding = background.padding;
    }
  }

  return attrs;
}
