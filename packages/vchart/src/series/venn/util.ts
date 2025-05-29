import { array } from '@visactor/vutils';

export const getVennSeriesDataKey = (sets: string | string[]) => {
  if (!sets || (Array.isArray(sets) && sets.length === 0)) {
    return 'others';
  }
  return array(sets).join(',');
};
