export interface IConfig {
  base?: Record<string, IBaseComponentConfig>;
  editor?: Record<string, IEditorComponentConfig>;
}

export interface IBaseComponentConfig {
  label: string;
  value: {
    default: any;
    [key: string]: any;
  };
}

export interface IEditorComponentConfig {
  label: string;
}
