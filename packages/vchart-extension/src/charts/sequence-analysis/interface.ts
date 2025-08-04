// 绘制点
export interface EventData {
  user_id: string; // 用户id
  user_image: string; // 用户头像url
  dots: {
    // step步骤
    // step模式下以此为维度轴
    step: string;
    // 事件类型
    // 颜色维度
    action_type: string;
    // 事件唯一标识
    node_name: string;
    // 介质类型
    // step + medium connection, 以此为维度轴
    medium_type: string;
    // 事件发生时间
    // time模式, 以此为维度轴
    time_stamp: number;
    // 事件发生次数
    // time模式, 以此为top轴标识
    action_count: number;
  }[];
}

// 绘制user头像
export interface UserImageMap {
  [user_id: string]: string; // 用户id -> 用户头像url
}

// 绘制pattern
export interface PatternData {
  // 事件id
  from: string;
  // 事件id
  to: string;
  // pattern类型, 颜色维度
  pattern_type: string;
  /**
   * 是否延伸 2/x
   * 默认两边延伸
   */
  isExtend?: 'left' | 'right' | 'all';
}

// 绘制连接
export interface ActionData {
  // 事件id
  from: string;
  // 事件id
  to: string;
  // 用户id
  // time模式开启Action Target是需要使用
  user_id?: string;
  // 用户头像url
  user_image?: string;
}

export interface ISequenceAnalysisSpec {
  /**
   * 图表类型
   */
  type: 'sequenceAnalysis';
  /**
   * 色板(看是否需要根据key指定)
   */
  colors?: string[];
  /**
   * 展示模式
   */
  mode: 'time' | 'step';
  /**
   * step模式下, 是否开启介质连接
   * @default false
   * @description 关闭时, 使用直接绘制; 开启时, 使用三次贝塞尔曲线绘制
   */
  mediumConnection?: boolean;
  /**
   * time模式下, 是否开启actionTarget
   * @default false
   * @description 关闭时, 使用直线连接; 开启时, 连接线中间有用户头像
   */
  actionTarget?: boolean;
  /**
   * 事件数据
   */
  eventData: EventData[];
  /**
   * 模式下的pattern数据
   */
  patternData?: PatternData[];
  /**
   * 模式下的action数据
   */
  actionData?: ActionData[];
  /**
   * 用户头像数据(从eventData中抽取也可以, 但不建议在前端遍历数据)
   */
  userImageMap: UserImageMap;
  stepMediumMap: Record<string, string>;
  /**
   * @param spec 经过rankingList转化后的vchart原始spec
   * @description 获取vchart原始spec, 并根据业务自行添加转换逻辑
   */
  customTransformSpec?: (spec: any) => void;
}
