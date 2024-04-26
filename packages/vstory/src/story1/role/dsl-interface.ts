import { ITextGraphicAttribute } from '@visactor/vrender-core';

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

export interface IRoleSpecBase {
  id: string;
  type: string; // 类型
  position: IWidgetData; // 定位描述
  zIndex: number;
}

export type IEditorTextGraphicAttribute = {
  graphicAlign?: 'left' | 'center' | 'right';
  graphicBaseline?: 'top' | 'middle' | 'bottom';
} & ITextGraphicAttribute;

export interface IComponentRoleSpec extends IRoleSpecBase {
  options: {
    graphic: any;
    text: IEditorTextGraphicAttribute;
    isResized?: boolean;
    angle: number;
    shapePoints: any;
  };
}

export interface IChartRoleSpec extends IRoleSpecBase {
  options: {
    // 各种图表配置属性
    theme?: any;
    // 数据源
    data?: any;
    // 内部模块布局信息
    layout?: any;
    // 色板
    color?: string[];
    // 标注
    marker?: any;
    // mark单元素样式配置
    markStyle?: any[];
    // 组样式
    dataGroupSpec?: {
      [key: string]: any;
    };
  };
}

export type IRoleSpec = IChartRoleSpec | IComponentRoleSpec;
