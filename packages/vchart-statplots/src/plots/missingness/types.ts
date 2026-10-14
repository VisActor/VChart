import type { BaseSpec } from '../../common/types';
import type { TableObservation } from '../../common/observation-table-types';
export interface MissingValueMatrixSpec extends BaseSpec {
  type: 'missingValueMatrix';
  variables: string[];
  data: { observations: TableObservation[] };
  fieldLabels?: { observationId?: string; variable?: string };
}
