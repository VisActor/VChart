import type { IEvent } from '../event/interface';
import { LayoutItem } from './layout-item';
import type {
  IEffect,
  IModel,
  IModelInitOption,
  IModelOption,
  IModelRenderOption,
  IModelEvaluateOption,
  IModelSpec,
  ILayoutRect,
  IModelMarkInfo
} from './interface';
import type { CoordinateType } from '../typings/coordinate';
import type { IMark, IMarkOption, IMarkRaw, IMarkStyle } from '../mark/interface';
import type { Datum, StateValueType, ConvertToMarkStyleSpec, ICommonSpec, StringOrNumber, IRect } from '../typings';
import type { ITooltipHelper } from './tooltip-helper';
import type { CompilableData } from '../compile/data/compilable-data';
import { ModelStateManager } from './model-state-manager';
import type { IElement, IGroupMark, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
import { MarkSet } from '../mark/mark-set';
export declare abstract class BaseModel<T extends IModelSpec> extends LayoutItem<T> implements IModel {
  readonly type: string;
  readonly modelType: string;
  readonly id: number;
  userId: StringOrNumber | undefined;
  readonly event: IEvent;
  readonly effect: IEffect;
  protected _data: CompilableData;
  getData(): CompilableData;
  protected _specIndex: number;
  getSpecIndex(): number;
  readonly specKey: string;
  protected _originalSpec: any;
  protected _option: IModelOption;
  getOption(): IModelOption;
  protected _sceneNodeMap: Map<string, IElement>;
  protected _marks: MarkSet;
  getMarks(): IMark[];
  getMarkNameMap(): Record<string, IMark>;
  getMarkSet(): MarkSet;
  getMarkInfoList(): IModelMarkInfo[];
  getChart(): import('../chart/interface').IChart;
  state: ModelStateManager;
  getState(): {
    [key: string]: unknown;
    layoutUpdateRank: number;
  };
  protected _theme?: any;
  protected _lastLayoutRect: ILayoutRect;
  protected _tooltipHelper: ITooltipHelper | undefined;
  get tooltipHelper(): ITooltipHelper;
  protected _isLayout: boolean;
  constructor(spec: T, option: IModelOption);
  coordinate?: CoordinateType;
  protected _releaseEvent(): void;
  created(): void;
  updateState(newState: Record<string, unknown>): Promise<any>;
  init(option: IModelInitOption): void;
  afterInit(): void;
  onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect, ctx: any): void;
  onLayoutEnd(ctx: any): void;
  protected _forceLayout(): void;
  onEvaluateEnd(ctx: IModelEvaluateOption): void;
  abstract onRender(ctx: IModelRenderOption): void;
  onDataUpdate(): void;
  beforeRelease(): void;
  release(): void;
  updateSpec(spec: any): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  protected _transformSpec(): void;
  protected _compareSpec(): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  reInit(theme?: any): void;
  protected _initTheme(theme?: any): void;
  setTheme(theme?: any): void;
  protected _mergeMarkTheme(): void;
  protected _mergeThemeToSpec(): void;
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T>;
  protected _shouldMergeThemeToSpec(): boolean;
  protected _prepareSpecBeforeMergingTheme(obj?: any): any;
  protected _prepareSpecAfterMergingTheme(obj?: any): any;
  setCurrentTheme(theme: any, noRender?: boolean): void;
  updateLayoutAttribute(): void;
  setAttrFromSpec(): void;
  protected _convertMarkStyle<T extends ICommonSpec = ICommonSpec>(
    style: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>
  ): Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>;
  setMarkStyle<T extends ICommonSpec>(
    mark: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ): void;
  initMarkStyleWithSpec(mark?: IMark, spec?: any, key?: string): void;
  protected stateKeyToSignalName(key: string, opt?: string): string;
  compileData(): void;
  compileMarks(group?: string | IGroupMark): void;
  compileSignal(): void;
  bindSceneNode(node: IElement): void;
  getSceneNodes(): IElement[];
  getSceneNodeMarks(): IVGrammarMark[];
  protected _createMark<T extends IMark>(markInfo: IModelMarkInfo, option?: Partial<IMarkOption>): T;
  protected _getDataIdKey(): string | ((datum: Datum) => string) | undefined;
}
