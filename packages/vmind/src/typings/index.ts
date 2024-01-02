export interface ILLMOptions {
  url?: string; //URL of your LLM service. For gpt, default is openAI API.
  /** llm request header, which has higher priority */
  headers?: HeadersInit; // this will be used directly as the header of the LLM request.
  method?: 'POST' | 'GET'; //post or get
  model?: Model;
  max_tokens?: number;
  temperature?: number;
  showThoughts?: boolean;
  [key: string]: any;
}

export type SimpleFieldInfo = {
  fieldName: string;
  description?: string; //additional description of the field. This will help the model have a more comprehensive understanding of this field, improving the quality of chart generation.
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
  radius?: string;
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
  GPT3_5 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  SKYLARK = 'skylark-pro',
  SKYLARK2 = 'skylark2-pro-4k'
}

export type ChartGenerationProps = {
  model: Model; //models to finish data generation task
  userPrompt: string; //user's intent of visualization, usually aspect in data that they want to visualize
  dataFields: FieldInfo[];
};

export type DataItem = Record<string, number | string>;
