import { cloneDeep } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import { IChartRoleSpec } from '../dsl-interface';
import { Chart } from './graphic/vchart-graphic';
import { getLayoutFromWidget } from '../../utils/layout';
import { IRoleInitOption } from '../runtime-interface';
import { RoleVisactor } from '../visactor/role';
import { SpecProcess } from './spec-process/spec-process';
import { ChartDataTempTransform } from './spec-process/data-temp-transform';
import { ManualTicker, ITicker } from '@visactor/vrender-core';
import { manualTicker } from '../../player/ticker';

const tempSpec = {
  type: 'bar',
  data: [
    {
      id: 'barData',
      values: [
        { month: 'Monday', sales: 22 },
        { month: 'Tuesday', sales: 13 },
        { month: 'Wednesday', sales: 25 },
        { month: 'Thursday', sales: 29 },
        { month: 'Friday', sales: 38 }
      ]
    }
  ],
  xField: 'month',
  yField: 'sales',
  axes: [{ orient: 'bottom', label: { visible: false } }]
};

export class RoleChart extends RoleVisactor {
  protected declare _specProcess: SpecProcess;
  protected _ticker: ITicker;

  protected declare _spec: IChartRoleSpec;
  get spec() {
    return this._spec;
  }

  protected _initSpecProcess(): void {
    this._specProcess = new SpecProcess(this as any, ChartDataTempTransform, this.onSpecReady);
  }

  protected _parserSpec(): void {
    console.log('_parserSpec');
    this._specProcess.updateConfig(this._spec.options);
  }
  protected _initGraphics(): void {
    // this._ticker = new ManualTicker([]);
    const layout = getLayoutFromWidget(this._spec.position);
    const viewBox = {
      x1: layout.x,
      x2: layout.x + layout.width,
      y1: layout.y,
      y2: layout.y + layout.height
    };
    const spec = cloneDeep(this._spec.options.spec ?? tempSpec);
    spec.width = layout.width;
    spec.height = layout.height;
    // @ts-ignore
    this._graphic = new Chart({
      renderCanvas: this._option.canvas.getCanvas(),
      spec: spec,
      ClassType: VChart,
      vchart: null,
      mode: 'desktop-browser',
      dpr: window.devicePixelRatio,
      interactive: false,
      animation: true,
      autoRender: false,
      disableTriggerEvent: true,
      disableDirtyBounds: true,
      viewBox,
      ticker: manualTicker,
      visibleAll: false
    });
    this.option.graphicParent.add(this._graphic as any);
  }

  protected _afterRender(): void {
    console.log('afterRender');
  }
  protected _updateVisactorSpec(): void {
    console.log('_updateVisactorSpec');
    this._graphic?.updateSpec(this._specProcess.getRoleSpec());
  }

  public clearRole(): void {
    this._graphic.vProduct.release();
    this._graphic.parent.removeChild(this._graphic);
  }

  tickTo(t: number): void {
    this._ticker.tickAt(t);
  }
}
