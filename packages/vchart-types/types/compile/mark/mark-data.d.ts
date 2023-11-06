import { CompilableData } from '../data/compilable-data';
import type { ICompilableMark, IMarkDataInitOption } from './interface';
export declare class MarkData extends CompilableData {
    protected _mark: ICompilableMark;
    constructor(option: IMarkDataInitOption);
    setCompiledProductId(name: string): void;
    generateProductId(): string;
    protected _compileProduct(): void;
}
