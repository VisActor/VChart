import type { IDimensionInfo } from '../../../../event';
import type { ICartesianSeries } from '../../../../series';
import type { ILayoutPoint } from '../../../../typings';
import type { IFixedTooltipPositionPattern, IGlobalTooltipPositionPattern, TooltipFixedPosition } from '../../../../typings/tooltip/position';
export declare const getActualTooltipPositionValue: (position: number | ((event: MouseEvent) => number), event: MouseEvent) => number;
export type TooltipHorizontalPositionType = 'left' | 'right' | 'center' | 'centerLeft' | 'centerRight';
export type TooltipVerticalPositionType = 'top' | 'bottom' | 'center' | 'centerTop' | 'centerBottom';
export declare const positionType: Record<TooltipFixedPosition, [TooltipHorizontalPositionType, TooltipVerticalPositionType]>;
export declare const getHorizontalPositionType: (position: TooltipFixedPosition, defaultCase?: TooltipHorizontalPositionType) => TooltipHorizontalPositionType;
export declare const getVerticalPositionType: (position: TooltipFixedPosition, defaultCase?: TooltipVerticalPositionType) => TooltipVerticalPositionType;
export declare const getCartesianCrosshairRect: (dimensionInfo: IDimensionInfo[], series: ICartesianSeries, layoutStartPoint: ILayoutPoint) => {
    visible: boolean;
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
};
export declare const isGlobalTooltipPositionPattern: (obj: any) => obj is IGlobalTooltipPositionPattern;
export declare const isFixedTooltipPositionPattern: (obj: any) => obj is IFixedTooltipPositionPattern;
