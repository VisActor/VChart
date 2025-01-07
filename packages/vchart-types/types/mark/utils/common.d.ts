import { MarkTypeEnum } from '../interface/type';
export declare const MultiDatumMark: string[];
export declare function isMultiDatumMark(type: MarkTypeEnum): boolean;
export declare function curveTypeTransform(type: string, direction: string): string;
export declare function is3DMark(type: MarkTypeEnum): boolean;
