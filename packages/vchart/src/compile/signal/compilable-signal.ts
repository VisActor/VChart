import type { ISignal, SignalFunctionType } from '@visactor/vgrammar-core';
import { GrammarItem } from '../grammar-item';
import type { Maybe } from '../../typings';
import type { GrammarItemInitOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { GrammarType } from '../interface/compilable-item';
import type { ICompilableSignal } from './interface';

export class CompilableSignal<T> extends GrammarItem implements ICompilableSignal<T> {
  readonly grammarType = GrammarType.signal;
  protected declare _product: Maybe<ISignal<T>>;
  declare getProduct: () => Maybe<ISignal<T>>;

  readonly name: string;

  /** signal 的值 */
  protected _value: Maybe<T>;
  getValue() {
    return this._value;
  }
  /** signal 的值回调 */
  protected _updateFunc: Maybe<SignalFunctionType<T>>;
  getUpdateFunc() {
    return this._updateFunc;
  }

  constructor(option: GrammarItemInitOption, name: string, value?: T, updateFunc?: SignalFunctionType<T>) {
    super(option);
    this.name = name;
    this._value = value;
    this._updateFunc = updateFunc;
  }

  /** 更新 signal */
  updateSignal(value?: T, updateFunc?: SignalFunctionType<T>) {
    this._value = value;
    this._updateFunc = updateFunc;
    this.compile();
  }

  protected _compileProduct() {
    // 不需要编译了
  }

  generateProductId(): string {
    return this.name;
  }

  protected _lookupGrammar(id: string) {
    return this.getCompiler().getVGrammarView()?.getSignalById(id);
  }
}
