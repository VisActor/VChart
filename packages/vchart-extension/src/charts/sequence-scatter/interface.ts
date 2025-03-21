import { IPlayerSpec } from '@visactor/vchart';
import { Datum } from '@visactor/vchart/src/typings/common';
import { ITextGraphicAttribute } from '@visactor/vrender-core';

type IterationData = Datum[];
type ISequenceScatterData = {
  /**
   * key: 迭代信息
   * value: 每个迭代的数据
   */
  [Iteration: string]: IterationData;

  // TODO: 支持边的绘制
  // [Iteration: string]: {
  //   /**
  //    * 节点数据
  //    */
  //   nodes: IterationNodesData;
  //   /**
  //    * 边数据
  //    */
  //   edges: IterationEdgesData;
  // };
};

export interface ISequenceScatterSpec {
  /**
   * 图表类型
   */
  type: 'sequenceScatter';
  /**
   * 数据
   */
  data: ISequenceScatterData;
  /**
   * x轴字段
   */
  xField: string;
  /**
   * y轴字段
   */
  yField: string;
  /**
   * 播放器配置
   */
  player: Omit<IPlayerSpec, 'specs'>;
  /**
   * 文字标记（标记当前处于第几个迭代）
   */
  infoLabel: {
    visible: boolean;
    style: ITextGraphicAttribute;
  };
  /**
   * 背景数据
   */
  backgroundColors: {
    [Iteration: string]: any;
  };
  /**
   * 宽度
   */
  width: number;
  /**
   * 高度
   */
  height: number;
}
