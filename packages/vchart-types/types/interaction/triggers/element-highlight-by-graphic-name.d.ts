import { ElementHighlight } from './element-highlight';
import type { BaseEventParams } from '../../event/interface';
export declare class ElementHighlightByGraphicName extends ElementHighlight {
    static type: string;
    type: string;
    protected _filterByName(e: BaseEventParams): boolean;
    protected _parseTargetKey(e: BaseEventParams): string;
    start(itemKey: any): void;
    reset(): void;
    handleStart: (e: BaseEventParams) => void;
    handleReset: (e: BaseEventParams) => void;
}
export declare const registerElementHighlightByGraphicName: () => void;
