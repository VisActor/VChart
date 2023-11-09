import type { EditorChart } from './../chart';
import { EditorFactory } from './../../../core/factory';
import { DataSet } from '@visactor/vdataset';
import type { DataView } from '@visactor/vdataset';
import type { DataInfo, DataUpdateCall, IData, IDataParser, IParserValue, StandardData } from './interface';

export class Data implements IData {
  protected _parser: IDataParser = null;
  protected _updateListener: DataUpdateCall[] = [];
  protected _dataView: DataView = null;
  protected _dataSet: DataSet = null;
  protected _chart: EditorChart = null;
  constructor(chart: EditorChart, parser?: { type: string; value: IParserValue }) {
    this._chart = chart;
    if (parser) {
      this.changeDataSource(parser.type, parser.value);
    }
    this._dataSet = new DataSet();
  }
  getDataInfo(): DataInfo {
    return this._dataView?.getFields?.() ?? this._parser.getDataInfo?.();
  }
  getSpecOption() {
    return this._parser.getSpecOption?.();
  }
  changeDataSource(type: string, value: unknown) {
    if (this._parser?.type === type || (this._parser && !type)) {
      this._parser.updateValue(value);
      return;
    }
    const parserCreate = EditorFactory.getParser(type);
    if (!parserCreate) {
      console.warn('invalid data source type:', type);
    }
    if (this._parser) {
      this._parser.clear();
    }
    this._dataView = null;
    this._parser = new parserCreate(this._dataSet, value, {
      updateCall: this.dataUpdateCall,
      errorCall: this.dataErrorCall
    });
  }
  getData(): StandardData {
    return this._dataView;
  }
  dataUpdateCall = (d: StandardData) => {
    this._dataView = d;
    this._updateListener.forEach(c => {
      c(d);
    });
  };
  dataErrorCall = (msg: string, opt: any) => {
    if (msg === 'chartTypeChange') {
      // 这里仅仅是数据中的类型切换，保留模版
      const temp = this._chart.specProcess.getEditorSpec().temp;
      this._chart.clearDataForChartTypeChange(null, { clearCurrent: true });
      this._chart.specProcess.getEditorSpec().temp = temp;
    }
  };
  addDataUpdateListener(call: DataUpdateCall) {
    this._updateListener.push(call);
  }

  getSave() {
    return this._parser.getSave();
  }

  clear() {
    this._updateListener = [];
    this._parser?.clear();
    this._parser = null;
  }
}
