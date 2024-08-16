import { isArray } from '@visactor/vutils';
import { DEFAULT_DATA_INDEX, DEFAULT_DATA_SERIES_FIELD } from '../../constant/data';

export const correlationCenter = (data: any, options: any) => {
  if (!data || !isArray(data)) {
    return [];
  }

  const { keyword, categoryField } = options;

  const nodeInfo = data[0].latestData[0];

  const centerInfo = {
    [categoryField]: keyword,
    [DEFAULT_DATA_INDEX]: nodeInfo?.[DEFAULT_DATA_INDEX],
    [DEFAULT_DATA_SERIES_FIELD]: nodeInfo?.[DEFAULT_DATA_SERIES_FIELD]
  };

  return centerInfo;
};
