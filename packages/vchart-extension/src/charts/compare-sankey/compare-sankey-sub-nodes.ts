import type { DataView } from '@visactor/vdataset';

export const compareSankeySubNodes = (data: Array<DataView>) => {
  const viewData = data[0] as DataView;
  if (!viewData.latestData) {
    return [];
  }
  const subData = Object.keys(viewData.latestData);
  if (!subData.length) {
    return {};
  }
  const subNodes: any[] = [];
  subData.forEach(key => {
    subNodes.push(...viewData.latestData[key].nodes);
  });
  return [{ nodes: subNodes }];
};
