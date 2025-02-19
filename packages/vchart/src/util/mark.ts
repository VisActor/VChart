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
