import type { DataView } from '@visactor/vdataset';
import { SankeyNodeElement } from '@visactor/vgrammar-sankey';

export interface ICompareSankeyLayoutOpt {
  rawData: () => DataView;
  nodeKey: string;
  subNodeGap: number;
  subNodeMinSize?: number;
}

export const compareSankeyDiffSubData = (data: Array<DataView>, opt: ICompareSankeyLayoutOpt) => {
  const viewData = data[0] as DataView;
  if (!viewData.latestData?.length) {
    return {};
  }

  const subNodeMinSize = opt.subNodeMinSize ?? 0;
  const subNodeGap = opt.subNodeGap;
  const subDataList: { data: any[]; external: any }[] = [];
  const sankeyLayoutTransform = viewData.dataSet.getTransform('sankeyLayout');
  const sankeyTransformOption = { ...viewData.transformsArr.find(t => t.type === 'sankeyLayout').options };
  // 自定义 layout 后处理不执行
  delete sankeyTransformOption.customLayout;
  const viewDataLatest = viewData.latestData[0];
  // 使用每一个对比数据生成对比节点和对比边
  viewData.rawData?.[0]?.latestData?.[0]?.subNode?.forEach((subGroup: any) => {
    const { nodes, ...rest } = subGroup;
    const data = sankeyLayoutTransform([{ nodes, ...rest }], sankeyTransformOption);
    Object.keys(rest).forEach(key => {
      data[0].nodes.forEach((n: { [x: string]: any }) => {
        n[key] = rest[key];
      });
    });
    subDataList.push({ data: data, external: rest });
  });

  const subCount = subDataList.length;
  viewData.latestData[0].nodes.forEach((n: SankeyNodeElement, index: number) => {
    let currentY = n.y0;
    const totalSize = n.y1 - n.y0 - (subCount - 1) * subNodeGap;
    const totalValue = n.value;
    subDataList.forEach((subData: any) => {
      let subN = subData.data[0].nodes[index] as SankeyNodeElement;
      if (subN.key !== n.key) {
        subN = subData.data[0].nodes.find((n: SankeyNodeElement) => n.key === n.key);
      }
      if (!subN) {
        return;
      }
      const percent = totalValue === 0 ? 0 : subN.value / totalValue;
      const nodeSize = Math.max(subNodeMinSize, totalSize * percent);

      // x 方向偏移
      const diffX = n.x0 - subN.x0;
      const lastY0 = subN.y0;
      const lastSize = subN.y1 - subN.y0;
      const sizeMultiply = nodeSize / lastSize;

      // @ts-expect-error
      subN._compare_compute_temp = {
        diffX,
        lastY0,
        lastSize,
        sizeMultiply
      };

      subN.x0 = n.x0;
      subN.x1 = n.x1;
      subN.y0 = currentY;
      subN.y1 = currentY + nodeSize;
      currentY += nodeSize + subNodeGap;

      // updateLink // 只更新 source Link
      subN.sourceLinks?.forEach(link => {
        // @ts-expect-error
        link.type = subN.type;
        link.x0 = (link.x0 ?? 0) + diffX;
        link.thickness = link.thickness * sizeMultiply;
        link.y0 = (link.y0 - lastY0) * sizeMultiply + subN.y0;

        if (link.sourceRect) {
          link.sourceRect.x0 = subN.x0;
          link.sourceRect.x1 = subN.x1;
          link.sourceRect.y0 = subN.y0;
          link.sourceRect.y1 = subN.y1;
        }
      });
    });
  });

  // 最后更新一次target Link
  subDataList.forEach((subData: any) => {
    subData.data[0].nodes.forEach((n: SankeyNodeElement) => {
      // @ts-expect-error
      const { diffX, lastY0, sizeMultiply } = n._compare_compute_temp;
      // target Link
      n.targetLinks?.forEach(link => {
        link.x1 = (link.x1 ?? 0) + diffX;
        link.y1 = (link.y1 - lastY0) * sizeMultiply + n.y0;

        if (link.targetRect) {
          link.targetRect.x0 = n.x0;
          link.targetRect.x1 = n.x1;
          link.targetRect.y0 = n.y0;
          link.targetRect.y1 = n.y1;
        }
      });
    });
  });

  const finalViewData: { columns: any[]; links: any[]; nodes: any[] } = {
    columns: [],
    links: [],
    nodes: []
  };
  // 合并节点和边
  finalViewData.columns = viewDataLatest.columns.reduce((prev: any[], cur: any, curIndex: number) => {
    prev.push(subDataList.reduce((prev, cur) => prev.concat(cur.data[0].columns[curIndex]), []));
    return prev;
  }, []);
  finalViewData.links = subDataList.reduce((prev, cur) => prev.concat(cur.data[0].links), []);
  finalViewData.nodes = subDataList.reduce((prev, cur) => prev.concat(cur.data[0].nodes), []);
  return [finalViewData];
};
