import type { TableData } from '../types';

export type LimitPipe = (params: { limit?: number }) => (tableData: TableData) => TableData;

export const limit: LimitPipe = ({ limit: limitSize }) => {
  return tableData => {
    if (limitSize === undefined || limitSize < 1) {
      return tableData;
    }

    return tableData.slice(0, limitSize);
  };
};
