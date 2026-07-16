import type { IMarkPoint, IMarkPointSpec } from './interface';
import { MarkPoint as MarkPointComponent } from '@visactor/vrender-components';
import { BaseMarker } from '../base-marker';
import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { IGroup } from '@visactor/vrender-core';
export declare abstract class BaseMarkPoint extends BaseMarker<IMarkPointSpec> implements IMarkPoint {
    static specKey: string;
    specKey: string;
    layoutZIndex: number;
    protected _markerComponent: MarkPointComponent;
    protected abstract _computePointsAttr(): any;
    protected initEvent(): void;
    protected _handleDimensionHover: (params: DimensionEventParams) => void;
    private _getTargetSymbolGraphic;
    private _isDimensionHoverTarget;
    static _getMarkerCoordinateType(markerSpec: any): string;
    protected _createMarkerComponent(): IGroup;
    protected _markerLayout(): void;
    protected _initDataView(): void;
}
