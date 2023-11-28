import { DataView } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataErrorCall, DataUpdateCall, IDataParser } from './../interface';
import { getStandardDataFields } from '../../../../utils/data';
import { v4 as uuidv4 } from 'uuid';
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
    this.setDataUpdateHandler(updateCall);
    this.setDataErrorHandler(errorCall);
    this._data = new DataView(this._dataSet, { name: 'editor_standard_' + uuidv4() });
    if (value) {
      this.updateValue(value);
    }
  }
  getData() {
    return this._data;
  }

  getDataValue() {
    return this._dataValue;
  }

  getDataInfo() {
    return this._data?.getFields();
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

  setDataUpdateHandler(call: DataUpdateCall) {
    this._onDataUpdateCall = call;
  }
  setDataErrorHandler(call: DataErrorCall) {
    this._onDataErrorCall = call;
  }

  clear() {
    this._dataSet.removeDataView(this._data?.name);
    this._data = null;
    this._onDataUpdateCall = null;
  }
}
