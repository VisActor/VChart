import { cloneDeep } from '@visactor/vutils';
import { VChart } from '@visactor/vchart';
import { IElementChartSpec } from '../dsl-interface';
import { Chart } from './graphic/vchart-graphic';
import { getLayoutFromWidget } from '../../utils/layout';
import { IElementInitOption } from '../runtime-interface';
import { ElementVisactor } from '../visactor/element';
import { SpecProcess } from './spec-process/spec-process';
import { ChartDataTempTransform } from './spec-process/data-temp-transform';
import { ManualTicker } from '@visactor/vrender-core';
import { manualTicker } from '../../player/ticker';

const tempSpec = {
  type: 'line',
  data: {
    values: [
      { type: 'Nail polish', country: 'Africa', value: 4229 },
      { type: 'Nail polish', country: 'EU', value: 4376 },
      { type: 'Nail polish', country: 'China', value: 3054 },
      { type: 'Nail polish', country: 'USA', value: 12814 },
      { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
      { type: 'Eyebrow pencil', country: 'EU', value: 3987 },
      { type: 'Eyebrow pencil', country: 'China', value: 5067 },
      { type: 'Eyebrow pencil', country: 'USA', value: 13012 },
      { type: 'Rouge', country: 'Africa', value: 5221 },
      { type: 'Rouge', country: 'EU', value: 3574 },
      { type: 'Rouge', country: 'China', value: 7004 },
      { type: 'Rouge', country: 'USA', value: 11624 },
      { type: 'Lipstick', country: 'Africa', value: 9256 },
      { type: 'Lipstick', country: 'EU', value: 4376 },
      { type: 'Lipstick', country: 'China', value: 9054 },
      { type: 'Lipstick', country: 'USA', value: 8814 },
      { type: 'Eyeshadows', country: 'Africa', value: 3308 },
      { type: 'Eyeshadows', country: 'EU', value: 4572 },
      { type: 'Eyeshadows', country: 'China', value: 12043 },
      { type: 'Eyeshadows', country: 'USA', value: 12998 },
      { type: 'Eyeliner', country: 'Africa', value: 5432 },
      { type: 'Eyeliner', country: 'EU', value: 3417 },
      { type: 'Eyeliner', country: 'China', value: 15067 },
      { type: 'Eyeliner', country: 'USA', value: 12321 },
      { type: 'Foundation', country: 'Africa', value: 13701 },
      { type: 'Foundation', country: 'EU', value: 5231 },
      { type: 'Foundation', country: 'China', value: 10119 },
      { type: 'Foundation', country: 'USA', value: 10342 },
      { type: 'Lip gloss', country: 'Africa', value: 4008 },
      { type: 'Lip gloss', country: 'EU', value: 4572 },
      { type: 'Lip gloss', country: 'China', value: 12043 },
      { type: 'Lip gloss', country: 'USA', value: 22998 },
      { type: 'Mascara', country: 'Africa', value: 18712 },
      { type: 'Mascara', country: 'EU', value: 6134 },
      { type: 'Mascara', country: 'China', value: 10419 },
      { type: 'Mascara', country: 'USA', value: 11261 }
    ]
  },
  title: {
    visible: true,
    text: 'Stacked line chart'
  },
  stack: true,
  xField: 'type',
  yField: 'value',
  seriesField: 'country',
  lineLabel: { visible: true },
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }]
};

export class ElementChart extends ElementVisactor {
  protected declare _specProcess: SpecProcess;

  protected declare _spec: IElementChartSpec;
  get spec() {
    return this._spec;
  }

  constructor(spec: IElementChartSpec, option: IElementInitOption) {
    super(spec, option);
  }

  protected _initSpecProcess(): void {
    this._specProcess = new SpecProcess(this as any, ChartDataTempTransform, this.onSpecReady);
  }

  protected _parserSpec(): void {
    console.log('_parserSpec');
    this._specProcess.updateConfig(this._spec.config);
  }
  protected _initGraphics(): void {
    const layout = getLayoutFromWidget(this._spec.widget);
    const viewBox = {
      x1: layout.x,
      x2: layout.x + layout.width,
      y1: layout.y,
      y2: layout.y + layout.height
    };
    const spec = cloneDeep(this._specProcess.getElementSpec() ?? tempSpec);
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
      disableTriggerEvent: true,
      disableDirtyBounds: true,
      viewBox,
      ticker: manualTicker,
      visibleAll: false
    });
    this.geElementRootMark().add(this._graphic as any);
  }

  protected _afterRender(): void {
    console.log('afterRender');
  }
  protected _updateVisactorSpec(): void {
    console.log('_updateVisactorSpec');
    this._graphic?.updateSpec(this._specProcess.getElementSpec());
  }
}
