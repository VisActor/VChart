import type { IGrammarBase } from '@visactor/vgrammar-core';
import type { Maybe } from '../typings';
import { CompilableBase } from './compilable-base';
import type { GrammarItemCompileOption, GrammarType, IGrammarItem, GrammarItemInitOption } from './interface';
export declare abstract class GrammarItem extends CompilableBase implements IGrammarItem {
    grammarType: GrammarType;
    protected _option: GrammarItemInitOption;
    readonly id: number;
    protected _product: Maybe<IGrammarBase>;
    getProduct(): IGrammarBase;
    protected abstract _lookupGrammar(id: string): IGrammarBase;
    protected _compiledProductId: string;
    abstract generateProductId(): string;
    getProductId(): string;
    protected _depend: IGrammarItem[];
    getDepend(): IGrammarItem[];
    setDepend(...depend: IGrammarItem[]): void;
    compile(option?: GrammarItemCompileOption): void;
    protected abstract _compileProduct(option?: GrammarItemCompileOption): void;
    protected _afterCompile(option?: GrammarItemCompileOption): void;
    updateDepend(): boolean;
    release(): void;
    removeProduct(reserveVGrammarModel?: boolean): void;
}
