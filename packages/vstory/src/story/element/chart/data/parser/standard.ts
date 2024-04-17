import { isString } from '@visactor/vutils';
import type { DataErrorCall, DataUpdateCall, IDataParser, IDataType, IDataValue } from './../interface';
import { ChartDimensionField, ChartTypeField, ChartValueField } from '../../const';

export type IStandardValue = {
  columns: string[];
  data: IDataType[];
  rows: string[];
};

export class StandardParser implements IDataParser {
  static readonly type = 'standard';
  readonly type: string = StandardParser.type;
  protected _data: IDataValue[] = null;
  protected _dataValue: IStandardValue = null;
  protected _onDataUpdateCall: DataUpdateCall = null;
  protected _onDataErrorCall: DataErrorCall = null;
  constructor(
    type: any,
    {
      updateCall,
      errorCall
    }: {
      updateCall: DataUpdateCall;
      errorCall: DataErrorCall;
    }
  ) {
    this.setDataUpdateHandler(updateCall);
    this.setDataErrorHandler(errorCall);
    this._data = [];
  }

  getData() {
    return this._data;
  }

  getDataValue() {
    return this._dataValue;
  }

  getDataInfo() {
    return {
      [ChartDimensionField]: {
        domain: this._dataValue.rows
      },
      [ChartTypeField]: {
        domain: this._dataValue.columns.slice(1, this._dataValue.columns.length)
      }
    } as any;
  }

  getSave() {
    return {
      type: 'standard',
      value: JSON.stringify(this._dataValue)
    };
  }

  // 正常多系列处理方法
  private _updateValue(value: IStandardValue) {
    if (value.columns.length < 1) {
      return;
    }
    this._data = [];
    const xField = value.columns[0];
    for (let i = 1; i < value.columns.length; i++) {
      const column = value.columns[i];
      const values = value.data.map(v => {
        return {
          [ChartDimensionField]: v[xField],
          [ChartValueField]: v[column],
          [ChartTypeField]: column
        };
      });
      this._data.push({
        id: `${i - 1}`,
        sourceKey: column,
        values
      });
    }
    this._dataValue = value;
    this._onDataUpdateCall?.(this._data);
  }

  updateValue(value: IStandardValue) {
    if (isString(value)) {
      value = JSON.parse(value);
    }
    return this._updateValue(value);
  }

  setDataUpdateHandler(call: DataUpdateCall) {
    this._onDataUpdateCall = call;
  }
  setDataErrorHandler(call: DataErrorCall) {
    this._onDataErrorCall = call;
  }

  clear() {
    this._data = null;
    this._onDataUpdateCall = null;
  }
}
