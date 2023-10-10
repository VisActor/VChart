import type { utilFunctionCtx } from '../typings/params';
import { DataSet, DataView } from '@visactor/vdataset';
import type { IDataViewOptions } from '@visactor/vdataset';
import type { IDataValues } from '../typings/spec/common';
export declare function initializeData(): void;
export declare function initCSVData(): void;
export declare function initData(): void;
export declare function initFoldData(): void;
export declare function dataViewFromDataView(rawData: DataView, dataSet?: DataSet, op?: IDataViewOptions): DataView;
export declare function dataToDataView(
  data: DataView | IDataValues,
  dataSet: DataSet,
  sourceDataViews?: DataView[],
  ctx?: utilFunctionCtx
): DataView;
export declare function updateDataViewInData(dataView: DataView, data: IDataValues, forceMerge: boolean): void;
