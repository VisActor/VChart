import { IRole } from '../role';
import { IChapterSpec } from './dsl-interface';

export interface IPlayer {
  tickTo(t: number): void;
  play(): void;
  encodeToVideo(millsecond: number, fps: number): Promise<string>;
  pause(): void;
  release(): void;
  addChapter(
    c: IChapterSpec,
    roles: {
      [key: string]: IRole;
    }
  ): void;
  setCurrentChapter(id: number | string): void;
}
