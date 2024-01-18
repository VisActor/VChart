import type { TableData, GroupedData, FilterNode, HavingCondition } from '../../types';
import { evaluateGroupColumnValue } from '../select';
import { judgeFilterTree } from './filter';

export type HavingPipe = (params: {
  filter?: FilterNode<HavingCondition>;
  source: TableData;
}) => (grouped: GroupedData) => GroupedData;

export const having: HavingPipe = ({
  filter,
  source
}: {
  filter?: FilterNode<HavingCondition>;
  source: TableData;
}): ((grouped: GroupedData) => GroupedData) => {
  if (!filter?.conditions.length) return grouped => grouped;

  return grouped =>
    grouped.filter(group => {
      return judgeFilterTree({
        filterNode: filter,
        item: group,
        getValue: ({ item, condition }) =>
          evaluateGroupColumnValue({
            group: item,
            source,
            column: condition
          })
      });
    });
};
