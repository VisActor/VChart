export interface IGPTOptions {
  url?: string;
  /** gpt request header, which has higher priority */
  headers?: HeadersInit;
  method?: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export type GPTDataProcessResult = {
  DOUBLE_CHECK: string;
  FIELD_INFO: {
    fieldName: string;
    description: string;
    type: string;
    role: string;
  }[];
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  REASON: string;
  THOUGHT: string;
  USEFUL_FIELDS: string[];
  error?: boolean; //解析JSON出错
};

export type Cell = {
  //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
  x?: string;
  y?: string;
  color?: string;
  size?: string;
  angle?: string;
  time?: string;
  source?: string;
  target?: string;
  value?: string;
};
export type ChartType = string;
export type GPTChartAdvisorResult = {
  CHART_TYPE: ChartType;
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export type NLToChartResult = {
  CHART_TYPE: ChartType;
  USEFUL_FIELDS: string[];
  DOUBLE_CHECK: string;
  FIELD_MAP: Cell;
  THOUGHT: string;
  COLOR_PALETTE?: string[];
  error?: boolean;
};

export type Context = {
  chartType: ChartType;
  cell: Cell;
  dataset: any[];
  colors?: string[];
  totalTime?: number;
};
export type Pipe = (src: any, context: Context) => any;

export type TimeType = {
  totalTime: number;
  frameArr: any[];
};

export type VizSchema = {
  chartType?: string;
  fields: any[];
};
