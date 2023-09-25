import type { SignalFunctionType } from '@visactor/vgrammar-core';
import { CompilableSignal } from './compilable-signal';
import { CompilableBase } from '../compilable-base';

export class SignalManager extends CompilableBase {
  /** signal map */
  protected _signalMap: Record<string, CompilableSignal<any>> = {};
  getSignalMap() {
    return this._signalMap;
  }
  getSignal(name: string) {
    return this._signalMap[name];
  }

  /** 增加或更新 signal */
  updateSignal(name: string, value: any, updateFunc?: SignalFunctionType<any>) {
    if (!this._signalMap[name]) {
      this._signalMap[name] = new CompilableSignal(this._option, name, value, updateFunc);
      this._signalMap[name].compile();
    } else {
      this._signalMap[name].updateSignal(value, updateFunc);
    }
  }

  compile() {
    Object.values(this._signalMap).forEach(signal => {
      signal.compile();
    });
  }

  release() {
    super.release();

    Object.values(this._signalMap).forEach(signal => {
      signal.release();
    });
    this._signalMap = {};
  }
}
