import { BoxSelection } from './edit-component/box-selection';
import { EventEmitter } from '@visactor/vutils';
import { PickEventType } from './const';
import { Story } from '../story/story';
import { ContinuousActionType, EditActionEnum, IEditActionInfo } from './interface';
import { StoryEvent } from '../story/interface/runtime-interface';

export class EditAction {
  readonly emitter: EventEmitter = new EventEmitter();

  protected _actionInProgress: ContinuousActionType = null;
  get actionInProgress() {
    return this._actionInProgress;
  }

  protected _boxSelection: BoxSelection;

  constructor(public readonly story: Story) {}

  onStoryEvent(event: StoryEvent, type: string) {
    // TODO: hack detailPath会被正常删除后，删除这个hack代码
    if (event.detailPath) {
      if (event.path[event.path.length - 1] !== event.detailPath[event.path.length - 1]) {
        delete event.detailPath;
      }
    }
    // 非选中逻辑
    if (!PickEventType[type]) {
      return this.dispatchAction({
        type: type,
        event
      });
    }

    // 选中逻辑才添加交互元素信息。得到交互元素
    const { characterInfo, character } = this.story.canvas.getEventDetail(event);
    return this.dispatchAction({
      type: type === 'click' && character ? EditActionEnum.singleSelection : type,
      characterId: character?.id,
      character: character,
      event,
      detail: characterInfo
    });
  }

  dispatchAction(action: IEditActionInfo) {
    this.emitter.emit('dispatchAction', action);
  }
}
