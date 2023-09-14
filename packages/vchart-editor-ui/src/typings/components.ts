import type { ITitleEditorComponentConfig } from './config';

export interface IComponentProps {
  spec?: any;
  onChange?: () => void;
}

export interface ITitleComponentProps extends IComponentProps {
  spec?: any;
  config?: ITitleEditorComponentConfig;
}
