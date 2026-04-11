/**
 * @description ExtensionMark SyncState 插件
 *
 * 将配置了 syncState: true 的 extensionMark 的 graphics 与主 mark 的 graphics
 * 通过 context.key 配对，在 afterRender 回调中将主 mark 的当前状态同步到
 * extensionMark graphic。
 *
 * 由于 afterRender 在每次状态更新完成后都会触发，因此无需在单个 graphic 上
 * 额外监听 afterStateUpdate 事件。
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

    // 注册 afterRender 事件，每次渲染完成后直接同步状态
    // afterRender 在每次状态更新完成后都会触发，因此无需额外监听单个 graphic 的状态变化
    this._afterRenderHandler = () => {
      this._syncStates(service);
    };
    chart.getEvent().on(ChartEvent.afterRender, this._afterRenderHandler);
  }

  release(): void {
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
   * 将其 graphics 与主 mark 的 graphics 通过 context.key 配对并同步状态
   */
  private _syncStates(service: IChartPluginService) {
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

      this._syncSeriesStates(series, extensionMarkSpecs);
    });
  }

  /**
   * 对单个 series，将主 mark 的当前状态同步到 extensionMark
   */
  private _syncSeriesStates(series: ISeries, extensionMarkSpecs: IExtensionMarkSpecWithSyncState[]) {
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

      extMark.getGraphics().forEach(extGraphic => {
        const key = extGraphic.context?.key;
        if (!isValid(key)) {
          return;
        }

        const mainGraphic = mainGraphicByKey.get(String(key));
        if (!mainGraphic) {
          return;
        }

        // 直接同步主 graphic 的当前状态
        const currentStates = mainGraphic.currentStates;
        if (currentStates?.length) {
          extGraphic.useStates(currentStates);
        } else {
          extGraphic.clearStates();
        }
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
