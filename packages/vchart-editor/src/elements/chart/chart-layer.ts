import type { IChartModel } from './interface';
import type { IChart } from './../../../__tests__/browser/aeolus.local/viz-pipeline/es/types/chartSpace/index.d';
import { EditorLayer } from '../../core/editor-layer';
import type { ILayoutLine } from '../../core/interface';
import { LayoutRectToRect } from '../../utils/space';
import type { EditorChart } from './chart';
import { getChartModelWithModelInfo, transformModelRect, IgnoreModelTypeInLayout } from './utils/layout';

export class ChartLayer extends EditorLayer {
  type: string = 'chart';

  release(): void {
    super.release();
  }

  getLayoutLineInLayer(): ILayoutLine[] {
    const result: ILayoutLine[] = [];
    // @ts-ignore
    this._elements.forEach((chart: EditorChart) => {
      const layoutData = chart.layout.getLayoutData();
      layoutData.data.forEach(d => {
        const model = getChartModelWithModelInfo(chart.vchart as IChart, d);
        if (!model || IgnoreModelTypeInLayout[model.type]) {
          return;
        }
        const rect = transformModelRect(model as unknown as IChartModel, LayoutRectToRect(d.layout));
        const commonInY: Omit<ILayoutLine, 'value'> = {
          orient: 'y',
          id: d.id,
          specKey: d.specKey,
          specIndex: d.specIndex,
          start: rect.x,
          end: rect.x + rect.width,
          rect
        };
        // top
        result.push({
          value: rect.y,
          ...commonInY
        });
        // bottom
        result.push({
          value: rect.y + rect.height,
          ...commonInY
        });
        // middle
        result.push({
          value: rect.y + rect.height * 0.5,
          ...commonInY
        });

        const commonInX: Omit<ILayoutLine, 'value'> = {
          orient: 'x',
          id: d.id,
          specKey: d.specKey,
          specIndex: d.specIndex,
          start: rect.y,
          end: rect.y + rect.height,
          rect
        };
        // left
        result.push({
          value: rect.x,
          ...commonInX
        });
        // right
        result.push({
          value: rect.x + rect.width,
          ...commonInX
        });
        // middle
        result.push({
          value: rect.x + rect.width * 0.5,
          ...commonInX
        });
      });
    });
    return result;
  }
}
