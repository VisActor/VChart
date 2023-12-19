export interface IBasePlugin<T = any> {
    readonly type: string;
    id: UniqueId;
    name: string;
    onAdd: (service: T) => void;
    init?: () => void;
    dispose?: (service: T) => void;
    onInit?: (service: T, ...params: any) => MaybePromise<void>;
    onDidCompile?: (service: T, ...params: any) => MaybePromise<void>;
}
export interface IBasePluginService<T = any> {
    id: UniqueId;
    load: (plugins: T[]) => void;
    add: (plugins: T[]) => T[] | null;
    activate: (plugins: T[]) => void;
    get: (id: UniqueId) => T | undefined;
    getAll: () => T[];
    dispose: (pluginsId: UniqueId) => void;
    disposeAll: () => void;
}
export type UniqueId = number;
export type MaybePromise<T> = T | PromiseLike<T>;
