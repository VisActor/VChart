// export const version = __VERSION__;

export { VChartEditor } from './core/vchart-editor';

export * from './core/interface';
export * from './core/const';
export * from './core/enum';

export * from './elements/chart/data/interface';
export * from './elements/chart/layout/interface';
export * from './elements/chart/spec-process/interface';
export * from './elements/chart/template/interface';
export * from './elements/chart/interface';

export * from './elements/interface';

export * from './elements/chart/template/templates/baseTemp';

export * from './elements/chart/utils/text';

import { EditorFactory } from './core/factory';
import { ClipBoardParser } from './elements/chart/data/parser/clipboard';
import { CSVParser } from './elements/chart/data/parser/csv';
import { StandardParser } from './elements/chart/data/parser/standard';
import { BarTemp } from './elements/chart/template/templates/bar';
import { BarGroupTemp } from './elements/chart/template/templates/bar-group';
import { BarPercentTemp } from './elements/chart/template/templates/bar-percent';
import { HorizontalBarTemp } from './elements/chart/template/templates/horizontal-bar';
import { HorizontalBarGroupTemp } from './elements/chart/template/templates/horizontal-bar-group';
import { HorizontalBarPercentTemp } from './elements/chart/template/templates/horizontal-bar-percent';
import { AreaTemp } from './elements/chart/template/templates/area';
import { AreaPercentTemp } from './elements/chart/template/templates/area-percent';
import { LineTemp } from './elements/chart/template/templates/line';
import { PieTemp } from './elements/chart/template/templates/pie';

EditorFactory.registerTemp('bar', BarTemp);
EditorFactory.registerTemp('barGroup', BarGroupTemp);
EditorFactory.registerTemp('barPercent', BarPercentTemp);
EditorFactory.registerTemp('horizontalBar', HorizontalBarTemp);
EditorFactory.registerTemp('horizontalBarGroup', HorizontalBarGroupTemp);
EditorFactory.registerTemp('horizontalBarPercent', HorizontalBarPercentTemp);
EditorFactory.registerTemp('area', AreaTemp);
EditorFactory.registerTemp('areaPercent', AreaPercentTemp);
EditorFactory.registerTemp('line', LineTemp);
EditorFactory.registerTemp('pie', PieTemp);

EditorFactory.registerParser('csv', CSVParser);
EditorFactory.registerParser('standard', StandardParser);
EditorFactory.registerParser('clipBoard', ClipBoardParser);

// import { CSVParser } from './elements/chart/data/parser/csv';
// import { StandardParser } from './elements/chart/data/parser/standard';
// EditorFactory.registerParser('csv', CSVParser);
// EditorFactory.registerParser('standard', StandardParser);
