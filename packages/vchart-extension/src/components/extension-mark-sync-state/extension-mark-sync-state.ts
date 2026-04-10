/**
 * @description ExtensionMark SyncState 插件
 *
 * 将配置了 syncState: true 的 extensionMark 的 graphics 与主 mark 的 graphics
 * 通过 context.key 配对，在主 mark graphic 上监听 afterStateUpdate 事件，
 * 回调中同步状态到 extensionMark graphic。
 *
 * 参考 VRender Label 的 syncState 实现。
 */
import {
  type IChartPlugin,
  type IChartPluginService,
  type ISeries,
  type IMark,
  type IMarkGraphic,
  type VChartRenderActionSource,
  BasePlugin,
  ChartEvent,
  registerChartPlugin,
  isValid
} from '@visactor/vchart';
import type { IExtensionMarkSpecWithSyncState } from './type';

const EXTENSION_MARK_SYNC_STATE_PLUGIN_TYPE = 'ExtensionMarkSyncStatePlugin';

export class ExtensionMarkSyncStatePlugin extends BasePlugin implements IChartPlugin {
  static readonly pluginType: 'chart' = 'chart';
  static readonly type: string = EXTENSION_MARK_SYNC_STATE_PLUGIN_TYPE;
  readonly type: string = EXTENSION_MARK_SYNC_STATE_PLUGIN_TYPE;

  private _bindHandlers: Array<{ bindTarget: IMarkGraphic; handler: () => void }> = [];
  private _afterRenderHandler?: () => void;

  constructor() {
    super(EXTENSION_MARK_SYNC_STATE_PLUGIN_TYPE);
  }

  private _hasSyncState = false;

  onInit(service: IChartPluginService, chartSpec: any) {
    // onInit 阶段 chart 尚未创建，仅做 spec 检测
    this._hasSyncState = this._detectSyncState(chartSpec);
  }

  onAfterInitChart(service: IChartPluginService, chartSpec: any, _actionSource: VChartRenderActionSource) {
    if (!this._hasSyncState) {
      // updateSpec 场景：重新检测
      this._hasSyncState = this._detectSyncState(chartSpec);
      if (!this._hasSyncState) {
        return;
      }
    }

    const chart = service.globalInstance.getChart();
    if (!chart) {
      return;
    }

    // 注册 afterRender 事件，每次渲染完成后建立状态同步关联
    this._afterRenderHandler = () => {
      this._bindSyncState(service);
    };
    chart.getEvent().on(ChartEvent.afterRender, this._afterRenderHandler);
  }

  release(): void {
    // 清理所有 afterStateUpdate 监听
    this._bindHandlers.forEach(({ bindTarget, handler }) => {
      bindTarget.off('afterStateUpdate', handler);
    });
    this._bindHandlers = [];
    this._afterRenderHandler = undefined;
    super.release();
  }

  /**
   * 检测 chartSpec 中是否存在配置了 syncState 的 extensionMark
   */
  private _detectSyncState(chartSpec: any): boolean {
    // 检查顶层 series spec 中的 extensionMark
    const seriesSpecs = chartSpec?.series;
    if (seriesSpecs) {
      for (const seriesSpec of seriesSpecs) {
        if (this._hasExtensionMarkSyncState(seriesSpec.extensionMark)) {
          return true;
        }
      }
    }

    // 非 common chart 时，extensionMark 可直接配置在顶层 spec 上
    if (this._hasExtensionMarkSyncState(chartSpec?.extensionMark)) {
      return true;
    }

    return false;
  }

  private _hasExtensionMarkSyncState(extensionMarks: IExtensionMarkSpecWithSyncState[] | undefined): boolean {
    return !!extensionMarks?.some(m => m.type !== 'group' && m.syncState);
  }

  /**
   * 遍历所有 series，找到配置了 syncState 的 extensionMark，
   * 将其 graphics 与主 mark 的 graphics 通过 context.key 配对并建立状态同步
   */
  private _bindSyncState(service: IChartPluginService) {
    const chart = service.globalInstance.getChart();
    if (!chart) {
      return;
    }

    const allSeries = chart.getAllSeries();
    allSeries.forEach(series => {
      const spec = series.getSpec();
      const extensionMarkSpecs: IExtensionMarkSpecWithSyncState[] | undefined = spec?.extensionMark;
      if (!extensionMarkSpecs?.some(m => m.type !== 'group' && m.syncState)) {
        return;
      }

      this._bindSeriesSyncState(series, extensionMarkSpecs);
    });
  }

