import type { Datum } from '../../../typings';
import type { CartesianAxis } from '../../../component';
import { convertDomainToTickData } from '@visactor/vutils-extension';

export interface ITickAlignOpt {
  targetAxis: () => CartesianAxis;
  currentAxis: () => CartesianAxis;
}

export const tickAlign = (data: Array<Datum>, op: ITickAlignOpt) => {
  if (!data) {
    return data;
  }
  // check align enable
  const targetAxis = op?.targetAxis?.();
  if (!targetAxis) {
    return data;
  }
  const currentAxis = op?.currentAxis?.();
  if (!currentAxis) {
    return data;
  }
  const currentData = currentAxis.getTickData()?.getDataView();
  if (!currentData) {
    return data;
  }
  const currentTickTransform = currentData.transformsArr.find(t => t.type === 'ticks');
  if (!currentTickTransform) {
    return data;
  }
  const currentScale = currentAxis.getScale();
  if (!currentScale) {
    return data;
  }
  const targetData = targetAxis.getTickData()?.getDataView()?.latestData;
  if (!targetData?.length) {
    return data;
  }
  const targetScale = targetAxis.getScale();
  if (!targetScale) {
    return data;
  }
  const targetDomain = targetScale.domain();
  const targetRange = targetDomain[1] - targetDomain[0];
  if (targetRange === 0) {
    return data;
  }
  const currentDomain = currentScale.domain();
  const currentRange = currentDomain[1] - currentDomain[0];
  if (targetRange === 0) {
    return data;
  }
  // make the tickData of the current axis consistent with the tickData of the target axis
  const newTicks: number[] = targetData.map((d: { value: number }) => {
    const percent = (d.value - targetDomain[0]) / targetRange;
    return currentRange * percent + currentDomain[0];
  });
  return convertDomainToTickData(newTicks);
};
