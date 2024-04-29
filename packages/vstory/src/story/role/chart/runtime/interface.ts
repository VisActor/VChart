import { IRoleVisactor } from '../../visactor/interface';
export interface IChartRoleRuntime {
  readonly type: string;
  // spec 准备完成
  onSpecReady?: () => void;

  // 图表初始化完成
  afterInitializeChart?: () => void;

  // 图表绘制完成
  afterVRenderDraw?: () => void;
}

export interface IChartRoleRuntimeConstructor {
  new (role: IRoleVisactor): IChartRoleRuntime;
}
