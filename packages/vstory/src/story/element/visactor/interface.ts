import type { EventEmitter } from '@visactor/vutils';
import type { IElement } from '../runtime-interface';
import type { ISpec, ITheme, IVChart } from '@visactor/vchart';
import { IGraphic, IGroup } from '@visactor/vrender-core';

type ILayoutData = any;

export type StandardData = IDataValue | IDataValue[];
export type IParserValue = any;
export type DataUpdateCall = (data: StandardData) => void;
export type DataErrorCall = (msg: { type: string; info: string }, opt?: any) => void;

// visactor 元素的内部结构
// 数据部分 start
// DataParser：数据处理。负责解析数据，得到模版可用数据，处理数据上的特性内容。
// VisactorTemp：模版处理。负责结合数据，生成对应类型的基础 spec。不同类型图表的特殊逻辑，在 temp 中处理
// DataTempTransform：数据与模版更新管理，当数据/模版更新时，通过这个模块判定更新是否成功，成功后抛出更新成功消息。包含 VisactorTemp 与 DataParser
// SpecProcess：编辑配置管理器，编辑属性更新的处理，对外输出合并了编辑信息的 spec 。包含一个 dataTempTransform
// 数据部分 end

// graphic 部分 start
// IVisactorGraphic：包含一个 vchart｜vtbale 。visactor 的自定义图元封装。处理图元是否重绘，viewBox的图元属性逻辑
// IVisactorGraphic-render：实际的 draw 入口，处理绘图过程，主要是处理变换矩阵。
// graphic 部分 end

// Visactor-element：编辑元素，包含一个 specProcess、IVisactorGraphic

export interface IDataTempTransform {
  readonly specTemp: IVisactorTemp;
  readonly dataParser: IDataParser;

  readonly nextTemp: IVisactorTemp;
  readonly nextDataParser: IDataParser;
  emitter: EventEmitter;

  updateChartDataTemp: (data?: { type: string; value: unknown }, temp?: string) => void;

  // 得到没有经过编辑器配置加工过的基础spec
  getBaseSpec: () => any;

  // 释放
  release: () => void;
}

export interface IDataTempTransformConstructor {
  new ({ specProcess, element }: { element: IVisactorElement; specProcess: ISpecProcess }): IDataTempTransform;
}

export interface ISpecProcess {
  dataTempTransform: IDataTempTransform;
  emitter: EventEmitter;

  // 得到编辑器元素的spec
  getElementSpec: () => ISpec;

  // temp
  getSpecTemp: () => string;

  release: () => void;
}

export type IDataType = any;

export interface IDataValue {
  id: string;
  sourceKey: string;
  values: IDataType[];
}

export type DataInfo = {
  [key: string]: {
    type: 'ordinal' | 'linear';
  };
};

export type DataSave = {
  type: string;
  value: any;
};

export interface IDataParser {
  type: string;
  getData: () => StandardData;
  getDataValue: () => IParserValue;
  getDataInfo?: () => DataInfo;
  getSpecOption?: () => any;
  getSave: () => DataSave;
  updateValue: (value: IParserValue) => void;
  setDataUpdateHandler: (call: DataUpdateCall) => void;
  setDataErrorHandler: (call: DataErrorCall) => void;
  clear: () => void;
}

export interface IDataParserConstructor {
  type: string;
  new (
    value: any,
    option: {
      updateCall: DataUpdateCall;
      errorCall: DataErrorCall;
      currentData?: IDataParser;
      emitter: EventEmitter;
    }
  ): IDataParser;
}

// chart & table 都是用这个模版接口
export interface IVisactorTemp {
  type: string;
  getSpec: (data: StandardData, info: DataInfo, ctx: any, opt?: any) => ISpec | null;
  getChartType: () => string;
  checkDataEnable: (data: StandardData, info: DataInfo, opt?: any) => boolean;
  getTempInfo?: () => any;
  clear: () => void;
}

export interface IVisactorTempConstructor {
  new (): IVisactorTemp;
}

// 绘图元素
export interface IVisactorGraphic extends IGroup {
  readonly vProduct: IVChart;
}

// 编辑元素
export interface IElementVisactor extends IElement {
  // 编辑内容的处理与存储
  readonly specProcess: ISpecProcess;
  // 数据源 与 模版
  readonly dataTempTransform: IDataTempTransform;

  // 清除编辑数据
  clearConfig: (opt: { clearCurrent: false | { [key: string]: any } }) => void;
}
