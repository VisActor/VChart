import { Layout, Factory } from '@visactor/vchart';
import type { ILayoutItem } from '@visactor/vchart';

export const MATRIX_COLORBAR_SPACE = 96;

/** 在原生轴测量和缩进后约束矩阵尺寸，底部轴仍由默认布局贴齐 region。 */
export class MatrixLayout extends Layout {
  static type = 'statplotsMatrix';

  protected _layoutRegionItem(regions: ILayoutItem[], width: number, height: number) {
    const side = Math.max(0, Math.min(width - MATRIX_COLORBAR_SPACE, height));
    return super._layoutRegionItem(regions, side, side);
  }
}

export function registerMatrixLayout(): void {
  Factory.registerLayout(MatrixLayout.type, MatrixLayout);
}
