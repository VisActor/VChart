import { CommonSpecRuntime } from './runtime/common-spec';
import { ComponentSpecRuntime } from './runtime/component-spec';
import { IChartRoleRuntimeConstructor } from './runtime/interface';
import { cloneDeep } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import { IChartRoleSpec } from '../dsl-interface';
import { Chart } from './graphic/vchart-graphic';
import { getLayoutFromWidget } from '../../utils/layout';
import { RoleVisactor } from '../visactor/role';
import { SpecProcess } from './spec-process/spec-process';
import { ChartDataTempTransform } from './spec-process/data-temp-transform';
import { ITicker } from '@visactor/vrender-core';
import { manualTicker } from '../../player/ticker';
import { IChartTemp } from './temp/interface';
import { SeriesSpecRuntime } from './runtime/series-spec';

export class RoleChart extends RoleVisactor {
  static type = 'RoleChart';
  static RunTime: IChartRoleRuntimeConstructor[] = [
    ComponentSpecRuntime as unknown as IChartRoleRuntimeConstructor,
    CommonSpecRuntime as unknown as IChartRoleRuntimeConstructor,
    SeriesSpecRuntime as unknown as IChartRoleRuntimeConstructor
  ];

  protected declare _specProcess: SpecProcess;
  protected _ticker: ITicker;

  protected declare _spec: IChartRoleSpec;
  get spec() {
    return this._spec;
  }

  protected _initSpecProcess(): void {
    this._specProcess = new SpecProcess(this as any, ChartDataTempTransform, this.onSpecReady);
  }

  protected _initRuntime(): void {
    RoleChart.RunTime.forEach(R => {
      this._runtime.push(new R(this));
    });
  }

  protected _parserSpec(): void {
    this._specProcess.updateConfig(this._spec);
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
    const spec = cloneDeep(this._specProcess.getVisSpec() ?? this._spec.options.spec);
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
      autoRender: false,
      disableDirtyBounds: true,
      viewBox,
      ticker: manualTicker,
      visibleAll: false,
      chartInitOptions: {
        animation: true,
        disableTriggerEvent: true,
        performanceHook: {
          afterInitializeChart: () => {
            (<IChartTemp>this.specProcess.dataTempTransform?.specTemp)?.afterInitializeChart({ role: this });
            this._runtime.forEach(r => r.afterInitializeChart?.());
          },
          afterVRenderDraw: () => {
            this._runtime.forEach(r => r.afterVRenderDraw?.());
          }
        }
      }
    });
    this.option.graphicParent.add(this._graphic as any);
  }

  protected _afterRender(): void {
    console.log('afterRender');
  }
  protected _updateVisactorSpec(): void {
    console.log('_updateVisactorSpec', this._specProcess.getVisSpec());
    this._graphic?.updateSpec(this._specProcess.getVisSpec());
  }

  public clearRole(): void {
    this._graphic.vProduct.release();
    this._graphic.parent.removeChild(this._graphic);
  }

  tickTo(t: number): void {
    this._ticker.tickAt(t);
  }
}
