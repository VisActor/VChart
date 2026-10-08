import type { ICartesianAxisSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';

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

export function categoryAxis(orient: 'bottom' | 'left', title: string, domain?: string[]): ICartesianAxisSpec {
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
