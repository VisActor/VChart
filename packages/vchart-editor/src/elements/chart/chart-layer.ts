import { EditorLayer } from '../../core/editor-layer';
import type { ILayoutLine } from '../../core/interface';
import type { EditorChart } from './chart';

export class ChartLayer extends EditorLayer {
  type: string = 'chart';

  release(): void {
    super.release();
  }

  getLayoutLineInLayer(): ILayoutLine[] {
    const result: ILayoutLine[] = [];
    // @ts-ignore
    this._elements.forEach((chart: EditorChart) => {
      result.push(...chart.getLayoutGuideLine());
    });
    return result;
  }
}
