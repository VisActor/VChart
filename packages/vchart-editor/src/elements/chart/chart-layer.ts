import { EditorLayer } from '../../core/editor-layer';

export class ChartLayer extends EditorLayer {
  type: string = 'chart';

  release(): void {
    super.release();
  }
}