  /**
   * 对单个 series 建立 extensionMark 与主 mark 的状态同步
   */
  private _bindSeriesSyncState(series: ISeries, extensionMarkSpecs: IExtensionMarkSpecWithSyncState[]) {
    // 收集主 mark 的 graphics，按 context.key 建立索引
    const activeMarks = series.getActiveMarks();
    const mainGraphicByKey = new Map<string, IMarkGraphic>();

    activeMarks.forEach((mark: IMark) => {
      mark.getGraphics().forEach(g => {
        const key = g.context?.key;
        if (isValid(key)) {
          mainGraphicByKey.set(String(key), g);
        }
      });
    });

    if (mainGraphicByKey.size === 0) {
      return;
    }

    const namePrefix = this._getExtensionMarkNamePrefix(series);

    extensionMarkSpecs.forEach((spec, i) => {
      if (spec.type === 'group' || !spec.syncState) {
        return;
      }

      const markName = isValid(spec.name) ? `${spec.name}` : `${namePrefix}_${i}`;
      const extMark = series.getMarkInName(markName);
      if (!extMark) {
        return;
      }

      extMark.getGraphics().forEach((extGraphic: IMarkGraphic & Record<string, any>) => {
        const key = extGraphic.context?.key;
        if (!isValid(key)) {
          return;
        }

        const mainGraphic = mainGraphicByKey.get(String(key));
        if (!mainGraphic) {
          return;
        }

        // 立即同步一次当前状态
        const currentStates = mainGraphic.currentStates;
        if (currentStates?.length) {
          extGraphic.useStates(currentStates);
        }

        // 避免重复绑定：通过标记位判断
        if (extGraphic._syncStateBindKey === key && extGraphic._syncStateBindTarget === mainGraphic) {
          return;
        }

        // 清理旧监听（如果之前绑定过不同的 mainGraphic）
        if (extGraphic._syncStateHandler && extGraphic._syncStateBindTarget) {
          extGraphic._syncStateBindTarget.off('afterStateUpdate', extGraphic._syncStateHandler);
          // 从 _bindHandlers 中移除旧记录
          this._bindHandlers = this._bindHandlers.filter(
            h => !(h.bindTarget === extGraphic._syncStateBindTarget && h.handler === extGraphic._syncStateHandler)
          );
        }

        // 建立新监听
        const handler = () => {
          const states = mainGraphic.currentStates ?? [];
          extGraphic.useStates(states);
        };
        mainGraphic.on('afterStateUpdate', handler);

        // 记录绑定信息，用于下次去重/清理
        extGraphic._syncStateHandler = handler;
        extGraphic._syncStateBindKey = key;
        extGraphic._syncStateBindTarget = mainGraphic;

        // 记录到插件级别的清理列表
        this._bindHandlers.push({ bindTarget: mainGraphic, handler });
      });
    });
  }

  /**
   * 重建 extensionMark 的命名前缀
   * 与 BaseSeries._getExtensionMarkNamePrefix 保持一致：`${series.type}_${series.id}_extensionMark`
   */
  private _getExtensionMarkNamePrefix(series: ISeries): string {
    return `${series.type}_${series.id}_extensionMark`;
  }
}

/**
 * 注册 ExtensionMark SyncState 插件
 *
 * @example
 * ```ts
 * import { registerExtensionMarkSyncStatePlugin } from '@visactor/vchart-extension';
 *
 * // 在创建 VChart 实例之前注册
 * registerExtensionMarkSyncStatePlugin();
 *
 * // 在 extensionMark 配置中使用 syncState
 * const spec = {
 *   type: 'bar',
 *   extensionMark: [{
 *     type: 'symbol',
 *     dataId: 'barData',
 *     syncState: true,
 *     style: { ... },
 *     state: {
 *       highlight: { ... },
 *       blur: { ... }
 *     }
 *   }]
 * };
 * ```
 */
export const registerExtensionMarkSyncStatePlugin = () => {
  registerChartPlugin(ExtensionMarkSyncStatePlugin);
};
