export interface IChartPlugin {
}
export interface IChartPluginConstructor {
    readonly type: 'chartPlugin';
    new (): IChartPlugin;
}
