import type { IGroupMark, IGrammarBase, IView } from '@visactor/vgrammar';
import type { Compiler } from '../compiler';
import type { Maybe, IPerformanceHook } from '../../typings';

export interface ICompilable {
  /** 获取 compile 对象 */
  getCompiler: () => Compiler;
  /** 获取 vgrammar view */
  getVGrammarView: () => IView;

  /** 编译总入口 */
  compile: () => void;
  /** 编译所有 mark */
  compileMarks?: (group?: string | IGroupMark) => void;
  /** 编译所有 data */
  compileData?: () => void;
  /** 编译所有 signal */
  compileSignal?: () => void;

  /** 释放总入口 */
  release: () => void;
}

export interface ICompilableInitOption {
  /** 编译对象 应当由外部提供 */
  getCompiler: () => Compiler;
  /** 性能测试钩子 */
  performanceHook?: IPerformanceHook;
}

export enum GrammarType {
  data = 'data',
  signal = 'signal',
  mark = 'mark'
}

export interface IGrammarItem extends ICompilable {
  id: number;
  /** 语法元素类型 */
  grammarType: GrammarType;
  /** 获取语法元素 */
  getProduct: () => Maybe<IGrammarBase>;
  /** 生成语法元素名称 */
  generateProductId: () => string;
  /** 获取语法元素名称 */
  getProductId: () => string;
  /** 删除已编译的语法元素 */
  removeProduct: (reserveVGrammarModel?: boolean) => void;
  /** 获取该语法元素依赖的语法元素 */
  getDepend: () => IGrammarItem[];
  /** 设置该语法元素依赖的语法元素 */
  setDepend: (...depend: IGrammarItem[]) => void;
  /** 更新语法元素的依赖，返回是否全部成功更新 */
  updateDepend: () => boolean;
}

export type GrammarItemInitOption = ICompilableInitOption;

export type GrammarItemCompileOption = Record<string, any>;
