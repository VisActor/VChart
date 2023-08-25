import type { IChartTemp } from './../temp/interface';
import { VChart } from '@visactor/vchart';
import type { IChart, IChartSpec } from '@visactor/vchart';
import type { ILayout } from './../layout/interface';
import { SpecProcess } from '../spec-process/spec-process';
import type { ISpecProcess } from '../spec-process/interface';
import { Data } from './../data/data';
import type { IData } from '../data/interface';
import { Layout } from '../layout/layout';
import { getTemp } from '../temp';
import { isString } from '@visactor/vutils';

export class VChartEditor {
  protected _data: IData;
  protected _specProcess: ISpecProcess;
  protected _layout: ILayout;
  protected _temp: IChartTemp;

  protected _option: { dom: string | HTMLElement };
  protected _container: HTMLElement;

  protected _vchart: IChart;

  constructor(option: { dom: string | HTMLElement }) {
    this._option = option;
    const { dom } = this._option;

    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    this._data = new Data();
    this._specProcess = new SpecProcess(this._data, this.onSpecReady);
    this._layout = new Layout(this._specProcess);
  }

  protected _initVChart(spec: IChartSpec) {
    this._vchart = new VChart(spec, { dom: this._container });
    this._layout.setVChart(this._vchart);
  }

  setTemp(key: string) {
    this._temp = getTemp(key);
    this._specProcess.updateTemp(this._temp);
  }

  setDataSource(type: string, value: any) {
    this._data.changeDataSource(type, value);
  }

  onSpecReady = () => {
    if (!this._vchart) {
      this._initVChart(this._specProcess.getVChartSpec());
      this._vchart.renderAsync();
    } else {
      this._vchart.updateSpec(this._specProcess.getVChartSpec());
    }
  };

  clear() {
    this._vchart.release();

    this._data.clear();
    this._temp.clear();
    this._specProcess.clear();
    this._layout.clear();

    this._data = this._temp = this._specProcess = this._layout = this._vchart = null;
  }
}
