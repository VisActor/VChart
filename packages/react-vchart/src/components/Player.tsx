import { BaseComponentProps, createComponent } from './BaseComponent';
import type { IPlayerSpec } from '@visactor/vchart';

export type PlayerProps = IPlayerSpec & BaseComponentProps;

export const Player = createComponent<PlayerProps>('Player', 'player', null, true);
