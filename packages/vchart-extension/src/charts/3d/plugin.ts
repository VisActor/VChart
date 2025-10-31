import { registerDirectionalLight, registerOrthoCamera, registerViewTransform3dPlugin } from '@visactor/vchart';
import type { IChartPlugin, IChartPluginService, VChartRenderActionSource } from '@visactor/vchart';
import { BasePlugin, registerChartPlugin } from '@visactor/vchart';
import { is3DAxisChart, is3DChart } from './util';

export class VChart3dPlugin extends BasePlugin implements IChartPlugin {
  static readonly pluginType: 'chart' = 'chart';
  static readonly type: string = 'VChart3dPlugin';
  readonly type: string = 'VChart3dPlugin';

  constructor() {
    super(VChart3dPlugin.type);
  }

  protected _is3d?: boolean;

  onInit(service: IChartPluginService, chartSpec: any) {
    this._is3d = is3DChart(chartSpec);

    if (this._is3d) {
      const { globalInstance } = service;
      const stage = globalInstance.getCompiler().getStage();

      stage.set3dOptions({
        ...(globalInstance as any)._option?.options3d
      });
    }
  }

  onBeforeInitChart(service: IChartPluginService, chartSpec: any, actionSource: VChartRenderActionSource) {
    if (!this._is3d) {
      return;
    }

    if (is3DAxisChart(chartSpec)) {
      chartSpec.layout = {
        type: 'layout3d'
      };
    }
  }
}

export const register3DPlugin = () => {
  registerChartPlugin(VChart3dPlugin);
  registerDirectionalLight();
  registerOrthoCamera();
  registerViewTransform3dPlugin();
};
