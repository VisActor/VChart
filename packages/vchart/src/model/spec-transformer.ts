import { isArray, mergeSpec } from '../util';
import type { IBaseModelSpecTransformer, IBaseModelSpecTransformerOption, IModelSpec } from './interface';

export class BaseModelSpecTransformer<T extends IModelSpec> implements IBaseModelSpecTransformer {
  readonly type: string;
  protected _option: IBaseModelSpecTransformerOption;

  protected _theme?: any; // 非全局 theme，是对应于具体 model 的 theme 对象

  constructor(option: IBaseModelSpecTransformerOption) {
    this._option = option;
    this.type = option.type;
  }

  protected _initTheme(spec: T, chartSpec: any): { spec: T; theme: any } {
    this._theme = this.getTheme(spec, chartSpec);
    return this._mergeThemeToSpec(spec, chartSpec);
  }

  getTheme(spec: T, chartSpec: any): any {
    return undefined;
  }

  /** 不建议重写该方法，最好重写 protected 版本 */
  transformSpec(spec: T, chartSpec: any): { spec: T; theme: any } {
    this._transformSpec(spec, chartSpec);
    return this._initTheme(spec, chartSpec);
  }

  protected _transformSpec(spec: T, chartSpec: any) {
    // do nothing
    // change spec by default logic
  }

  /** 将 theme merge 到 spec 中 */
  protected _mergeThemeToSpec(spec: T, chartSpec: any): { spec: T; theme: any } {
    const theme = this._theme;
    if (this._shouldMergeThemeToSpec()) {
      const specFromChart = this._getDefaultSpecFromChart(chartSpec);

      // this._originalSpec + specFromChart + this._theme = this._spec
      const merge = (originalSpec: any) =>
        mergeSpec(
          {},
          theme,
          this._prepareSpecBeforeMergingTheme(specFromChart),
          this._prepareSpecBeforeMergingTheme(originalSpec)
        );

      if (isArray(spec)) {
        return {
          spec: spec.map(specItem => merge(specItem)) as unknown as T,
          theme
        };
      }
      return {
        spec: merge(spec),
        theme
      };
    }
    return { spec, theme };
  }

  /** 是否在初始化时将 theme 自动 merge 到 spec */
  protected _shouldMergeThemeToSpec(): boolean {
    return true;
  }

  /** 从 chart spec 提取配置作为 model 的默认 spec 配置 */
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    return {};
  }

  /** 在 merge 主题前对 spec 进行预处理 */
  protected _prepareSpecBeforeMergingTheme(spec?: Partial<T>): Partial<T> {
    // do nothing
    return spec;
  }
}
