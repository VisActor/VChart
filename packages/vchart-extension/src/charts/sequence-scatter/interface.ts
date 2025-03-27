import { IPlayerSpec } from '@visactor/vchart';
import { ITextGraphicAttribute } from '@visactor/vrender-core';

export type OriginalData = {
  [key: string]: {
    projection: number[][];
    intra_similarity?: number[][];
    inter_similarity?: number[][];
    prediction?: number[];
    confidence?: number[];
  };
};

/**
 * 训练信息，包括标签、标签颜色、标签文本
 */
export type TrainingInfo = {
  label_text: string[];
  label_color: number[][];
  label_index: number[];
};

export type ChartData = {
  [key: string]: {
    nodes: IterationNodesData;
    edges: IterationEdgesData;
  };
};

export type IterationNodesData = {
  index: number;
  x: number;
  y: number;
  label: string;
  prediction: string;
  confidence: number;
}[];

/**
 * 轮次边数据
 */
export type IterationEdgesData = {
  index: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  type: number;
  color: string;
}[];

type ISequenceScatterData = {
  /**
   * key: 迭代信息
   * value: 每个迭代的数据
   */
  [Iteration: string]: {
    /**
     * 节点数据
     */
    nodes: IterationNodesData;
    /**
     * 边数据
     */
    edges: IterationEdgesData;
  };
};

export interface ISequenceScatterSpec {
  /**
   * 图表类型
   */
  type: 'sequenceScatter';
  /**
   * 任务类型
   */
  taskType: string;
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
   * 画布范围
   */
  scope: [number, number, number, number];
}
