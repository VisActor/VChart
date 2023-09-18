import type { ISeriesSpec, DirectionType, IMarkTheme, IMarkSpec } from '../../typings';
import type { ILabelSpec } from '../../component/label';
import type { ISymbolMarkSpec, ITextMarkSpec, IRippleMarkSpec } from '../../typings';
import type { SeriesMarkNameEnum } from '../interface/type';

export interface ICorrelationSeriesSpec extends ISeriesSpec {
  /**
   * 系列类型
   */
  type: 'correlation';

  /**
   * 数据字段配置
   */
  /** 节点名称字段配置 */
  categoryField: string;
  /** 相关性数据字段配置 */
  valueField: string;
  /** 节点系列字段配置 */
  seriesField?: string;
  /** 节点半径数据字段配置 */
  sizeField?: string;
  /** 节点半径映射范围 */
  sizeRange?: number[];

  /**
   * layout & position
   */
  /** 图表中心点位置 */
  center?: [string | number, string | number];
  /** 节点分布内半径 */
  innerRadius?: string | number;
  /** 节点分布外半径 */
  outerRadius?: string | number;
  /** 图表起始角度 */
  startAngle?: number;
  /** 图表终止角度 */
  endAngle?: number;

  /**
   * 图元配置
   */
  /** 水波纹图元属性 **/
  ripplePoint?: IMarkSpec<IRippleMarkSpec> & {
    /** 水波纹的半径范围, 支持百分比 */
    rippleRange?: number[] | string[];
  };
  /** 中心点图元属性 **/
  centerPoint?: IMarkSpec<ISymbolMarkSpec> & {
    /** 半径支持按照图表宽度的百分比配置 */
    radiusPercantage?: string;
  };
  /** 中心点label属性 **/
  centerLabel?: IMarkSpec<ITextMarkSpec>;
  /** 节点图元属性 **/
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;

  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: ILabelSpec & {
    /** 标签位置 */
    position?:
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center';
  };
}
