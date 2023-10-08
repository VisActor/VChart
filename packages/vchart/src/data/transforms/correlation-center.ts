import { isArray } from '@visactor/vutils';

export const correlationCenter = (data: any) => {
  if (!data || !isArray(data)) {
    return [];
  }

  return data[0].latestData[0];
};
