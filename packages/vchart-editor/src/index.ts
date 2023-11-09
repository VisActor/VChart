export const version = __VERSION__;

export { VChartEditor } from './core/vchart-editor';

export * from './core/interface';
export * from './core/const';

export * from './elements/chart/data/interface';
export * from './elements/chart/layout/interface';
export * from './elements/chart/spec-process/interface';
export * from './elements/chart/template/interface';
export * from './elements/chart/interface';

export * from './elements/interface';

export * from './elements/chart/template/templates/baseTemp';

import { EditorFactory } from './core/factory';
import { ClipBoardParser } from './elements/chart/data/parser/clipboard';
import { CSVParser } from './elements/chart/data/parser/csv';
import { StandardParser } from './elements/chart/data/parser/standard';
import { BarTemp } from './elements/chart/template/templates/bar';
import { HorizontalBarTemp } from './elements/chart/template/templates/horizontal-bar';
import { BarGroupTemp } from './elements/chart/template/templates/bar-group';
import { HorizontalBarGroupTemp } from './elements/chart/template/templates/horizontal-bar-group';
import { LineTemp } from './elements/chart/template/templates/line';
import { PieTemp } from './elements/chart/template/templates/pie';

EditorFactory.registerTemp('bar', BarTemp);
EditorFactory.registerTemp('horizontalBar', HorizontalBarTemp);
EditorFactory.registerTemp('barGroup', BarGroupTemp);
EditorFactory.registerTemp('horizontalBarGroup', HorizontalBarGroupTemp);
EditorFactory.registerTemp('line', LineTemp);
EditorFactory.registerTemp('pie', PieTemp);

EditorFactory.registerParser('csv', CSVParser);
EditorFactory.registerParser('standard', StandardParser);
EditorFactory.registerParser('clipBoard', ClipBoardParser);
