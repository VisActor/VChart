import type { IElement, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
import type { Datum, StringOrNumber } from '../../typings';
import type { IStateManagerOption } from '../signal/interface';
import { StateManager } from '../signal/state-manager';
import type { CompilableMark } from './compilable-mark';
import type { IStateInfo, StateValue } from './interface';
export declare class MarkStateManager extends StateManager {
  protected _mark: CompilableMark;
  private _stateInfoList;
  getStateInfoList(): IStateInfo[];
  constructor(option: IStateManagerOption, mark: CompilableMark);
  protected _getDefaultStateMap(): Record<string, unknown>;
  getStateInfo(stateValue: StateValue): IStateInfo;
  addStateInfo(stateInfo: IStateInfo): void;
  private _clearStateBeforeSet;
  changeStateInfo(stateInfo: Partial<IStateInfo>): void;
  clearStateInfo(stateValues: StateValue[]): void;
  checkOneState(
    renderNode: IElement,
    datum: Datum | Datum[],
    state: IStateInfo,
    isMultiMark?: boolean
  ): 'in' | 'out' | 'skip';
  checkState(renderNode: IElement, datum: Datum | Datum[]): StateValue[];
  checkDatumState(state: IStateInfo, datum: Datum | Datum[], isMultiMark: boolean): boolean;
  checkItemsState(state: IStateInfo, item: any): boolean | undefined;
  checkFieldsState(state: IStateInfo, datum: Datum | Datum[], item: any, isMultiMark: boolean): boolean;
  checkLinearFieldState(domain: StringOrNumber[], key: string, datum: any, item: any, isMultiMark: boolean): boolean;
  updateLayoutState(noRender?: boolean): Promise<void>;
  compileState(product: IVGrammarMark): void;
}
