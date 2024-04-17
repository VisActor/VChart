import { isString } from '@visactor/vutils';
import { DataView, csvParser } from '@visactor/vdataset';
import type { DataSet } from '@visactor/vdataset';
import type { DataErrorCall, DataUpdateCall, IDataParser } from './../interface';
import { getStandardDataFields } from '../../../../utils/data';
import { v4 as uuidv4 } from 'uuid';

export class ClipBoardParser implements IDataParser {
  static readonly type = 'clipBoard';
  readonly type: string = ClipBoardParser.type;
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
    this.setDataUpdateHandler(updateCall);
    this.setDataErrorHandler(errorCall);
    this._data = new DataView(this._dataSet, { name: 'editor_clipBoard_' + uuidv4() });
    if (value) {
      this.updateValue(value);
    }
  }
  getSpecOption?: () => any;
  getData() {
    return this._data as any;
  }

  getDataValue() {
    return this._dataValue;
  }
  getDataInfo() {
    return this._data?.getFields();
  }

  getSave() {
    return {
      type: 'clipBoard',
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
      this._data.setFields(getStandardDataFields(this._data.latestData));
    }
    this._onDataUpdateCall?.(this._data as any);
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
