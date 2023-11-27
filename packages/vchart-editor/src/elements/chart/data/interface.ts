import type { DataSet, DataView } from '@visactor/vdataset';

export interface Datum {
  [key: string]: any;
}

export type StandardData = DataView;

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
    {
      updateCall,
      errorCall
    }: {
      updateCall: DataUpdateCall;
      errorCall: DataErrorCall;
    }
  ): IDataParser;
}
