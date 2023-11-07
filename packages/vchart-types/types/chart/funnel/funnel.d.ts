import { BaseFunnelChart } from './base';
export declare class FunnelChart extends BaseFunnelChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerFunnelChart: () => void;
