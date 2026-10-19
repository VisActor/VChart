import { Factory, Layout } from '@visactor/vchart';
import type { ILayoutItem } from '@visactor/vchart';

/** 仅用于编译后的原生 Spec，不属于公共统计 Spec。 */
export interface HexbinLayoutSpec {
  type: 'statplotsHexbin';
  normalizedAspect: number;
}

export class HexbinLayout extends Layout {
  static type = 'statplotsHexbin';
  private normalizedAspect = 1;

  layoutItems(...args: Parameters<Layout['layoutItems']>) {
    // updateSpec 可保留布局实例，必须读取当前 Spec 的比例。
    this.normalizedAspect = (args[0].getSpec().layout as unknown as HexbinLayoutSpec).normalizedAspect;
    return super.layoutItems(...args);
  }

  protected _layoutRegionItem(regions: ILayoutItem[], width: number, height: number) {
    const unit = Math.max(0, Math.min(width / this.normalizedAspect, height));
    return super._layoutRegionItem(regions, unit * this.normalizedAspect, unit);
  }
}

export function registerHexbinLayout(): void {
  Factory.registerLayout(HexbinLayout.type, HexbinLayout);
}
