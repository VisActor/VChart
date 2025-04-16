import type { ICompilableInitOption, ICompilable, ICompiler } from './interface';

/** 可以编译的类的统一基类 */
export abstract class CompilableBase implements ICompilable {
  protected _option: ICompilableInitOption;
  getOption() {
    return this._option;
  }

  getCompiler: () => ICompiler;

  constructor(option: ICompilableInitOption) {
    this._option = option;
    this.getCompiler = this._option.getCompiler;
  }

  getVGrammarView() {
    return this.getCompiler()?.getVGrammarView();
  }

  abstract compile(): void;

  release() {
    this._option = null;
    this.getCompiler = null;
  }
}
