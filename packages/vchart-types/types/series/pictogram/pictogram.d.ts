import type { SVGParsedElement, SVGParserResult } from '@visactor/vdataset';
import type { PanEventParam, ZoomEventParam } from '../../core';
import { GeoSeries } from '../geo/geo';
import type { ISeriesSeriesInfo, SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface';
import type { IPictogramSeriesSpec } from './interface';
import type { GroupMark } from '../../mark';
import { PictogramSeriesSpecTransformer } from './pictogram-transformer';
import type { IMatrix } from '@visactor/vutils';
import type { Datum } from '../../typings';
import type { Group } from '@visactor/vrender-core';
import type { IHoverSpec, ISelectSpec } from '../../interaction/interface';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import type { EventType } from '@visactor/vgrammar-core';
import type { IMark } from '../../mark/interface';
import type { IPoint } from '../../typings/coordinate';
export interface SVGParsedElementExtend extends SVGParsedElement {
    _finalAttributes: Record<string, any>;
    _uniqueId: string;
}
export declare class PictogramSeries<T extends IPictogramSeriesSpec = IPictogramSeriesSpec> extends GeoSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    static readonly transformerConstructor: typeof PictogramSeriesSpecTransformer;
    svg: string;
    protected _pictogramMark: GroupMark;
    protected _parsedSvgResult: SVGParserResult;
    private _labelMark;
    private _idToMark;
    setAttrFromSpec(): void;
    getDatumCenter(datum: SVGParsedElementExtend): [number, number];
    getDatumName(datum: SVGParsedElementExtend): string;
    getMarksWithoutRoot(): IMark[];
    protected _buildMarkAttributeContext(): void;
    protected _defaultHoverConfig(selector: string[], finalHoverSpec: IHoverSpec): {
        seriesId: number;
        regionId: number;
        selector: string[];
        type: string;
        trigger: EventType;
        triggerOff: EventType;
        blurState: STATE_VALUE_ENUM;
        highlightState: STATE_VALUE_ENUM;
    };
    protected _defaultSelectConfig(selector: string[], finalSelectSpec: ISelectSpec): {
        type: string;
        seriesId: number;
        regionId: number;
        selector: string[];
        trigger: EventType;
        triggerOff: EventType;
        reverseState: STATE_VALUE_ENUM;
        state: STATE_VALUE_ENUM;
        isMultiple: boolean;
    };
    initMark(): void;
    private _initLabelMark;
    initLabelMarkStyle(): void;
    initMarkStyle(): void;
    protected _validElement(element: SVGParsedElement): string;
    protected initTooltip(): void;
    dataToPosition(datum: Datum, global?: boolean): IPoint;
    coordToPosition(point: IPoint): IPoint | undefined;
    getRootMatrix(): IMatrix;
    getPictogramRootGraphic(): Group;
    initData(): void;
    mapViewDataUpdate(): void;
    onLayoutEnd(ctx: any): void;
    updateSVGSize(): void;
    protected initEvent(): void;
    handleZoom(e: ZoomEventParam): void;
    handlePan(e: PanEventParam): void;
    getMarkData(datum: Datum): any;
    getMeasureField(): string[];
    getDimensionField(): string[];
    protected _getSeriesInfo(field: string, keys: string[]): ISeriesSeriesInfo[];
    release(): void;
}
export declare const registerPictogramSeries: () => void;
