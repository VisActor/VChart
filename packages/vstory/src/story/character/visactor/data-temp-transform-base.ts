import { StoryFactory } from '../../factory/factory';
import type {
  IVisactorTemp,
  IDataTempTransform,
  ISpecProcess,
  ICharacterVisactor,
  IUpdateAttributeOption
} from './interface';
import { EventEmitter } from '@visactor/vutils';

export class DataTempTransformBase implements IDataTempTransform {
  protected _state = 'alive';

  protected _specTemp: IVisactorTemp = null;
  get specTemp() {
    return this._specTemp;
  }

  protected _character: ICharacterVisactor;
  protected _specProcess: ISpecProcess;

  // 当图表类或者数据更新时，先使用 next 验证是否可用，可用再更新
  protected _nextTemp: IVisactorTemp = null;
  get nextTemp() {
    return this._nextTemp;
  }

  protected _changeType: 'data' | 'temp' | 'dataTemp' | 'none' = 'none';

  protected _updateOption: IUpdateAttributeOption = {};

  emitter: EventEmitter = new EventEmitter();

  constructor({ specProcess, character }: { character: ICharacterVisactor; specProcess: ISpecProcess }) {
    this._character = character;
    this._specProcess = specProcess;
  }

  protected _setNoHistoryState() {
    this._updateOption = this._updateOption || {};
    if (this._updateOption.triggerHistory) {
      this._updateOption.saveData = true;
      this._updateOption.triggerHistory = false;
    }
  }

  updateChartTemp(temp: string) {
    if (!this._createNextTemp(temp)) {
      return;
    }
    this._changeType = 'temp';
    if (this._checkEnable(this._nextTemp)) {
      const currentTemp = this._specTemp;
      this._setTempToNext();
      this.emitter.emit('tempUpdate', this._updateOption, { currentTemp, nextTemp: this._specTemp });
      this.emitter.emit('specReady');
    } else {
      // fail
    }
    this._changeType = 'none';
  }

  protected _setTempToNext() {
    this._specTemp?.clear();
    this._specTemp = this._nextTemp;
    this._nextTemp = null;
  }

  protected _createNextTemp(temp: string) {
    if (temp === this._specTemp?.type) {
      console.warn('same temp type:', temp);
      return false;
    }
    this._nextTemp?.clear();
    this._nextTemp = StoryFactory.createChartTemp(temp, this._specProcess.getCharacterSpec());
    return !!this._nextTemp;
  }

  protected _checkEnable(temp: IVisactorTemp) {
    if (!temp) {
      return false;
    }
    if (temp.checkDataEnable(this._specProcess.getCharacterSpec().options.data)) {
      return true;
    }
    return false;
  }

  getBaseSpec() {
    return this._specTemp.getSpec(this._specProcess.getCharacterSpec().options.data, { character: this._character });
  }

  release() {
    this._state = 'release';
    this._specTemp?.clear();
    this._nextTemp?.clear();
    this.emitter.removeAllListeners();
    this.emitter = this._specTemp = null;
  }
}
