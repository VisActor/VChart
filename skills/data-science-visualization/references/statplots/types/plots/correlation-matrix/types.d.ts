import type { BaseSpec } from '../../common/types';
import type { NumericObservation } from '../../common/observation-table-types';
export interface CorrelationMatrixSpec extends BaseSpec {
    type: 'correlationMatrix';
    variables: string[];
    data: {
        observations: NumericObservation[];
    };
    method?: 'pearson' | 'spearman' | 'kendall';
    minSamples?: number;
    triangle?: 'full' | 'lower' | 'upper';
    fieldLabels?: {
        row?: string;
        column?: string;
        correlation?: string;
    };
}
