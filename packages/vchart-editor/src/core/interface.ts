import type { DataView } from '@visactor/vdataset';
import type { IChartModel, MarkerTypeEnum } from './../elements/chart/interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { IGraphic, IGroup, IStage } from '@visactor/vrender';
import type { IElement, IElementData } from './../elements/interface';
import type { ILayoutAttribute, IPoint, IRect } from '../typings/space';
import type { IModelSpec } from '../elements/chart/spec-process/interface';
import type { VChartEditor } from './vchart-editor';
import type { KEYS } from './const';
import type { EditorActionMode, EditorActiveTool } from './enum';
export interface ILayerData {
  id: string | number;
  type: 'chart' | string;
  elements: IElementData[];
}

export type IModelInfoSpecKey = {
  specKey: string;
  specIndex: number;
};
export type IModelInfo = IModelInfoSpecKey & {
  id?: string | number; // id in spec, model.userId
};

export type EditorMode = 'view' | 'editor';

export interface IEditorLayer {
  id: string | number;
  type: string;
  elements: IElement[];
  editorGroup: IGroup;
  elementGroup: IGroup;
  activeElement: IEditorElement | IEditorElement[];
  isInActive: boolean;
  readonly isElementReady: boolean;

  container: HTMLDivElement;
  getStage: () => IStage;
  getCanvas: () => HTMLCanvasElement;
  getAABBBounds: () => IBoundsLike;
  resizeLayer: (width: number, height: number, x: number, y: number, scale: number) => void;
  onElementReady: (callBack: () => void) => void;
  transformPosToLayer: (pos: IPoint) => IPoint;
  transformPosToClient: (pos: IPoint) => IPoint;
  getLayoutLineInLayer: () => ILayoutLine[];
  getEditor: () => VChartEditor;

  changeElementLayoutZIndex: (
    elementId: string,
    opt: { zIndex?: number; action: 'toTop' | 'toBottom' | 'levelUp' | 'levelDown' }
  ) => void;

  removeElement: (id: string | number, triggerHistory: boolean) => void;
  release: () => void;
}

export interface IEditorData {
  setDataKey: (key: string) => void;
  setLayers: (getLayers: () => IEditorLayer[]) => void;
  save: () => Promise<void>;
  load: () => Promise<ILayerData[]>;
  data: ILayerData[];
}

export interface IVChartEditorInitOption {
  id: string | number;
  dom: string | HTMLDivElement;
  data: IEditorData;
  mode: EditorMode;
}

export type IDataAttributeParam =
  | {
      type: 'csv';
      value: string;
    }
  | {
      type: 'aeolus';
      value:
        | {
            url: string;
          }
        | {
            rid: string;
          };
    };

export interface IUpdateAttributeParam {
  // 布局
  layout?: Partial<ILayoutAttribute>;
  // 模块spec更新
  spec?: {};
  // 色板
  color?: string[];
  // 当打开图表完整配置时，图表某几个模块spec更新
  modelSpec?: IModelSpec[];

  // 添加line标注
  markLine?: {
    /**
     * TODO: 补充 markLine  的 spec
     */
    spec?: any;
    type?:
      | MarkerTypeEnum.growthLine
      | MarkerTypeEnum.hierarchyDiffLine
      | MarkerTypeEnum.horizontalLine
      | MarkerTypeEnum.verticalLine
      | MarkerTypeEnum.totalDiffLine;
    enable?: boolean;
  };
  // 添加area标注
  markArea?: {
    /**
     * TODO: 补充 markLine  的 spec
     */
    spec?: any;
    type?: MarkerTypeEnum.verticalArea | MarkerTypeEnum.horizontalArea;
    enable?: boolean;
  };

  // 更改图表类型
  chartType?: string;

  // 更换图表类型时，是否清空当前图表的全部内容
  clearCurrent?: boolean;

  // 数据更新
  data?: IDataAttributeParam;

  // 层级更新
  zIndex?: 'toTop' | 'toBottom' | 'levelUp' | 'levelDown';
}

