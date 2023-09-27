import type { IDataParserConstructor } from '../elements/chart/data/interface';
import type { IChartTempConstructor } from '../elements/chart/template/interface';

export class EditorFactory {
  static DataParser: { [key: string]: IDataParserConstructor } = {};
  static TempList: { [key: string]: IChartTempConstructor } = {};

  static registerParser(key: string, parser: IDataParserConstructor) {
    EditorFactory.DataParser[key] = parser;
  }
  static registerTemp(key: string, temp: IChartTempConstructor) {
    EditorFactory.TempList[key] = temp;
  }

  static getParser(key: string): IDataParserConstructor {
    const t = EditorFactory.DataParser[key];
    if (!t) {
      console.error('can not found parser:', key);
    }
    return t;
  }

  static getTemp(key: string): IChartTempConstructor {
    const t = EditorFactory.TempList[key];
    if (!t) {
      console.error('can not found temp:', key);
    }
    return t;
  }
}
