import { DataView } from '@visactor/vdataset';

export type GPTDataProcessResult = {
  DOUBLE_CHECK: string;
  FIELD_INFO: { description: string; fieldName: string }[];
  VIDEO_DURATION?: number;
  COLOR_PALETTE?: string[];
  REASON: string;
  THOUGHT: string;
  USEFUL_FIELDS: string[];
  error?: boolean; //解析JSON出错
};

export const ChartTypeList = ['动态条形图', '柱状图', '折线图', '饼图', '散点图', '词云'];

export type Cell = {
  //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
  x?: string;
  y?: string;
  color?: string;
  size?: string;
  angle?: string;
  time?: string;
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
  dataView: DataView;
  colors?: string[];
  totalTime?: number;
};
export type Pipe = (src: any, context: Context) => any;
