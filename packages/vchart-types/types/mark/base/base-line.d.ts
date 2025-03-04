import type { StateValueType } from '../../compile/mark';
import type { ConvertToMarkStyleSpec, ILineLikeMarkSpec } from '../../typings/visual';
import type { IPointLike } from '@visactor/vutils';
import { BaseMark } from './base-mark';
import type { IMarkGraphic, IMarkStyle } from '../interface';
import type { Datum } from '../../typings/common';
import type { ILine } from '@visactor/vrender-core';
import type { IMarkSpec } from '../../typings/spec/common';
export declare const LINE_SEGMENT_ATTRIBUTES: string[];
export declare abstract class BaseLineMark<T extends ILineLikeMarkSpec = ILineLikeMarkSpec> extends BaseMark<T> {
    protected abstract _getIgnoreAttributes(): string[];
    protected _getSegmentAttributes(): string[];
    protected _segmentStyleKeys: string[];
    initStyleWithSpec(spec: IMarkSpec<T>): void;
    setStyle<T>(style: Partial<ConvertToMarkStyleSpec<T>> | Partial<IMarkStyle<T>>, state?: StateValueType, level?: number): void;
    _isValidPointChannel: (channel: string) => boolean;
    _getLineSegments(items: any[], points: IPointLike[]): any[];
    _getPrevPoints(g: ILine): IPointLike[];
    _runPointsEncoder(newStyles: Record<string, (datum: Datum) => any>, g: IMarkGraphic, attrs?: any): any;
    _runEncoderOfGraphic(newStyles: Record<string, (datum: Datum) => any>, g: IMarkGraphic, attrs?: any): any;
    protected _getDataByKey(data: Datum[]): import("../interface").GroupedData<Datum>;
}
