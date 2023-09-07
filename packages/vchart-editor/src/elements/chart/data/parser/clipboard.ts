import { isString } from '@visactor/vutils';
import { DataView, csvParser } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataUpdateCall, IDataParser } from './../interface';
export class ClipBoardParser implements IDataParser {
  static readonly type = 'clipBoard';
  readonly type: string = ClipBoardParser.type;
  protected _data: DataView = null;
  protected _dataSet: DataSet = null;
  protected _dataValue: string | {} = null;
  protected _onDataUpdateCall: DataUpdateCall = null;
  constructor(dataSet: DataSet, call: DataUpdateCall, value: any) {
    this._dataSet = dataSet;
    this.onDataUpdate(call);
    this._data = new DataView(this._dataSet, { name: 'editor_clipBoard' });
    if (value) {
      this.updateValue(value);
    }
  }
  getData() {
    return this._data;
  }

  getSave() {
    return {
      type: 'clipBoard',
      value: this._dataValue
    };
  }

  updateValue(value: unknown) {
    this._dataValue = value;
    // TODO hack for demo
    this._data.setFields({
      State: {},
      Age: {},
      Population: {
        type: 'linear'
      }
    });
    // only enable csv string for demo
    if (isString(value)) {
      this._dataSet.registerParser('csv', csvParser);
      this._data.parse(value, { type: 'csv' });
      this._data.reRunAllTransform();
    }
    this._onDataUpdateCall?.(this._data);
  }
  onDataUpdate(call: DataUpdateCall) {
    this._onDataUpdateCall = call;
  }
  clear() {
    this._data = null;
    this._onDataUpdateCall = null;
  }
}
