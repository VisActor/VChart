import type { IComponent } from '../../interface';
import type { ITextGraphicAttribute, IRichTextCharacter, RichTextWordBreak } from '@visactor/vrender';
import type { IOrientType, IPadding, StringOrNumber } from '../../../typings';
import type { IComponentSpec } from '../../base/interface';

export interface ITitleSpec extends Omit<IComponentSpec, 'orient'> {
  /**
   * 是否显示标题
   */
  visible?: boolean;
  /**
   * Title位置
   * @default 'top'
   */
  orient?: IOrientType;
  /**
   * 主标题内容
   */
  text: Text | Text[];
  /**
   * 副标题内容
   */
  subtext?: Text | Text[];
  /**
   * 标题左上角x坐标像素值
   */
  x?: number;
  /**
   * 标题左上角y坐标像素值
   */
  y?: number;
  /**
   * 标题宽度
   */
  width?: number;
  /**
   * 标题高度
   */
  height?: number;
  /**
   * 最小宽度，像素值
   */
  minWidth?: number;
  /**
   * 最大宽度，像素值。当文字超过最大宽度时，会自动省略。
   */
  maxWidth?: number;
  /**
   * 最小高度，像素值
   */
  minHeight?: number;
  /**
   * 最大高度，像素值
   */
  maxHeight?: number;
  /**
   * 标题的边距留白
   */
  innerPadding?: IPadding | number | number[];
  /**
   * 文字水平对齐方式
   * 'left' | 'center' | 'right'
   */
  align?: string;
  /**
   * 文字垂直对齐方式
   * 'top' | 'middle' | 'bottom'
   */
  verticalAlign?: string;
  /**
   * 主标题样式
   */
  textStyle?: {
    width?: number;
    height?: number;
    /**
     * 文字水平对齐方式
     * 'left' | 'center' | 'right'
     */
    align?: string;
    /**
     * 文字垂直对齐方式
     * 'top' | 'middle' | 'bottom'
     */
    verticalAlign?: string;
    /**
     * 折行方式
     * 'break-word' | 'break-all'
     */
    wordBreak?: RichTextWordBreak;
    /**
     * 按照宽度限制自动折行或显示省略号(maxLineWidth)
     * 默认设置为title宽度
     */
    maxLineWidth?: number;
    /**
     * 高度限制控制显示内容及省略号(heightLimit)
     */
    heightLimit?: number;
    /**
     * 按照行数限制显示内容及省略号(lineClamp)
     */
    lineClamp?: number;
    /**
     * 富文本配置
     */
    character?: IRichTextCharacter[];
  } & Partial<ITextGraphicAttribute>;
  /**
   * 副标题样式
   */
  subtextStyle?: {
    /** 指定宽度 */
    width?: number;
    /** 指定高度 */
    height?: number;
    /**
     * 文字水平对齐方式
     * 'left' | 'center' | 'right'
     */
    align?: string;
    /**
     * 文字垂直对齐方式
     * 'top' | 'middle' | 'bottom'
     */
    verticalAlign?: string;
    /**
     * 折行方式
     * 'break-word' | 'break-all'
     */
    wordBreak?: RichTextWordBreak;
    /**
     * 按照宽度限制自动折行或显示省略号(maxLineWidth)
     * 默认设置为title宽度
     */
    maxLineWidth?: number;
    /**
     * 高度限制控制显示内容及省略号(heightLimit)
     */
    heightLimit?: number;
    /**
     * 按照行数限制显示内容及省略号(lineClamp)
     */
    lineClamp?: number;
    /**
     * 富文本配置
     */
    character?: IRichTextCharacter[];
  } & Partial<ITextGraphicAttribute>;
}

export type Text = StringOrNumber;

export type ITitle = IComponent;
