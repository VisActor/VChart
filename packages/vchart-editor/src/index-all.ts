export const version = __VERSION__;

export { VChartEditor } from './core/vchart-editor';

import { EditorFactory } from './core/factory';
import { ClipBoardParser } from './elements/chart/data/parser/clipboard';
import { BarTemp } from './elements/chart/template/templates/bar';
import { LineTemp } from './elements/chart/template/templates/line';

EditorFactory.registerTemp('bar', BarTemp);
EditorFactory.registerTemp('line', LineTemp);

EditorFactory.registerParser('clipBoard', ClipBoardParser);
