import { isArray, isValid } from '@visactor/vutils';
import { BOX_PLOT_OUTLIER_VALUE_FIELD } from '../../constant/box-plot';
import type { Datum } from '../../typings';

export interface IBoxPlotOutlierOpt {
  dimensionField: string[];
  outliersField: string;
  seriesField?: string;
}
/**
 * 将箱型图outlier数组展平
 * @param data
 * @param options
 * @returns
 */
export const foldOutlierData = (data: Array<DataView>, op: IBoxPlotOutlierOpt) => {
  const result: any = [];
  const { outliersField, dimensionField, seriesField } = op;
  const latestData = (data[0] as any).latestData || [];

  latestData.forEach((d: Datum) => {
    let outlierValues = d[outliersField];
    if (!isArray(outlierValues)) {
      outlierValues = [outlierValues];
    }
    result.push(
      ...outlierValues.map((v: any) => {
        const resData = {
          [BOX_PLOT_OUTLIER_VALUE_FIELD]: v
        };
        dimensionField.forEach(field => {
          (resData as any)[field] = d[field];
        });

        if (isValid(seriesField)) {
          (resData as any)[seriesField] = d[seriesField];
        }

        return resData;
      })
    );
  });
  return result;
};
