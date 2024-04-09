import { IContext } from './interface/type';

export type TaskCb = () => void;

export interface ITask {
  runCb: (cb: TaskCb) => void;
  run: (context?: Partial<IContext>) => void;
  next: ITask | null;
  prev: ITask | null;
}

export abstract class AbstractTask implements ITask {
  prev: ITask;
  next: ITask;

  abstract runCb(cb: TaskCb): void;
  abstract run(context?: Partial<IContext>): void;
}

export class TaskManager {
  protected _tail: ITask;
  protected _head: ITask;

  protected _context: Partial<IContext>;
  setContext(context: Partial<IContext>) {
    this._context = context;
  }

  next(task: ITask) {
    if (!this._tail) {
      this._tail = task;
      this._head = task;
      task.run(this._context);
    } else {
      this._tail.next = task;
      task.prev = this._tail;
      this._tail.runCb(() => {
        task.run(this._context);
      });
      this._tail = task;
    }
  }
}