export interface IUpdateAttributeOption {
  triggerHistory?: boolean;
  actionType?: 'data-add' | 'data-change' | 'data-replace' | string;
}

export interface IEditorElement {
  type: 'chart' | 'group' | 'graphics';
  layer: IEditorLayer;
  id: string | number;
  elementId: string | number;
  rect?: IRect;
  /**
   * graphics 类型
   */
  graphicsType?: string;
  /**
   * graphics 某一部分
   */
  part?: string;
  /**
   * vchart 图表类型
   */
  chartType?: string;
  /**
   * vchart 图表模版信息
   */
  tempInfo?: any;
  /**
   * vchart 模型实例
   */
  model: IChartModel;
  modelInfo: IModelInfo;
  /**
   * vchart 模块原始配置
   */
  originSpec?: any;
  /**
   * vchart 色板
   */
  color?: string[];
  /**
   * vchart 全部模块配置
   */
  allModel?: IModelSpec[];
  /**
   * vchart 全部模块配置
   */
  chartData?: DataView | DataView[];
  // 内部拖拽编辑配置
  editProperties?: {
    // layout
    move?: boolean;
    rotate?: boolean;
    resize?: boolean;
    //
  } & { [key: string]: unknown };
  updateAttribute: (attr: IUpdateAttributeParam, option?: IUpdateAttributeOption) => false | { [key: string]: unknown };
  editorFinish: () => void;
  updateElement: () => void;
  updateRect: (rect: IRect) => void;
}

export type EditorHandlerFunc = (el: IEditorElement) => void;

export interface IEditorController {
  container: HTMLElement;
  currentEditorElement: IEditorElement;
  setEditorElements: (el: IEditorElement, event?: PointerEvent) => void;
  removeEditorElements: () => void;
  editorEnd: () => void;
  editorRun: (type: string) => void;

  // 新编辑元素进入编辑时
  addStartHandler: (handler: EditorHandlerFunc) => void;
  removeStartHandler: (handler: EditorHandlerFunc) => void;
  // 编辑结束时
  addEndHandler: (handler: EditorHandlerFunc) => void;
  removeEndHandler: (handler: EditorHandlerFunc) => void;
  // 内部编辑开始时
  addRunHandler: (handler: (type: string) => void) => void;
  removeRunHandler: (handler: (type: string) => void) => void;

  // over border
  setOverGraphic: (graphic: IGraphic, id: string | number, event: PointerEvent) => void;
  /**
   * 移除 hover 元素
   * @returns void
   */
  removeOverGraphic: () => void;
  currentOverGraphicId: string | number;

  release: () => void;
}

export interface ILayoutLine extends Partial<IModelInfo> {
  orient: 'x' | 'y';
  type: 'start' | 'middle' | 'end';
  value: number;
  start: number;
  end: number;
  rect: IRect;
}

export type HistorySnapshot = any;

export type ElementInfo = {
  id: string | number;
  layerId: string | number;
  type: string;
};

export interface IHistory {
  element: ElementInfo;
  from: HistorySnapshot;
  to: HistorySnapshot;
  // 将数据从 from 改为 to 或者从 to 改为 from
  use: (element: ElementInfo, from: HistorySnapshot, to: HistorySnapshot) => void;
}

export interface IElementPathRoot extends IElementPath {
  elementId: string | number;
  opt?: any;
  rect: IRect;
  isBackup?: boolean;
}

export interface IElementPath {
  index: number;
  child: IElementPath | IElementPathEnd;
}

export interface IElementPathEnd {
  percentX: number;
  percentY: number;
}

// 键盘类型
export type Key = keyof typeof KEYS;

// 编辑器状态
export interface EditorState {
  /**
   * 当前激活的画布工具
   */
  activeTool?: EditorActiveTool.chart | EditorActiveTool.data | EditorActiveTool.line | EditorActiveTool.text;
  /**
   * 当前画布的操作状态
   * 1. `add-tool` 添加画布元素时
   */
  actionMode?: EditorActionMode.addTool | EditorActionMode.changeChart | EditorActionMode.editData | string;
}
