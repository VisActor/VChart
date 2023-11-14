import type { IGrammarBase } from '@visactor/vgrammar-core';
import type { Maybe } from '../typings';
import { isValid } from '@visactor/vutils';
import { createID } from '../util/id';
import { CompilableBase } from './compilable-base';
import type { GrammarItemCompileOption, GrammarType, IGrammarItem, GrammarItemInitOption } from './interface';

/** 可以直接编译为一个 VGrammar 语法元素的类的统一基类 */
export abstract class GrammarItem extends CompilableBase implements IGrammarItem {
  grammarType: GrammarType;

  protected declare _option: GrammarItemInitOption;

  /** id */
  readonly id: number = createID();

  protected _product: Maybe<IGrammarBase>;
  /** 获取编译产物 */
  getProduct() {
    if (isValid(this._product)) {
      return this._product;
    }
    const view = this.getVGrammarView();
    const id = this.getProductId();
    if (isValid(id) && isValid(view)) {
      this._product = this._lookupGrammar(id); // 更新product
    }
    return this._product;
  }

  protected abstract _lookupGrammar(id: string): IGrammarBase;

  /** 已经编译完成的产物的 name */
  protected _compiledProductId: string = null;
  /** 生成产物 name */
  abstract generateProductId(): string;
  /** 获取产物 name */
  getProductId() {
    return this._compiledProductId ?? this.generateProductId();
  }

  /** 该语法元素依赖于哪些语法元素 */
  protected _depend: IGrammarItem[] = [];
  getDepend() {
    return this._depend;
  }
  setDepend(...depend: IGrammarItem[]) {
    this._depend = depend;
  }

  /** 编译入口（尽量不重写这个方法） */
  compile(option?: GrammarItemCompileOption): void {
    this._compileProduct(option);
    this._afterCompile(option);
  }

  /** 编译主过程 */
  protected abstract _compileProduct(option?: GrammarItemCompileOption): void;

  /** 编译后的逻辑 */
  protected _afterCompile(option?: GrammarItemCompileOption) {
    if (isValid(this._product)) {
      this.getCompiler()?.addGrammarItem(this);
    }
  }

  /** 更新语法元素的依赖，返回是否全部成功更新 */
  updateDepend(): boolean {
    if (isValid(this._product)) {
      const depend = this.getDepend()
        .map(item => item.getProduct())
        .filter(isValid);
      // 更新依赖
      this._product.depend(depend);
      return depend.length === this.getDepend().length;
    }
    return false;
  }

  release() {
    this.removeProduct();
    super.release();
    this._depend = [];
  }

  /**
   * 删除编译产物
   * @param reserveVGrammarModel 是否保留 view 中的语法元素
   */
  removeProduct(reserveVGrammarModel?: boolean) {
    const compiler = this.getCompiler();
    compiler.removeGrammarItem(this, reserveVGrammarModel);
    this._product = null;
    this._compiledProductId = null;
  }
}
