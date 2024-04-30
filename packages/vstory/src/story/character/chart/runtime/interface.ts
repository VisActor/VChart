import { ICharacterVisactor } from '../../visactor/interface';
export interface IChartCharacterRuntime {
  readonly type: string;
  // spec 准备完成
  onSpecReady?: () => void;

  // 图表初始化完成
  afterInitializeChart?: () => void;

  // 图表绘制完成
  afterVRenderDraw?: () => void;
}

export interface IChartCharacterRuntimeConstructor {
  new (character: ICharacterVisactor): IChartCharacterRuntime;
}
