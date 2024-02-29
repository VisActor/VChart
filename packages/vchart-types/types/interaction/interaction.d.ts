import type { StateValue } from '../compile/mark';
import type { IElement } from '@visactor/vgrammar-core';
import type { BaseEventParams } from '../event/interface';
import type { IMark } from '../mark/interface';
import type { IInteraction } from './interface';
import type { IInteraction as IVGrammarInteraction } from '@visactor/vgrammar-core';
export declare class Interaction implements IInteraction {
    private _stateMarks;
    private _stateElements;
    private _vgrammarInteractions;
    addVgrammarInteraction(state: StateValue, i: IVGrammarInteraction): void;
    static markStateEnable(mark: IMark, state: string): boolean;
    private _disableTriggerEvent;
    setDisableActiveEffect(disable: boolean): void;
    registerMark(state: StateValue, mark: IMark): void;
    getStateMark(state: StateValue): IMark[] | null;
    filterEventMark(params: BaseEventParams, state: StateValue): boolean;
    getEventElement(stateValue: StateValue): IElement[];
    getEventElementData(stateValue: StateValue): any[];
    exchangeEventElement(stateValue: StateValue, element: IElement): void;
    removeEventElement(stateValue: StateValue, element: IElement): void;
    addEventElement(stateValue: StateValue, element: IElement): void;
    clearEventElement(stateValue: StateValue, clearReverse: boolean): void;
    reverseEventElement(stateValue: StateValue): void;
    startInteraction(stateValue: StateValue, element: IElement): void;
    resetInteraction(stateValue: StateValue, element: IElement): void;
}
