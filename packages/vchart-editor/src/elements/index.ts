import { EditorText } from './text/text';
import { EditorChart } from './chart/chart';
import type { IElementConstructor } from './interface';
export const ElementsMap: { [key: string]: IElementConstructor } = {
  chart: EditorChart,
  text: EditorText
};
