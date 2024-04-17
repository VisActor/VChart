import { IElement } from '../element';
import { IChapterSpec } from './dsl-interface';

export interface IPlayer {
  tickTo(t: number): void;
  play(): void;
  pause(): void;
  release(): void;
  addChapter(
    c: IChapterSpec,
    elements: {
      [key: string]: IElement;
    }
  ): void;
  setCurrentChapter(id: number | string): void;
}
