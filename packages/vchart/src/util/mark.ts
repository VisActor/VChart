import type { IGraphic } from '@visactor/vrender-core';
import { MarkTypeEnum } from '../mark/interface';
import type { IMarkGraphic } from '../mark/interface/common';

export const isCollectionMark = (type: string) => {
  return type === MarkTypeEnum.line || type === MarkTypeEnum.area;
};

export const getDatumOfGraphic = (g: IMarkGraphic) => {
  if (!g || !g.context) {
    return null;
  }

  const { data, markType } = g.context;
  if (isCollectionMark(markType)) {
    return data;
  }

  return data?.[0];
};

export const findMarkGraphic = (rootGroup: IGraphic, target: IGraphic) => {
  let g = target;

  while (g?.parent && g.parent !== rootGroup) {
    g = g.parent;

    if ((g as IMarkGraphic).context) {
      return g;
    }
  }

  return null;
};
