import type { IComponent } from '../../component/interface';
type UniqueId = number;
type MaybePromise<T> = T | PromiseLike<T>;
interface IContext {
    skipLayout: boolean;
}
export interface IComponentPlugin {
    id: UniqueId;
    name: string;
    onAdd: (service: IComponentPluginService) => void;
    init?: () => void;
    dispose?: (service: IComponentPluginService) => void;
    onInit?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
    onDidCompile?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
    onWillLayout?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
    onDidLayout?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
    onWillLayoutVertical?: (service: IComponentPluginService, context: IContext, ...params: any) => MaybePromise<void>;
    onWillLayoutHorizontal?: (service: IComponentPluginService, context: IContext, ...params: any) => MaybePromise<void>;
    onDidLayoutVertical?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
    onDidLayoutHorizontal?: (service: IComponentPluginService, ...params: any) => MaybePromise<void>;
}
export interface IComponentPluginService {
    id: UniqueId;
    component: IComponent;
    load: (plugins: IComponentPlugin[]) => void;
    add: (plugins: IComponentPlugin[]) => IComponentPlugin[] | null;
    activate: (plugins: IComponentPlugin[]) => void;
    get: (id: UniqueId) => IComponentPlugin | undefined;
    getAll: () => IComponentPlugin[];
    dispose: (pluginsId: UniqueId) => void;
    disposeAll: () => void;
}
export {};
