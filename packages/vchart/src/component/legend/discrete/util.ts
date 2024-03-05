/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty, isValid } from '@visactor/vutils';
import { isPercent } from '../../../util/space';
import { mergeSpec } from '../../../util/spec/merge-spec';
import { transformComponentStyle, transformToGraphic } from '../../../util/style';
import { transformLegendTitleAttributes } from '../util';
import type { IDiscreteLegendSpec, ILegendScrollbar, IPager } from './interface';
import type { ILayoutRect } from '../../../typings/layout';

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
  } = spec;

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

  if ((pager as ILegendScrollbar).type === 'scrollbar') {
    if (!isEmpty((pager as ILegendScrollbar).railStyle)) {
      transformToGraphic((pager as ILegendScrollbar).railStyle);
    }
    if (!isEmpty((pager as ILegendScrollbar).sliderStyle)) {
      transformToGraphic((pager as ILegendScrollbar).sliderStyle);
    }
  } else {
    // transform pager
    if (!isEmpty((pager as IPager).textStyle)) {
      transformToGraphic((pager as IPager).textStyle);
    }
    transformComponentStyle((pager as IPager).handler);
  }

  attrs.pager = pager;

  if (background.visible && !isEmpty(background.style)) {
    mergeSpec(attrs, background.style);
    if (isValid(background.padding)) {
      attrs.padding = background.padding;
    }
  }

  return attrs;
}
