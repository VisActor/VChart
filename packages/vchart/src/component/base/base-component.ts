import { CustomEvent, type IGraphic, type IGroup, type INode } from '@visactor/vrender-core';
import type { IRegion } from '../../region/interface';
import type { IComponent, IComponentOption } from '../interface';
import { ComponentPluginService } from '../../plugin/components/plugin-service';
import type { IComponentPluginService, IComponentPlugin } from '../../plugin/components/interface';
import type { IBoundsLike } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isEqual } from '@visactor/vutils';
import type { IGroupMark } from '@visactor/vgrammar-core';
import { Event_Source_Type } from '../../constant';
import type { IAnimate } from '../../animation/interface';
import { AnimateManager } from '../../animation/animate-manager';
// import { preprocessSpecOrTheme } from '../../util/spec/preprocess';
import type { Datum, ILayoutRect } from '../../typings';
import type { IComponentSpec } from './interface';
import { LayoutModel } from '../../model/layout-model';
import { BaseComponentSpecTransformer } from './base-component-transformer';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';

export class BaseComponent<T extends IComponentSpec = IComponentSpec> extends LayoutModel<T> implements IComponent {
  static transformerConstructor = BaseComponentSpecTransformer;
  name: string = 'component';
  readonly modelType: string = 'component';
  readonly transformerConstructor = BaseComponentSpecTransformer as any;
  pluginService?: IComponentPluginService;

  static createComponent(specInfo: IModelSpecInfo, options: IComponentOption): IComponent {
    const { spec, ...others } = specInfo;
    return new this(spec, {
      ...options,
      ...others
    });
  }

  protected declare _option: IComponentOption;

  protected _regions: IRegion[];
  getRegions() {
    return this._regions;
  }

  protected _container: IGroup;

  created() {
    this.initLayout();
    super.created();
    this.pluginService = new ComponentPluginService(this);
  }

  animate?: IAnimate;

  constructor(spec: T, options: IComponentOption) {
    super(spec, options);
    // 创建组件自己的动画管理器
    if (this._option.animation) {
      this.animate = new AnimateManager({
        getCompiler: options.getCompiler
      });
    }
  }

  initLayout(): void {
    super.initLayout();
    this._regions = this._regions ?? this._option.getRegionsInIndex();
    this._layout && (this._layout.layoutBindRegionID = this._regions.map(x => x?.id));
  }

  changeRegions(regions: IRegion[]): void {
    throw new Error('Method not implemented.');
  }
  protected _getNeedClearVRenderComponents(): IGraphic[] {
    throw new Error('Method not implemented.');
  }
  onRender(ctx: IModelRenderOption): void {
    throw new Error('Method not implemented.');
  }

  getVRenderComponents() {
    return this._getNeedClearVRenderComponents();
  }

  protected callPlugin(cb: (plugin: IComponentPlugin) => void) {
    if (this.pluginService) {
      this.pluginService.getAll().forEach(plugin => cb(plugin));
    }
  }

  protected getContainer() {
    if (!this._container) {
      this._container = this._option?.globalInstance.getStage().find(node => node.name === 'root', true);
    }

    return this._container;
  }

  /**
   * updateSpec
   */
  _compareSpec(spec: T, prevSpec: T) {
    const result = super._compareSpec(spec, prevSpec);
    if (!result.reMake) {
      result.reMake = ['seriesId', 'seriesIndex', 'regionId', 'regionIndex'].some(k => {
        return !isEqual(prevSpec?.[k], spec[k]);
      });
    }
    if ((prevSpec as any)?.visible !== (spec as any).visible) {
      result.reCompile = true;
    }
    return result;
  }

  release() {
    super.release();
    this.clear();
  }

  clear() {
    const components = this._getNeedClearVRenderComponents();
    if (components && components.length) {
      components.forEach(c => {
        if (c) {
          this.getContainer()?.removeChild(c as unknown as INode);
          c = null;
        }
      });
    }
    this._container = null;
    this.pluginService?.releaseAll();
    this.pluginService = null;
  }

  compile(): void {
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

  // 代理组件本身的事件（非内部图形），如坐标轴整体的点击等
  protected _delegateEvent = (component: IGraphic, event: any, type: string, item: any = null, datum: Datum = null) => {
    // 组件这里只代理基础的事件，自定义事件不需要代理
    if (!(event instanceof CustomEvent)) {
      this.event.emit(
        type,
        {
          model: this,
          node: component,
          event,
          item: item,
          datum: datum,
          source: Event_Source_Type.chart,
          chart: this._option?.globalInstance?.getChart()
        },
        'model'
      );
    }
  };

  getBoundsInRect(rect: ILayoutRect, fullRect: ILayoutRect): IBoundsLike {
    return { x1: 0, x2: 0, y1: 0, y2: 0 };
  }
}
