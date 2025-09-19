export const getDatumOfGraphic = (g: any) => {
  if (!g || !g.graphicItem) {
    return null;
  }

  if (isCollectionMark(g.graphicItem.type)) {
    return g.data;
  }

  return g.data[0];
};

export const isCollectionMark = (type: string) => {
  return type === 'line' || type === 'area';
};
