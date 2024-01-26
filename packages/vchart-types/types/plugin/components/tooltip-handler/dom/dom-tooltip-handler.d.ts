import type { IToolTipActual } from '../../../../typings/tooltip';
import { BaseTooltipHandler } from '../base';
import type { IDomTooltipStyle } from './interface';
import { TooltipModel } from './model/tooltip-model';
import type { Maybe } from '@visactor/vutils';
import type { ITooltipSpec, TooltipHandlerParams } from '../../../../component/tooltip';
import type { IComponentPluginService } from '../../interface';
export declare class DomTooltipHandler extends BaseTooltipHandler {
    static readonly type: string;
    readonly type: string;
    protected _tooltipContainer: HTMLElement;
    protected _domStyle: IDomTooltipStyle;
    protected _tooltipActual?: IToolTipActual;
    protected _container: Maybe<HTMLDivElement>;
    protected model: TooltipModel;
    getVisibility(): boolean;
    setVisibility(_value: boolean): void;
    constructor();
    onAdd(service: IComponentPluginService<any>): void;
    initEl(): void;
    protected _removeTooltip(): void;
    protected _updateTooltip(visible: boolean, params: TooltipHandlerParams, actualTooltip: IToolTipActual): void;
    protected _initStyle(): void;
    protected _getParentElement(spec: ITooltipSpec): HTMLElement;
    isTooltipShown(): boolean;
    reInit(): void;
}
export declare const registerDomTooltipHandler: () => void;
