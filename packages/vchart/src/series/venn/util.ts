import { array } from '@visactor/vutils';

export const getVennSeriesDataKey = (sets: string | string[], emptysetKey?: string) => {
  if (!sets || (Array.isArray(sets) && sets.length === 0)) {
    return emptysetKey || 'others';
  }
  return array(sets).join(',');
};
