import type { IContainerSize } from '@visactor/vrender-components';
import type { IGraphicAttribute as IAttribute } from '@visactor/vrender';

export interface ITextAttrs extends Partial<IAttribute> {
  // /** 标题宽高大小 */
  // size: IContainerSize;
  /** 文本内容 */
  text: string;
  /** 其他图形样式，暂时这么处理 */
  [key: string]: any;
}

export interface ISymbolAttrs extends Partial<IAttribute> {
  /** 图形 path */
  path: string;
  size: number;
  symbolType: string;
  /** 其他图形样式，暂时这么处理 */
  [key: string]: any;
}

export interface IContentAttrs {
  /** key 对应图形样式 */
  key?: ITextAttrs;
  /** value 对应图形样式 */
  value?: ITextAttrs;
  /** shape 对应图形样式 */
  symbol?: ISymbolAttrs;
  /** 内容区整体的高度 */
  height: number;
}

export interface ITooltipAttrsCache {
  /** tooltip 容器宽度 */
  containerSize: IContainerSize;
  /** tooltip 标题样式 */
  title?: ITextAttrs;
  /** 标题 shape */
  titleSymbol?: ISymbolAttrs;
  /** 标题组容器的宽高（包含 shape 和 title 文本） */
  titleContainerSize: IContainerSize;
  /** tooltip 内容项样式 */
  content?: IContentAttrs[];
  /** 内容项是否配置 shape */
  hasContentShape: boolean;
  /** 内容项 key 的最大宽度，用于布局，因为 key 需要按照列对齐 */
  keyWidth: number;
  /** 内容项 value 的最大宽度，用于布局，因为 value 需要按照列对齐 */
  valueWidth: number;
}
