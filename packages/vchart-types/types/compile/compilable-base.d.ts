import type { ICompilableInitOption, ICompilable, ICompiler } from './interface';
export declare abstract class CompilableBase implements ICompilable {
    protected _option: ICompilableInitOption;
    getOption(): ICompilableInitOption;
    getCompiler: () => ICompiler;
    constructor(option: ICompilableInitOption);
    getVGrammarView(): import("@visactor/vgrammar-core").IView;
    abstract compile(): void;
    release(): void;
}
