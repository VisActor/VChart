import type { IGroup } from '@visactor/vrender';
import { createText, createGroup } from '@visactor/vrender';
import { EditorLayer } from '../../core/editor-layer';
export class ChartLayer extends EditorLayer {
  protected _editorGroup: IGroup;
  type: string = 'chart';

  constructor(container: HTMLElement, id?: string | number) {
    super(container, id);
    this.initEditorGroup();
  }

  initEditorGroup() {
    const group = createGroup({
      x: 0,
      y: 0,
      zIndex: -1
    });
    this._stage.defaultLayer.add(group);
    this._editorGroup = group;
  }

  addGuideText() {
    if (!this._stage) {
      return;
    }
    const text = createText({
      text: '123123',
      fill: 'blue',
      x: 200,
      y: 100
    });
    this._editorGroup.add(text);
  }
}
