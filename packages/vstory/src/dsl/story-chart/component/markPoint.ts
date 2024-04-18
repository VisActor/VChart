import { StoryComponent } from './base';
import { StoryChartComponentType } from '../../constant';
import type { IGroup } from '@visactor/vrender-core';
import type { MarkPoint as VChartMarkPoint } from '@visactor/vchart';

export class MarkPoint extends StoryComponent {
  protected type = StoryChartComponentType.MARK_POINT;

  private _componentInstance: VChartMarkPoint;
  setComponentInstance(_componentInstance: VChartMarkPoint) {
    this._componentInstance = _componentInstance;
  }
  public getGroupGraphic(): IGroup {
    // @ts-ignore
    return this._componentInstance?._markerComponent?._item;
  }

  public coordinate() {}
}
