import { IChartInfo } from './interface';
import area from './area';
import bar from './bar';
import column from './column';
import pie from './pie';
import rose from './rose';
import radar from './radar';
import scatter from './scatter';

export const charts: IChartInfo[] = [area, column, pie, bar, rose, radar, scatter];
