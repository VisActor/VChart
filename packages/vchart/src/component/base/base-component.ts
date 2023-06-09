import type { IGroup, INode } from '@visactor/vrender';
import { BaseModel } from '../../model/base-model';
import type { IRegion } from '../../region/interface';
import type { ComponentTypeEnum, IComponent, IComponentOption } from '../interface';
import type { BaseEventParams } from '../../event/interface';
import { ComponentPluginService } from '../../plugin/components/plugin-service';
import type { IComponentPluginService, IComponentPlugin } from '../../plugin/components/interface';
import { isArray, merge } from '@visactor/vutils';
import { getComponentThemeFromGlobalTheme } from './util';
import type { IGroupMark } from '@visactor/vgrammar';
import { Event_Source_Type } from '../../constant';
import type { IAnimate } from '../../animation/interface';
import { AnimateManager } from '../../animation/animate-manager';

export abstract class BaseComponent extends BaseModel implements IComponent {
  name: string = 'component';
  readonly modelType: string = 'component';
  pluginService?: IComponentPluginService;
  protected declare _option: IComponentOption;

  protected _regions: IRegion[] = [];
  getRegions() {
    return this._regions;
  }

  protected _container: IGroup;

  created() {
    super.created();
    this.pluginService = new ComponentPluginService(this);
  }

  animate?: IAnimate;

  constructor(spec: any, options: IComponentOption) {
    super(spec, options);
    this._regions = options.getRegionsInIndex();
    this.layoutBindRegionID = this._regions.map(x => x.id);
    // 创建组件自己的动画管理器
    if (this._option.animation) {
      this.animate = new AnimateManager({
        getCompiler: options.getCompiler
      });
    }
  }

  abstract changeRegions(regions: IRegion[]): void;

  protected callPlugin(cb: (plugin: IComponentPlugin) => void) {
    if (this.pluginService) {
      this.pluginService.getAll().forEach(plugin => cb(plugin));
    }
  }

  protected eventPos(markEventParams: BaseEventParams) {
    return {
      x: (markEventParams.event as any).viewX - this.getLayoutStartPoint().x,
      y: (markEventParams.event as any).viewY - this.getLayoutStartPoint().y
    };
  }

  async setCurrentTheme(theme: any, noRender?: boolean) {
    const modifyConfig = () => {
      // 重新初始化
      this.reInit(theme);

      return { change: true, reMake: false };
    };

    if (noRender) {
      modifyConfig();
    } else {
      await this._option.globalInstance.updateCustomConfigAndRerender(modifyConfig);
    }
  }

  protected _initTheme(theme?: any) {
    const globalTheme = this._option.getTheme();

    if (theme) {
      super._initTheme(theme);
    } else {
      super._initTheme(
        getComponentThemeFromGlobalTheme(this.type as ComponentTypeEnum, globalTheme, this._originalSpec)
      );
    }

    // 将 theme merge 到 spec 中
    if (isArray(this._originalSpec)) {
      this._spec = this._originalSpec.map(spec => merge({}, this._theme, spec));
    } else {
      this._spec = merge({}, this._theme, this._originalSpec);
    }
    this._preprocessSpec();
  }

  protected getContainer() {
    if (!this._container) {
      this._container = this._option.globalInstance.getStage().find(node => node.name === 'root', true);
    }

    return this._container;
  }

  release() {
    super.release();
    this.clear();
  }

  clear() {
    this._container = null;
  }

  compile(): void {
    this.compileSignal();
    this.compileMarks();
  }

  compileMarks(group?: string | IGroupMark) {
    this.getMarks().forEach(m => {
      m.compile({ group });
      m.getProduct()?.configure({
        context: {
          model: this
        }
      });
    });
  }

  // 代理组件事件
  protected _delegateEvent = (component: INode, event: any, type: string) => {
    this.event.emit(type, {
      model: this,
      node: component,
      event,
      item: null,
      datum: null,
      source: Event_Source_Type.chart,
      chart: this._option?.globalInstance?.getChart()
    });
  };
}
