import type { Datum } from '../../typings/common';
import type { ILabelInfo } from './label';
import type { LabelItem, Strategy } from '@visactor/vrender-components';
import type { ILabelSpec } from './interface';
export declare const labelRuleMap: {
    rect: typeof barLabel;
    symbol: typeof symbolLabel;
    arc: typeof pieLabel;
    point: typeof pointLabel;
    'line-data': typeof lineDataLabel;
    stackLabel: typeof stackLabel;
    line: typeof LineLabel;
    area: typeof LineLabel;
};
export declare enum LabelRule {
    rect = "rect",
    symbol = "symbol",
    arc = "arc",
    point = "point",
    stackLabel = "stackLabel",
    line = "line"
}
export declare function textAttribute(labelInfo: ILabelInfo, datum: Datum, formatMethod?: ILabelSpec['formatMethod'], formatter?: ILabelSpec['formatter']): any;
export declare function symbolLabel(labelInfo: ILabelInfo): {
    position: string | ((datum: Datum) => any);
    overlap: boolean | {
        strategy: Strategy[];
        avoidBaseMark: boolean;
    };
};
export declare function lineDataLabel(labelInfo: ILabelInfo): {
    position: string | ((datum: Datum) => any);
    overlap: boolean | {
        strategy: Strategy[];
        avoidBaseMark: boolean;
    };
};
export declare function barLabel(labelInfo: ILabelInfo): {
    position: import("@visactor/vrender-components").Functional<string>;
    overlap: boolean | {
        strategy: Strategy[];
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
export declare function stackLabel(labelInfo: ILabelInfo): {
    customLayoutFunc: (labels: LabelItem[]) => import("@visactor/vrender-core").IText[];
    dataFilter: (labels: LabelItem[]) => LabelItem[];
    overlap: {
        strategy: any;
    };
};
export declare function LineLabel(labelInfo: ILabelInfo): {
    position: string;
    data: any;
};
