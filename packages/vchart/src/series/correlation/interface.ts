import type { ISeriesSpec, DirectionType, IMarkTheme, IMarkSpec } from '../../typings';
import type { ILabelSpec } from '../../component/label';
import type { ISymbolMarkSpec, ITextMarkSpec, IRippleMarkSpec } from '../../typings';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../polar/interface';
import type { IAnimationSpec } from '../../animation/spec';
// import type { CorrelationAppearPreset } from './animation';

type CorrelationMarks = 'point' | 'ripplePoint' | 'centerPoint' | 'centerLabel';

export interface ICorrelationSeriesSpec extends Omit<IPolarSeriesSpec, 'innerRadius' | 'outerRadius'> {
  // IAnimationSpec<CorrelationMarks, CorrelationAppearPreset>
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
  /** 图表中心点位置X坐标 */
  centerX?: number;
  /** 图表中心点位置Y坐标 */
  centerY?: number;
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

export interface ICorrelationSeriesTheme {
  [SeriesMarkNameEnum.point]?: IMarkTheme<ISymbolMarkSpec>;
  [SeriesMarkNameEnum.ripplePoint]?: IMarkTheme<IRippleMarkSpec>;
  [SeriesMarkNameEnum.centerPoint]?: IMarkTheme<ISymbolMarkSpec>;
  [SeriesMarkNameEnum.centerLabel]?: IMarkTheme<ITextMarkSpec>;
}
