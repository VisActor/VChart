import { isString } from '@visactor/vutils';
import { DataView, csvParser } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataErrorCall, DataUpdateCall, IDataParser } from './../interface';
export class CSVParser implements IDataParser {
  static readonly type = 'csv';
  readonly type: string = CSVParser.type;
  protected _data: DataView = null;
  protected _dataSet: DataSet = null;
  protected _dataValue: string | {} = null;
  protected _onDataUpdateCall: DataUpdateCall = null;
  protected _onDataErrorCall: DataErrorCall = null;
  constructor(
    dataSet: DataSet,
    value: any,
    {
      updateCall,
      errorCall
    }: {
      updateCall: DataUpdateCall;
      errorCall: DataErrorCall;
    }
  ) {
    this._dataSet = dataSet;
    this._onDataErrorCall = errorCall;
    this.onDataUpdate(updateCall);
    this._data = new DataView(this._dataSet, { name: 'editor_csv' });
    if (value) {
      this.updateValue(value);
    }
  }
  getData() {
    return this._data;
  }

  getSave() {
    return {
      type: 'csv',
      value: this._dataValue
    };
  }

  updateValue(value: unknown) {
    this._dataValue = value;
    // only enable csv string
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
    this._dataSet.removeDataView(this._data?.name);
    this._data = null;
    this._onDataUpdateCall = null;
  }
}
