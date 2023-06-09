import { isString } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { DataSet, DataView } from '@visactor/vdataset';
import type { IDataViewOptions, IFields, ITransformOptions } from '@visactor/vdataset';
import type { IDataValues } from '../typings/spec/common';
import { error } from '../util';
import { registerDataSetInstanceTransform } from './register';
import { copyDataView } from './transforms/copy-data-view';

export function initializeData() {
  // todo
}

export function initCSVData() {
  // todo
}

export function initData() {
  // todo
}

export function initFoldData() {
  // todo
}

export function dataViewFromDataView(rawData: DataView, dataSet?: DataSet, op?: IDataViewOptions) {
  dataSet = dataSet instanceof DataSet ? dataSet : rawData.dataSet;
  registerDataSetInstanceTransform(dataSet, 'copyDataView', copyDataView);
  const viewData = new DataView(dataSet, op);
  viewData.parse([rawData], {
    type: 'dataview'
  });
  viewData.transform({
    type: 'copyDataView'
  });
  return viewData;
}

/**
 * 将数据实例化为 DataView
 * @param data 数据
 * @param dataSet 数据集
 * @returns
 */
export function dataToDataView(data: DataView | IDataValues, dataSet: DataSet, sourceDataViews: DataView[] = []) {
  if (data instanceof DataView) {
    return data;
  }

  const { id, values = [], fromDataIndex, fromDataId, transforms = [], fields, parser } = data;
  let dataView: DataView;
  const existDataView = sourceDataViews.find(dv => dv.name === id);
  if (existDataView) {
    dataView = existDataView;
  } else {
    const initOption: IDataViewOptions = { name: id as string };
    // fields 支持在dataView初始化参数中传入
    if (fields) {
      initOption.fields = fields as IFields;
    }
    dataView = new DataView(dataSet, initOption);
    if (typeof fromDataId === 'string') {
      // 使用id查找上游dataview
      const fromDataView = sourceDataViews.find(dv => dv.name === fromDataId);
      if (!fromDataView) {
        throw new Error(`no data matches fromDataId ${fromDataId}`);
      }

      dataView.parse([fromDataView], {
        type: 'dataview'
      });
      dataView.transform({
        type: 'copyDataView'
      });
    } else if (typeof fromDataIndex === 'number') {
      // 使用index查找上游dataview
      const fromDataView = sourceDataViews[fromDataIndex];
      if (!fromDataView) {
        throw new Error(`no data matches fromDataIndex ${fromDataIndex}`);
      }

      dataView.parse([fromDataView], {
        type: 'dataview'
      });
      dataView.transform({
        type: 'copyDataView'
      });
    } else if (Array.isArray(values)) {
      // 处理values
      dataView.parse(values);
    } else if (
      isString(values) &&
      (!parser || parser.type === 'csv' || parser.type === 'dsv' || parser.type === 'tsv')
    ) {
      // 内置 csv parser
      dataView.parse(values, parser ?? { type: 'csv' });
    } else {
      // 如果 values 不符合要求，则默认设置为 []，同时打印错误信息
      dataView.parse([]);
      error('values should be array');
    }
    // 处理transform
    if (transforms && transforms.length) {
      transforms.forEach((transform: ITransformOptions) => {
        if (dataSet.getTransform(transform.type)) {
          dataView.transform(transform);
        }
      });
    }
  }

  return dataView;
}
