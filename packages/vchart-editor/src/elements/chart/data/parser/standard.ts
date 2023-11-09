import { DataView } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataErrorCall, DataUpdateCall, IDataParser } from './../interface';
import { getStandardDataFields } from '../../../../utils/data';
export class StandardParser implements IDataParser {
  static readonly type = 'standard';
  readonly type: string = StandardParser.type;
  protected _data: DataView = null;
  protected _dataSet: DataSet = null;
  protected _dataValue: any[] = null;
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
    this._data = new DataView(this._dataSet, { name: 'editor_standard' });
    if (value) {
      this.updateValue(value);
    }
  }
  getData() {
    return this._data;
  }

  getSave() {
    return {
      type: 'standard',
      value: JSON.stringify(this._dataValue)
    };
  }

  updateValue(value: any[]) {
    this._dataValue = value;
    this._data.parseNewData(value);
    this._data.reRunAllTransform();
    this._data.setFields(getStandardDataFields(this._data.latestData));
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
