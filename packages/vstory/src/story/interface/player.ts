import { IRole } from '../role';
import { IActSpec } from './dsl-interface';

export interface IPlayer {
  tickTo(t: number): void;
  play(): void;
  encodeToVideo(millsecond: number, fps: number): Promise<string>;
  pause(): void;
  release(): void;
  addAct(
    c: IActSpec,
    roles: {
      [key: string]: IRole;
    }
  ): void;
  setCurrentAct(id: number | string): void;
}
