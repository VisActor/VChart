import type { VChartEditor } from './vchart-editor';
import { MAX_HISTORY_COUNT } from './const';
import type { IEditorData, IHistory } from './interface';

export class EditorData {
  protected _history: IHistory[][] = [];

  // 当前正在生效的记录节点
  protected _currentIndex: number = -1;

  protected _data: IEditorData;

  protected _editor: VChartEditor;

  constructor(editor: VChartEditor, data: IEditorData) {
    this._editor = editor;
    this._data = data;
  }

  clearHistory() {
    this._history = [];
    this._currentIndex = -1;
    this._currentPushTemp = [];
    this._editor.emitter.emit('historyChange');
  }

  protected _currentPushFlow: any = null;
  protected _currentPushTemp: IHistory[] = [];
  async pushHistoryNextTick(h: IHistory) {
    this._currentPushTemp.push(h);
    if (!this._currentPushFlow) {
      this._currentPushFlow = Promise.resolve().then(() => {
        this.pushHistory(this._currentPushTemp);
        this._currentPushTemp = [];
        this._currentPushFlow = null;
      });
    }
    await this._currentPushFlow;
    return this;
  }

  pushHistory(h: IHistory[]) {
    // remove history after currentIndex
    this._history.splice(this._currentIndex + 1);
    // push new history
    this._history.push(h);
    this._currentIndex++;
    if (this._history.length > MAX_HISTORY_COUNT) {
      this._history.shift();
      this._currentIndex--;
    }
    this.saveData();
    this._editor.emitter.emit('historyChange');
  }

  forwardEnable() {
    return this._currentIndex < this._history.length - 1;
  }

  forward() {
    if (!this.forwardEnable()) {
      return;
    }
    this._currentIndex++;
    const hisList = this._history[this._currentIndex];
    hisList.forEach(his => his.use(his.element, his.from, his.to));
    this._clearEditorElement();
    this.saveData();
  }

  backwardEnable() {
    return this._currentIndex >= 0;
  }

  backward() {
    if (!this.backwardEnable()) {
      return;
    }
    const hisList = this._history[this._currentIndex];
    hisList.forEach(his => his.use(his.element, his.to, his.from));
    this._currentIndex--;
    this._clearEditorElement();
    this.saveData();
  }

  private _clearEditorElement() {
    this._editor.clearCurrentEditorElement();
    this._editor.event.clearCurrentEditorBox();
  }

  saveData() {
    if (this._editor.option.mode === 'view') {
      return;
    }
    //save
    // @ts-ignore
    this._data.save();
  }
}
