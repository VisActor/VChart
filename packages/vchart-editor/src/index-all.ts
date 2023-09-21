export const version = __VERSION__;

export { VChartEditor } from './core/vchart-editor';

import { EditorFactory } from './core/factory';
import { ClipBoardParser } from './elements/chart/data/parser/clipboard';
import { BarTemp } from './elements/chart/temp/temps/bar';
import { LineTemp } from './elements/chart/temp/temps/line';

EditorFactory.registerTemp('bar', BarTemp);
EditorFactory.registerTemp('line', LineTemp);

EditorFactory.registerParser('clipBoard', ClipBoardParser);
