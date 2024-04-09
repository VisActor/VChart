import { IContext } from '../interface/type';
import { AbstractTask, TaskCb } from '../task';

export class Action extends AbstractTask {
  type = 'action';

  protected _entity: any;
  protected _action: (entity: any, context?: Partial<IContext>) => void;

  protected _isResolved = false;

  constructor(entity: any, add: (entity: any, context?: Partial<IContext>) => void) {
    super();
    this._entity = entity;
    this._action = add;
  }

  run(context?: Partial<IContext>) {
    if (this._entity && this._action) {
      this._action(this._entity, context);
      this._isResolved = true;
    }
  }

  runCb(cb: TaskCb): void {
    const intervalId = setInterval(() => {
      if (this._isResolved) {
        clearInterval(intervalId);
        cb();
      }
    });
  }
}

export class Wait extends AbstractTask {
  type = 'wait';

  protected _duration: number;

  protected _waiting = true;
  protected _playing = false;

  constructor(duration: number) {
    super();
    this._duration = duration;
  }

  run() {
    if (this._duration > 0 && !this._playing) {
      new Promise(resolve => {
        setTimeout(() => {
          this._waiting = false;
        }, this._duration);
      });
      this._playing = true;
    }
  }

  runCb(cb: TaskCb): void {
    const intervalId = setInterval(() => {
      if (!this._waiting) {
        clearInterval(intervalId);
        cb();
      }
    });
  }
}
