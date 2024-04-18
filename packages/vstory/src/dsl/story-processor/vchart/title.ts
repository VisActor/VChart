import type { VChart, IChartSpec, ITitleSpec } from '@visactor/vchart';
import { CreateTitleAction } from '../../types/CreateComponent';

export const createTitleProcessor = async (
  chartInstance: VChart,
  spec: IChartSpec,
  createTitleAction: CreateTitleAction
) => {
  const { elementId, payload, data } = createTitleAction;
  const title: ITitleSpec[] = (spec as any).title;
  title.push({
    id: elementId,
    text: data,
    ...payload
  });
  (spec as any).title = title;
  chartInstance.updateSpecSync(spec);
};
