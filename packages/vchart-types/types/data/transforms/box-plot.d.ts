export interface IBoxPlotOutlierOpt {
    dimensionField: string[];
    outliersField: string;
}
export declare const foldOutlierData: (data: Array<DataView>, op: IBoxPlotOutlierOpt) => any;
