import { DataSet } from '@visactor/vdataset';
import type { DataView } from '@visactor/vdataset';
import { DataParser } from './parser/index';
import type { DataInfo, DataUpdateCall, IData, IDataParser, IParserValue, StandardData } from './interface';

export class Data implements IData {
  protected _parser: IDataParser = null;
  protected _updateListener: DataUpdateCall[] = [];
  protected _dataView: DataView = null;
  protected _dataSet: DataSet = null;
  constructor(parser?: { type: string; value: IParserValue }) {
    if (parser) {
      this.changeDataSource(parser.type, parser.value);
    }
    this._dataSet = new DataSet();
  }
  getDataInfo(): DataInfo {
    return null;
  }
  changeDataSource(type: string, value: unknown) {
    if (this._parser) {
    }
    const parserCreate = DataParser[type];
    if (!parserCreate) {
      console.warn('invalid data source type:', type);
    }
    this._parser = new parserCreate(this._dataSet, this.dataUpdateCall, value);
  }
  getData(): StandardData {
    return this._dataView;
  }
  dataUpdateCall = (d: StandardData) => {
    this._dataView = d;
    this._updateListener.forEach(c => {
      c(d);
    });
  };
  addDataUpdateListener(call: DataUpdateCall) {
    this._updateListener.push(call);
  }

  clear() {
    this._updateListener = [];
    this._parser.clear();
    this._parser = null;
  }
}
