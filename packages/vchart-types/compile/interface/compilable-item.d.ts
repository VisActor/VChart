import type { IGroupMark, IGrammarBase, IView } from '@visactor/vgrammar-core';
import type { Compiler } from '../compiler';
import type { Maybe, IPerformanceHook } from '../../typings';
export interface ICompilable {
  getCompiler: () => Compiler;
  getVGrammarView: () => IView;
  compile: () => void;
  compileMarks?: (group?: string | IGroupMark) => void;
  compileData?: () => void;
  compileSignal?: () => void;
  clear?: () => void;
  afterCompile?: () => void;
  release: () => void;
}
export interface ICompilableInitOption {
  getCompiler: () => Compiler;
  performanceHook?: IPerformanceHook;
}
export declare enum GrammarType {
  data = 'data',
  signal = 'signal',
  mark = 'mark'
}
export interface IGrammarItem extends ICompilable {
  id: number;
  grammarType: GrammarType;
  getProduct: () => Maybe<IGrammarBase>;
  generateProductId: () => string;
  getProductId: () => string;
  removeProduct: (reserveVGrammarModel?: boolean) => void;
  getDepend: () => IGrammarItem[];
  setDepend: (...depend: IGrammarItem[]) => void;
  updateDepend: () => boolean;
}
export type GrammarItemInitOption = ICompilableInitOption;
export type GrammarItemCompileOption = Record<string, any>;
