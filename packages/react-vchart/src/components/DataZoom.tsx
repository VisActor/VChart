import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IDataZoomSpec } from '@visactor/vchart';

export type DataZoomProps = IDataZoomSpec & BaseComponentProps;

export const DataZoom = createComponent<DataZoomProps>('DataZoom', 'dataZoom');
