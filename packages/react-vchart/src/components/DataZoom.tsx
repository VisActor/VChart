import { DATAZOOM_CUSTOMIZED_EVENTS, DataZoomEventProps } from '../eventsUtils';
import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IDataZoomSpec } from '@visactor/vchart';
import { registerDataZoom, VChart } from '@visactor/vchart';

VChart.useRegisters([registerDataZoom]);

export type DataZoomProps = IDataZoomSpec & BaseComponentProps & DataZoomEventProps;
export const DataZoom = createComponent<DataZoomProps>('DataZoom', 'dataZoom', DATAZOOM_CUSTOMIZED_EVENTS);
