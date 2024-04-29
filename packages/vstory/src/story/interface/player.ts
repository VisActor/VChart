import { ICharacter } from '../character';
import { IActSpec } from './dsl-interface';

export interface IPlayer {
  tickTo(t: number): void;
  play(): void;
  encodeToVideo(millsecond: number, fps: number): Promise<string>;
  pause(): void;
  release(): void;
  addAct(
    c: IActSpec,
    characters: {
      [key: string]: ICharacter;
    }
  ): void;
  setCurrentAct(id: number | string): void;
}
