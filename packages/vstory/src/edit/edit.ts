import { StoryEvent } from '../story/interface/runtime-interface';
import { Story } from './../story/story';
import { EditAction } from './edit-action';
import { EventEmitter } from '@visactor/vutils';
import { IEditActionInfo, IEditComponent, IEditComponentConstructor, IEditMessage } from './interface';

export class Edit {
  readonly editAction: EditAction;
  readonly emitter: EventEmitter;

  protected static componentConstructorMap: { [key: string]: IEditComponentConstructor } = {};

  static registerEditComponent(key: string, cpt: IEditComponentConstructor) {
    Edit.componentConstructorMap[key] = cpt;
  }

  protected _componentMap: { [key: string]: IEditComponent } = {};
  protected _componentList: IEditComponent[];

  protected _currentComponent: IEditComponent;

  constructor(public readonly story: Story) {
    this.emitter = new EventEmitter();
    this.editAction = new EditAction(story);
    this.editAction.emitter.on('dispatchAction', this.onAction.bind(this));
    this.story.canvas.getStage().addEventListener('*', this.onStoryEvent.bind(this) as any);
    this._initComponent();
  }

  protected _initComponent() {
    this._componentMap = {};
    Object.keys(Edit.componentConstructorMap).forEach(key => {
      this._componentMap[key] = new Edit.componentConstructorMap[key](this);
    });
    this._componentList = Object.values(this._componentMap)
      .sort((a, b) => a.level - b.level)
      .reverse();
  }

  onStoryEvent(event: StoryEvent, type: string) {
    this.editAction.onStoryEvent(event, type);
  }

  onAction(actionInfo: IEditActionInfo) {
    if (this._currentComponent) {
      // 优先上一次的编辑组件
      if (this._currentComponent.checkAction(actionInfo)) {
        return;
      }
    }
    for (let i = 0; i < this._componentList.length; i++) {
      const cpt = this._componentList[i];
      if (cpt.checkAction(actionInfo)) {
        this.stopEdit();
        this._currentComponent = cpt;
        return;
      }
    }
  }

  startEdit(msg: IEditMessage) {
    this.emitter.emit('startEdit', msg);
  }

  triggerEditWithEvent(event: StoryEvent) {}

  triggerEditWithComponent(type: string, actionInfo: IEditActionInfo) {}

  stopEdit() {
    this._currentComponent?.editEnd();
    this._currentComponent = null;
  }

  release() {
    this.story.canvas?.getStage?.().removeEventListener('*', this.onStoryEvent as any);
  }
}
