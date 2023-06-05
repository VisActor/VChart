// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IChartPlugin {}

export interface IChartPluginConstructor {
  readonly type: 'chartPlugin';
  new (): IChartPlugin;
}
