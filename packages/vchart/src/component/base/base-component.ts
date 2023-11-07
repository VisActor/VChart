import type { IGraphic, IGroup, INode } from '@visactor/vrender-core';
import type { IRegion } from '../../region/interface';
import type { ComponentTypeEnum, IComponent, IComponentOption } from '../interface';
import type { BaseEventParams } from '../../event/interface';
import { ComponentPluginService } from '../../plugin/components/plugin-service';
import type { IComponentPluginService, IComponentPlugin } from '../../plugin/components/interface';
import type { IBoundsLike } from '@visactor/vutils';
import { isEqual } from '@visactor/vutils';
import { getComponentThemeFromGlobalTheme } from './util';
import type { IGroupMark } from '@visactor/vgrammar-core';
import { Event_Source_Type } from '../../constant';
import type { IAnimate } from '../../animation/interface';
import { AnimateManager } from '../../animation/animate-manager';
import type { Datum } from '../../typings';
import { preprocessSpecOrTheme } from '../../util/spec/preprocess';
import { normalizeLayoutPaddingSpec } from '../../util/space';
import type { IComponentSpec } from './interface';
import { LayoutModel } from '../../model/layout-model';
import type { ILayoutRect } from '../../layout/interface';

export abstract class BaseComponent<T extends IComponentSpec = IComponentSpec>
  extends LayoutModel<T>
  implements IComponent
{
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
    this._regions = this._option.getRegionsInIndex();
    this._layout.layoutBindRegionID = this._regions.map(x => x.id);
  }

  abstract changeRegions(regions: IRegion[]): void;
  abstract getVRenderComponents(): IGraphic[];

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

  protected _getTheme() {
    return preprocessSpecOrTheme(
      'theme',
      getComponentThemeFromGlobalTheme(this.type as ComponentTypeEnum, this._option, this._originalSpec),
      this.getColorScheme()
    );
  }

  protected _mergeThemeToSpec() {
    super._mergeThemeToSpec();

    // 默认忽略外侧 padding
    const { padding, noOuterPadding = true, orient } = this.getSpec();
    if (noOuterPadding && padding && orient) {
      this._spec.padding = {
        ...normalizeLayoutPaddingSpec(padding),
        [orient]: 0
      };
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
  _compareSpec() {
    const result = super._compareSpec();
    if (!result.reMake) {
      result.reMake = ['seriesId', 'seriesIndex', 'regionId', 'regionIndex'].some(k => {
        return isEqual(this._originalSpec?.[k], this.getSpec()[k]);
      });
    }
    if (this._originalSpec?.visible !== (<any>this.getSpec()).visible) {
      result.reCompile = true;
    }
    return result;
  }

  release() {
    super.release();
    this.clear();
  }

  clear() {
    const components = this.getVRenderComponents();
    if (components && components.length) {
      components.forEach(c => {
        if (c) {
          this.getContainer()?.removeChild(c as unknown as INode);
          c = null;
        }
      });
    }
    this._container = null;
    this.pluginService?.disposeAll();
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

  // 代理组件事件
  protected _delegateEvent = (component: IGraphic, event: any, type: string, item: any = null, datum: Datum = null) => {
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
  };

  getGraphicBounds = () => {
    return this.getVRenderComponents()?.[0]?.AABBBounds ?? super.getGraphicBounds();
  };

  getBoundsInRect(rect: ILayoutRect, fullRect: ILayoutRect): IBoundsLike {
    return { x1: 0, x2: 0, y1: 0, y2: 0 };
  }
}
