import { EditorFactory } from './../../../core/factory';
import { DataSet } from '@visactor/vdataset';
import type { DataView } from '@visactor/vdataset';
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
    return this._dataView?.getFields?.() ?? this._parser.getDataInfo?.();
  }
  changeDataSource(type: string, value: unknown) {
    const parserCreate = EditorFactory.getParser(type);
    if (!parserCreate) {
      console.warn('invalid data source type:', type);
    }
    if (this._parser) {
      this._parser.clear();
    }
    this._dataView = null;
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

  getSave() {
    return this._parser.getSave();
  }

  clear() {
    this._updateListener = [];
    this._parser?.clear();
    this._parser = null;
  }
}
