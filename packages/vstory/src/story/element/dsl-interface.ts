import { IRectGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender-core';

export type IPercent = `${number}%`;
export type WidgetNumber = number; // | IPercent;

export type IWidgetData = {
  left: WidgetNumber;
  top: WidgetNumber;
} & (
  | {
      bottom: WidgetNumber;
      right: WidgetNumber;
    }
  | {
      width: WidgetNumber;
      height: WidgetNumber;
    }
);

export interface IElementSpecBase {
  id: string;
  type: string; // 类型
  // layout: ILayoutData;// 布局描述
  widget: IWidgetData; // 定位描述
  zIndex: number;
}

export type IEditorTextGraphicAttribute = {
  graphicAlign?: 'left' | 'center' | 'right';
  graphicBaseline?: 'top' | 'middle' | 'bottom';
} & ITextGraphicAttribute;

export interface IElementGraphicsSpec extends IElementSpecBase {
  config: {
    temp: string; // 图形类型
    graphic: any;
    text: IEditorTextGraphicAttribute;
    isResized?: boolean;
    angle: number;
    shapePoints: any;
  };
}

export interface IElementChartSpec extends IElementSpecBase {
  config: {
    data: any; // 数据源
    temp: string; // 模版
    attribute: {
      // 可编辑属性
      theme: any;
      layout: any; // 内部模块布局信息
      color: string[];
      // 组件模块
      moduleSpec: IModuleSpec[];
      // 标注
      marker?: {};
      zIndex: number;
      barLink?: {};
      // 图表系列mark单元素样式配置
      markStyle?: IMarkStyle[];
      // 系列配置
      seriesSpec?: {
        [key: string]: ISeriesSpec;
      };
    };
  };
}

export interface IModuleSpec {
  id: string; // 唯一id 必须有，如果 spec 中没有，使用 ‘module.type_specIndex’
  type: string; // 模块类型
  spec: {}; // 与模块在 vchart / vtbale 中的 spec 配置保持一致
}

export interface ISeriesSpec extends IModuleSpec {
  spec: {
    barMinWidth: number;
    [key: string]: {}; // mark 样式直接与 vchart series spec 中的 mark 一致
  };
}

export interface IMarkStyle {
  seriesId: string;
  markName: string;
  id: string;
  style: {}; // 单个mark 只能修改style
}

export type IElementSpec = IElementChartSpec | IElementGraphicsSpec;
