import { IChartRoleSpec } from '../../dsl-interface';
import type { StandardData, DataInfo } from '../data/interface';
import type { ISpec } from '@visactor/vchart';
import type { IVisactorTemp } from '../../visactor/interface';
import { RoleChart } from '../role';

export interface IChartTemp extends IVisactorTemp {
  type: string;
  /**
   * 根据数据得到原始 vchartSpec
   * @param data 数据
   * @param info 数据信息
   * @param opt 透传参数
   * @returns
   */
  getSpec: (data: StandardData, info: DataInfo, ctx: { chart: RoleChart }, opt?: any) => ISpec | null;

  /**
   * 使用编辑配置更新 vchart-spec ，会修改传入的原始图表配置
   * @param rawSpec 待更新的原始图表配置
   * @param editorSpec 编辑配置
   * @param ctx 图表上下文
   * @param updateAttribute 当前更新信息，如果没有更新信息的话，认为全量更新
   * @returns 返回更新后的图表配置
   */
  updateSpec(rawSpec: ISpec, config: IChartRoleSpec['config'], ctx: { chart: RoleChart }): void;

  // 对 spec 进行后处理
  transformSpec: (rawSpec: ISpec, config: IChartRoleSpec['config'], ctx: { chart: RoleChart }) => ISpec;

  processingVChart: (ctx: { chart: RoleChart }) => void;

  getChartType: () => string;
  checkDataEnable: (data: StandardData, info: DataInfo, opt?: any) => boolean;
  checkSpecialValueEnable: (v: any) => boolean;
  getTempInfo?: () => any;
  clear: () => void;
}

export interface IChartTempConstructor {
  type: string;
  new (): IChartTemp;
}
