import type { ICartesianBandAxisSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';

export function numberAxis(orient: 'bottom' | 'left', title: string, probability = false): ICartesianLinearAxisSpec {
  return {
    orient,
    type: 'linear',
    zero: false,
    nice: !probability,
    ...(probability ? { min: 0, max: 1 } : {}),
    title: { visible: true, text: title },
    grid: { visible: orient === 'left' },
    label: { flush: true }
  };
}

export function categoryAxis(orient: 'bottom' | 'left', title: string, domain?: string[]): ICartesianBandAxisSpec {
  return {
    orient,
    type: 'band',
    ...(domain ? { domain } : {}),
    title: { visible: true, text: title },
    grid: { visible: false },
    label: { autoLimit: true },
    ...(orient === 'left' ? { inverse: true } : {})
  };
}

/** 两种方阵共用无间距 band 轴，标题占位由原生布局测量。 */
export function matrixAxis(orient: 'bottom' | 'left', title: string, domain: string[]): ICartesianBandAxisSpec {
  return {
    ...categoryAxis(orient, title, domain),
    paddingInner: 0,
    paddingOuter: 0,
    title: { visible: Boolean(title), text: title },
    domainLine: { visible: false },
    tick: { visible: false },
    grid: { visible: false },
    label: { autoLimit: true, autoHide: true }
  };
}
