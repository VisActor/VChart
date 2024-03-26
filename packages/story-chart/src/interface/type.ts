export interface IPlayConfig {
  playTime?: number; // 单位 秒

  playSpeed?: 0.5 | 1 | 1.5 | 2;
}

export interface IEntity {
  play: () => {};
  render: (context: IContext) => {};
}

export type IContext = {
  dom: string | HTMLElement;
};
