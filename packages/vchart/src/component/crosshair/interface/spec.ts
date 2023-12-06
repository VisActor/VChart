import type { IPadding, StringOrNumber, ILineMarkSpec, IRectMarkSpec, ITextMarkSpec } from '../../../typings';
import type { IAxis } from '../../axis/interface';
import type { IComponentSpec } from '../../base/interface';
import type { IComponent } from '../../interface';

export interface ICrossHair extends IComponent {
  clearAxisValue?: () => void;
  setAxisValue?: (v: StringOrNumber, axis: IAxis) => void;
  layoutByValue?: (v?: number) => void;
  hide?: () => void;
}

export type CrossHairTrigger = 'click' | 'hover' | ['click', 'hover'];

export interface ICommonCrosshairSpec extends IComponentSpec {
  /**
   * 是否可以通过 点击 固定住一组 crosshair，也可以同时触发。
   * @default 'hover'
   */
  trigger?: CrossHairTrigger;
  /**
   * 隐藏crosshair的触发方式（目前仅支持和trigger一致的设置以及none）
   */
  triggerOff?: CrossHairTrigger | 'none';
  /**
   * crosshair 文本的显示层级
   */
  labelZIndex?: number;
  /**
   * crosshair 辅助图形的显示层级
   */
  gridZIndex?: number;
}

export interface ICartesianCrosshairSpec extends ICommonCrosshairSpec {
  /**
   * 笛卡尔坐标系下 x 轴上 crosshair 配置
   */
  xField?: ICrosshairCategoryFieldSpec;
  /**
   * 笛卡尔坐标系下 y 轴上 crosshair 配置
   */
  yField?: ICrosshairCategoryFieldSpec;
}

export interface IPolarCrosshairSpec extends ICommonCrosshairSpec {
  /**
   * 极坐标系下 categoryField 字段对应轴上的 crosshair 配置
   */
  categoryField?: ICrosshairCategoryFieldSpec;
  /**
   * 极坐标系下 valueField 字段对应轴上的 crosshair 配置
   */
  valueField?: ICrosshairValueFieldSpec;
}
export interface ICrosshairCategoryFieldSpec extends ICrosshairDataBindSpec {
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * crosshair 辅助图形配置
   */
  line?: ICrosshairLineSpec | Omit<ICrosshairRectSpec, 'width'>;
  /**
   * crosshair 文本配置
   */
  label?: ICrosshairLabelSpec;
}

export interface ICrosshairValueFieldSpec extends ICrosshairDataBindSpec {
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * crosshair 辅助图形配置
   */
  line?: ICrosshairLineSpec;
  /**
   * crosshair 文本配置
   */
  label?: ICrosshairLabelSpec;
}

export type ICrosshairLineStyle = Pick<
  ILineMarkSpec,
  'stroke' | 'strokeOpacity' | 'opacity' | 'lineDash' | 'lineWidth'
>;
export type ICrosshairRectStyle = ICrosshairLineStyle & Pick<IRectMarkSpec, 'fill' | 'fillOpacity' | 'cornerRadius'>;

export interface ICrosshairLineSpec {
  visible?: boolean;
  type?: 'line';
  /**
   * 线宽
   * @default 2
   */
  width?: number;
  /** 极坐标系下是否平滑 */
  smooth?: boolean;
  style?: ICrosshairLineStyle;
}

export type ICrosshairRectWidthCallback = (axisSize: { width: number; height: number }, axis: IAxis) => number;

export interface ICrosshairRectSpec {
  visible?: boolean;
  type?: 'rect';
  /**
   * 字符串xx%表示此处是内容区间的百分比，数字表示宽度像素，
   * 仅支持笛卡尔坐标系下的 crosshair 配置
   * @default '100%''
   */
  width?: number | string | ICrosshairRectWidthCallback;
  style?: ICrosshairRectStyle;
}

export interface ICrosshairLabelSpec {
  visible?: boolean;
  /**
   * label 文本格式化方法
   * @param text
   * @returns
   */
  formatMethod?: (text: StringOrNumber | string[]) => string | string[];
  /**
   * 文本样式配置
   */
  style?: Partial<ITextMarkSpec>;
  /**
   * 文本背景相关配置
   */
  labelBackground?: ICrosshairLabelBackgroundSpec;
}

export interface ICrosshairLabelBackgroundSpec {
  /**
   * 是否显示背景，默认为 true
   */
  visible?: boolean;
  /**
   * 最小宽度，像素值
   * @default 30
   */
  minWidth?: number;
  /**
   * 最大宽度，像素值。当文字超过最大宽度时，会自动省略。
   */
  maxWidth?: number;
  /**
   * 内部边距
   */
  padding?: IPadding | number | number[];
  style?: Partial<IRectMarkSpec>;
}

export interface ICrosshairDataBindSpec {
  /**
   * 声明 crosshair 绑定的轴索引，如果没有声明，则会默认绑定所有同 crosshair 位置相对应的轴。
   */
  bindingAxesIndex?: number[];
  /**
   * crosshair 初始化显示信息，通过该配置可在图表绘制时默认展示 crosshair 组件。
   */
  defaultSelect?: {
    /**
     * 声明要显示数据的轴索引
     */
    axisIndex: number;
    /**
     * 声明显示的数据
     */
    datum: StringOrNumber;
  };
}

export type ICrosshairSpec = ICartesianCrosshairSpec | IPolarCrosshairSpec;
