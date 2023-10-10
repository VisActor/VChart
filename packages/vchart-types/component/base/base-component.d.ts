import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { BaseModel } from '../../model/base-model';
import type { IRegion } from '../../region/interface';
import type { IComponent, IComponentOption } from '../interface';
import type { BaseEventParams } from '../../event/interface';
import type { IComponentPluginService, IComponentPlugin } from '../../plugin/components/interface';
import type { IGroupMark } from '@visactor/vgrammar-core';
import type { IAnimate } from '../../animation/interface';
import type { Datum } from '../../typings';
import type { IComponentSpec } from './interface';
export declare abstract class BaseComponent<T extends IComponentSpec = IComponentSpec>
  extends BaseModel<T>
  implements IComponent
{
  name: string;
  readonly modelType: string;
  pluginService?: IComponentPluginService;
  protected _option: IComponentOption;
  protected _regions: IRegion[];
  getRegions(): IRegion[];
  protected _container: IGroup;
  created(): void;
  animate?: IAnimate;
  constructor(spec: T, options: IComponentOption);
  abstract changeRegions(regions: IRegion[]): void;
  abstract getVRenderComponents(): IGroup[];
  protected callPlugin(cb: (plugin: IComponentPlugin) => void): void;
  protected eventPos(markEventParams: BaseEventParams): {
    x: number;
    y: number;
  };
  setCurrentTheme(theme: any, noRender?: boolean): Promise<void>;
  protected _initTheme(theme?: any): void;
  protected _mergeThemeToSpec(): void;
  protected getContainer(): IGroup;
  _compareSpec(): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  release(): void;
  clear(): void;
  compile(): void;
  compileMarks(group?: string | IGroupMark): void;
  protected _delegateEvent: (component: IGraphic, event: any, type: string, item?: any, datum?: Datum) => void;
}
