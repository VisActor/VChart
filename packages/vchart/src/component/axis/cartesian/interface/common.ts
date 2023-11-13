import type { SegmentAttributes, AxisLabelOverlap } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
import type { IAxis, IAxisLocationCfg, IDomainLine, ILabel, ITickCallbackOption, ITitle } from '../../interface';
import type { ITextMarkSpec, StringOrNumber } from '../../../../typings';

export type ICartesianDomainLineSpec = {
  startSymbol?: SegmentAttributes['startSymbol'];
  endSymbol?: SegmentAttributes['endSymbol'];
  // /**
  //  * TODO: 待支持
  //  * 坐标轴截断范围，当需要对坐标轴轴线截断时，可配置该属性
  //  */
  // breakRange?: [number, number];
  // /**
  //  * TODO: 待支持
  //  * 截断区域的形状
  //  */
  // breakShape?: SymbolType | [SymbolType, SymbolType];
  // /**
  //  * TODO: 待支持
  //  * 截断图形样式
  //  */
  // breakShapeStyle?: Partial<IAttribute>;
  /**
   * X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上，只有在另一个轴为数值轴且包含 0 刻度时有效。
   * 默认为 false，交由用户按需打开
   */
  onZero?: boolean;
  /**
   * 当有多轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上。
   * Tips: 该索引对应所有轴的 index
   */
  onZeroAxisIndex?: number;
  /**
   * 当有多轴时，可以用这个属性手动指定，在哪个轴的 0 刻度上。
   */
  onZeroAxisId?: StringOrNumber;
};
export type ICartesianDomainLine = IDomainLine & ICartesianDomainLineSpec;

export type ICartesianTitle = ITitle & {
  /**
   * 标题是否根据轴方向自动渲染，生效于左右纵轴。
   * 默认为 true，表现为左轴标题整体旋转 -90 度，右轴标题整体旋转为 90 度。
   * **如果需要单独在 `textStyle` 中配置文本的 angle 的话，建议将该属性设置为 false。**
   * @default true
   */
  autoRotate?: boolean;
  /**
   * 标题朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
};

export type ICartesianLabel = ILabel & {
  /**
   * If labels at the beginning or end of the axis should be aligned flush with the scale range.
   * 坐标轴首尾文字向内收缩
   * @default false
   */
  flush?: boolean;
  // /**
  //  * 第一个坐标轴文字是否显示。默认根据标签重叠策略自动判定。
  //  * @default null
  //  */
  // firstVisible?: boolean | null;
  /**
   * `sampling` 开启时生效。
   * 最后一个坐标轴文字是否显示。默认根据标签重叠策略自动判定。
   * @default null
   */
  lastVisible?: boolean | null;
  /**
   * label 相对于容器整体的对齐方式
   * - `top`：整体向上对齐（垂直方向）
   * - `middle`：整体居中对齐（垂直方向）
   * - `bottom`：整体向下对齐（垂直方向）
   * - `left`：整体向左对齐（水平方向）
   * - `center`：整体居中对齐（水平方向）
   * - `right`：整体向右对齐（水平方向）
   * @since 1.3.0
   */
  containerAlign?: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle';
} & AxisLabelOverlap;

export interface ILinearAxis extends IAxis {
  readonly zero: boolean;
  readonly nice: boolean;

  // 用户其他模块扩充轴scale的区间
  setExtendDomain: (key: string, value: number | undefined) => void;
}

export interface IAxisHelper {
  isContinuous: boolean;

  dataToPosition: (values: any[], cfg?: IAxisLocationCfg) => number;
  valueToPosition?: (value: any, cfg?: IAxisLocationCfg) => number;
  getScale?: (depth: number) => IBaseScale;
  getBandwidth?: (depth: number) => number; // band轴特有

  // 用户其他模块扩充轴scale的区间
  setExtendDomain?: (key: string, value: number | undefined) => void;

  // domain 类型是any[]
  getStatisticsDomain?: () => {
    domain: any[];
    index: { [key in StringOrNumber]: number };
  };

  getAxisType: () => string;

  getAxisId: () => number;

  isInverse: () => boolean;

  // 在地理坐标系系列中，传递经纬度配置字段
  getFields?: () => string[];
}

export interface ITimeLayerType {
  /**
   * tick间隔
   */
  tickStep?: number;
  /**
   * 时间转换格式
   * @default '%Y%m%d'
   */
  timeFormat?: string;
  /**
   * 时间转换模式
   * @default 'local'
   */
  timeFormatMode?: 'utc' | 'local'; // todo: 'iso'
  /**
   * 期望的连续轴tick数量
   * The desired number of ticks draw on linear axis.
   * @default 5
   * @description 建议的tick数量，并不保证结果一定是配置值
   * @since 1.4.0 后支持函数回调方式配置
   */
  tickCount?: number | ((option: ITickCallbackOption) => number);
  /**
   * 强制设置tick数量
   * The exact number of ticks draw on linear axis. Might lead to decimal step.
   * @default 5
   * @description 强制设置的tick数量，可能由于数据范围导致tick值为小数
   */
  forceTickCount?: number;
}

export type ICartesianAxisUnit = {
  /**
   * 是否显示坐标轴单位
   */
  visible: boolean;

  /**
   * 轴单位名称
   */
  text?: string | number | number[] | string[];
  /**
   * 单位样式
   */
  style?: ITextMarkSpec;
};
