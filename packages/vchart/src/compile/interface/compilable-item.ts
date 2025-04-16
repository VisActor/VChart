import type { IGroupMark, IGrammarBase, IView, IRenderer, InteractionSpec } from '@visactor/vgrammar-core';
import type { Maybe, IPerformanceHook, StringOrNumber } from '../../typings';
import type { IColor, IStage } from '@visactor/vrender-core';
import type { IChart } from '../../chart/interface/chart';
import type { IVChart } from '../../core/interface';
import type { IMorphConfig } from '../../animation/spec';
import type { IBoundsLike } from '@visactor/vutils';
import type { EventSourceType, EventType } from '../../event/interface';

export type CompilerListenerParameters = {
  type: EventType;
  event: Event;
  source: EventSourceType;
  // FIXME: 这里 item 应当为场景树的 Item 类型
  item: any | null;
  datum: any | null;
  markId: number | null;
  modelId: number | null;
  markUserId: StringOrNumber | null;
  modelUserId: StringOrNumber | null;
};

export interface IProductMap<T extends IGrammarItem> {
  /** 编译产物 id 和对应的在 vchart 中的 GrammarItem */
  [productId: string]: IGrammarItemMap<T>;
}

export interface IGrammarItemMap<T extends IGrammarItem> {
  /** GrammarItem id 和 对应的引用 */
  [id: number]: T;
}

export type ICompilerModel = Record<GrammarType, IProductMap<IGrammarItem>>;

export interface ICompiler {
  isInited?: boolean;
  getVGrammarView: () => IView;
  getModel: () => ICompilerModel;
  getRenderer: () => IRenderer;
  getCanvas: () => HTMLCanvasElement | undefined;
  getStage: () => IStage | undefined;
  compile: (ctx: { chart: IChart; vChart: IVChart }, option: any) => void;
  clear: (ctx: { chart: IChart; vChart: IVChart }, removeGraphicItems?: boolean) => void;
  renderNextTick: (morphConfig?: IMorphConfig) => void;
  render: (morphConfig?: IMorphConfig) => void;
  updateViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
  resize: (width: number, height: number, reRender?: boolean) => void;
  setBackground: (color: IColor) => void;
  setSize: (width: number, height: number) => void;
  setViewBox: (viewBox: IBoundsLike, reRender?: boolean) => void;
  addEventListener: (
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ) => void;
  removeEventListener: (
    source: EventSourceType,
    type: string,
    callback: (params: CompilerListenerParameters) => void
  ) => void;
  release: () => void;
  releaseGrammar: (removeGraphicItems: boolean) => void;
  addGrammarItem: (grammarItem: IGrammarItem) => void;
  removeGrammarItem: (grammarItem: IGrammarItem, reserveVGrammarModel?: boolean) => void;
  addInteraction: (interaction: InteractionSpec & { seriesId?: number; regionId?: number }) => void;
  removeInteraction: (seriesId: number) => void;
  updateDepend: (items?: IGrammarItem[]) => boolean;
}

export interface ICompilable {
  /** 获取 compile 对象 */
  getCompiler: () => ICompiler;
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

  /** 清除compile 内容入口 */
  clear?: () => void;

  /** 全部编译完成 lift circle */
  afterCompile?: () => void;

  /** 释放总入口 */
  release: () => void;
}

export interface ICompilableInitOption {
  /** 编译对象 应当由外部提供 */
  getCompiler: () => ICompiler;
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
