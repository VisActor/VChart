export declare const vennLayout: (data: Array<any>, op: {
    setField: string;
    valueField: string;
    getViewBox: () => {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
    };
}) => (import("@visactor/vlayouts").IVennCircleDatum<any> | import("@visactor/vlayouts").IVennOverlapDatum<any>)[];
