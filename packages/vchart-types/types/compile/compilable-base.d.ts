import type { Compiler } from './compiler';
import type { ICompilableInitOption, ICompilable } from './interface';
export declare abstract class CompilableBase implements ICompilable {
    protected _option: ICompilableInitOption;
    getOption(): ICompilableInitOption;
    getCompiler: () => Compiler;
    constructor(option: ICompilableInitOption);
    getVGrammarView(): import("@visactor/vgrammar-core").IView;
    abstract compile(): void;
    release(): void;
}
