import type { IEditorData, IEditorLayer, ILayerData } from '../../src/core/interface';

export class BrowserData implements IEditorData {
  protected _dataKey: string = 'editor-browser';

  protected _data: ILayerData[] = [];
  get data() {
    return this._data;
  }
  protected _getLayers: () => IEditorLayer[];

  setLayers(getLayers: () => IEditorLayer[]) {
    this._getLayers = getLayers;
  }

  setDataKey(key: string) {
    this._dataKey = key;
  }

  async save() {
    if (!this._getLayers) {
      return;
    }
    const layers = this._getLayers();
    const saveData: ILayerData[] = [];
    layers.forEach(l => {
      saveData.push({
        id: l.id,
        type: l.type,
        elements: l.elements.map(e => e.getData())
      });
    });
    localStorage.setItem(this._dataKey, JSON.stringify(saveData));
  }

  async load() {
    const saveValue = localStorage.getItem(this._dataKey);
    this._data = saveValue ? JSON.parse(saveValue) : [];
    return this._data;
  }
}
