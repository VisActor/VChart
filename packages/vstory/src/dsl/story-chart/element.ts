import { CreateUID } from '../../util/common';

export abstract class StoryElement {
  public uid: number = CreateUID();
}
