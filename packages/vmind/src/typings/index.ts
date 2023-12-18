export interface IGPTOptions {
  url?: string;
  /** gpt request header, which has higher priority */
  headers?: HeadersInit;
  method?: string;
  model?: Model;
  max_tokens?: number;
  temperature?: number;
}

export type SimpleFieldInfo = {
  fieldName: string;
  description?: string;
  type: DataType;
  role: ROLE;
};
export type GPTDataProcessResult = {
  fieldInfo: SimpleFieldInfo[];
  videoDuration?: number;
  colorPalette?: string[];
  thought: string;
  usefulFields: string[];
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

export enum DataType {
  INT = 'int',
  STRING = 'string',
  FLOAT = 'float',
  DATE = 'date'
}

export enum ROLE {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

export enum LOCATION {
  DIMENSION = 'dimension',
  MEASURE = 'measure'
}

export type FieldInfo = {
  id: string;
  alias: string;
  description: string;
  visible: boolean;
  type: DataType;
  role: ROLE;
  location: LOCATION;
};

export type VizSchema = {
  chartType?: string;
  fields: FieldInfo[];
};

//models that VMind support
//more models is under developing
export enum Model {
  GPT3_5 = 'gpt-3.5',
  GPT4 = 'gpt-3.5',
  SKYLARK = 'skylark'
}

export type ChartGenerationProps = {
  model: Model; //models to finish data generation task
  userPrompt: string; //user's intent of visualization, usually aspect in data that they want to visualize
  dataFields: FieldInfo[];
};

export type DataItem = Record<string, number | string>;
