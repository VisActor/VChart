import type { DataView } from '@visactor/vdataset';
import type { IData as IVGrammarData } from '@visactor/vgrammar-core';
import { GrammarItem } from '../grammar-item';
import type { Maybe } from '../../typings';
import type { ICompilableData } from './interface';
import type { GrammarItemInitOption } from '../interface';
import { GrammarType } from '../interface/compilable-item';
export declare class CompilableData extends GrammarItem implements ICompilableData {
    readonly grammarType = GrammarType.data;
    protected _product: Maybe<IVGrammarData>;
    getProduct: () => Maybe<IVGrammarData>;
    protected _data: Maybe<DataView>;
    getDataView(): DataView;
    setDataView(d?: DataView): void;
    getLatestData(): any;
    constructor(option: GrammarItemInitOption, dataView?: DataView);
    release(): void;
    updateData(noRender?: boolean): Promise<any>;
    protected _compileProduct(): void;
    protected _initProduct(data: any[]): void;
    generateProductId(): string;
    protected _lookupGrammar(id: string): IVGrammarData;
}
