import type { ICommonInitOption } from './../../../core/interface';
import type { DataSet } from '@visactor/vdataset';
import { type EventEmitter } from '@visactor/vutils';

export type IDataType = any;

export interface IDataValue {
  id: string;
  sourceKey: string;
  values: IDataType[];
}

export type StandardData = IDataValue | IDataValue[];

export type IParserValue = any;

export type DataUpdateCall = (data: StandardData) => void;
export type DataErrorCall = (msg: { type: string; info: string }, opt?: any) => void;

export type DataInfo = {
  [key: string]: {
    type: 'ordinal' | 'linear';
  };
};

export type DataSave = {
  type: string;
  value: any;
};

// export interface IData {
//   changeDataSource: (type: string, value: IParserValue) => void;
//   getData: () => StandardData;
//   addDataUpdateListener: (call: DataUpdateCall) => void;
//   getDataInfo: () => DataInfo;
//   getSpecOption: () => any;
//   getSave: () => DataSave;
//   clear: () => void;
// }

export interface IDataParser {
  type: string;
  getData: () => StandardData;
  getDataValue: () => IParserValue;
  getDataInfo?: () => DataInfo;
  getSpecOption?: () => any;
  getSave: () => DataSave;
  updateValue: (value: IParserValue) => void;
  setDataUpdateHandler: (call: DataUpdateCall) => void;
  setDataErrorHandler: (call: DataErrorCall) => void;
  clear: () => void;
}

export interface IDataParserConstructor {
  type: string;
  new (
    dataSet: DataSet,
    value: any,
    option: {
      updateCall: DataUpdateCall;
      errorCall: DataErrorCall;
      currentData?: IDataParser;
      emitter: EventEmitter;
    } & ICommonInitOption
  ): IDataParser;
}
