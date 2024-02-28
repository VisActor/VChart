import type { DataView } from '@visactor/vdataset';
export interface IFunnelOpt {
    valueField: string;
    asTransformRatio: string;
    asReachRatio: string;
    asHeightRatio: string;
    asValueRatio: string;
    asLastValueRatio: string;
    asNextValueRatio: string;
    asCurrentValue: string;
    asLastValue: string;
    asNextValue: string;
    isCone?: boolean;
    heightVisual?: boolean;
    range?: {
        min: number;
        max: number;
    };
}
export declare const funnel: (originData: Array<DataView>, op: IFunnelOpt) => {
    dataSet: import("@visactor/vdataset").DataSet;
    options?: import("@visactor/vdataset").IDataViewOptions;
    isDataView: boolean;
    type: import("@visactor/vdataset/es/constants").DATAVIEW_TYPE;
    name: string | number;
    target: any;
    parseOption: import("@visactor/vdataset").IParserOptions;
    transformsArr: import("@visactor/vdataset").ITransformOptions[];
    isRunning: boolean;
    rawData: any;
    history: boolean;
    historyData: any[];
    parserData: any;
    latestData: any;
    _diffMap: Map<string, any>;
    _diffRank: number;
    latestDataAUD: {
        add: any;
        update: any;
        del: any;
    };
    reRunAllTransform: (opt?: {
        pushHistory: boolean;
        emitMessage: boolean;
    }) => DataView;
    markRunning: () => void;
}[];
export interface IFunnelTransformOpt {
    asIsTransformLevel: string;
}
export declare const funnelTransform: (originData: Array<DataView>, op: IFunnelTransformOpt) => any;
