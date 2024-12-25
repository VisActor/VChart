import type { WaterfallSeries } from './../../series/waterfall/waterfall';
import type { Datum } from '../../typings/common';
import type { LabelItem, Strategy } from '@visactor/vrender-components';
import type { ILabelInfo, ILabelSpec } from './interface';
export declare const labelRuleMap: {
    rect: typeof barLabel;
    symbol: typeof symbolLabel;
    arc: typeof pieLabel;
    point: typeof pointLabel;
    'line-data': typeof lineDataLabel;
    stackLabel: typeof stackLabel;
    line: typeof LineLabel;
    area: typeof LineLabel;
    rect3d: typeof barLabel;
    arc3d: typeof pieLabel;
    treemap: typeof treemapLabel;
    venn: typeof vennLabel;
};
export declare function defaultLabelConfig(rule: string, labelInfo: ILabelInfo): any;
export declare function textAttribute(labelInfo: ILabelInfo, datum: Datum, formatMethod?: ILabelSpec['formatMethod'], formatter?: ILabelSpec['formatter']): any;
export declare function symbolLabel(labelInfo: ILabelInfo): {
    position: string | ((datum: Datum) => any);
    overlap: boolean | {
        strategy: Strategy[] | import("@visactor/vrender-components").ShiftYStrategy;
        avoidBaseMark: boolean;
    };
};
export declare function lineDataLabel(labelInfo: ILabelInfo): {
    position: string | ((datum: Datum) => any);
    overlap: boolean | {
        strategy: Strategy[] | import("@visactor/vrender-components").ShiftYStrategy;
        avoidBaseMark: boolean;
    };
};
export declare function barLabel(labelInfo: ILabelInfo): {
    position: (data: any) => string;
    overlap: boolean | {
        strategy: Strategy[] | import("@visactor/vrender-components").ShiftYStrategy;
    };
    smartInvert: boolean;
};
export declare function pointLabel(labelInfo: ILabelInfo): {
    position: string;
    overlap: boolean | {
        avoidBaseMark: boolean;
    };
};
export declare function pieLabel(labelInfo: ILabelInfo): {
    position: import("@visactor/vrender-components").Functional<string>;
    smartInvert: boolean | import("@visactor/vrender-components").SmartInvertAttrs;
};
export declare function stackLabelX(datum2: Datum, series: WaterfallSeries, pos: string, offset: number): number;
export declare function stackLabelY(datum2: Datum, series: WaterfallSeries, pos: string, offset: number): number;
export declare function stackLabel(labelInfo: ILabelInfo, datumTransform?: (data: any) => any, attributeTransform?: (label: LabelItem, datum: Datum, att: any) => any): {
    customLayoutFunc: (labels: LabelItem[]) => import("@visactor/vrender-core").IText[];
    dataFilter: (labels: LabelItem[]) => LabelItem[];
    overlap: {
        strategy: any;
    };
};
export declare function treemapLabel(labelInfo: ILabelInfo): {
    customLayoutFunc: (labels: LabelItem[], text: any) => any;
    overlap: boolean;
};
export declare function vennLabel(labelInfo: ILabelInfo): {
    customLayoutFunc: (labels: LabelItem[], text: any) => any;
    smartInvert: boolean;
};
export declare function LineLabel(labelInfo: ILabelInfo): {
    position: string;
    data: any;
};
export declare function sankeyLabel(labelInfo: ILabelInfo): {
    position: import("@visactor/vrender-components").Functional<string>;
    overlap: boolean | {
        strategy: Strategy[] | import("@visactor/vrender-components").ShiftYStrategy;
    };
    smartInvert: boolean;
    offset: number;
    syncState: boolean;
};
