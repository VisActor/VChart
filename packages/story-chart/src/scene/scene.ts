import type { IContext, IEntity } from 'src/interface/type';

export class Scene {
  protected taskQueue: IEntity[] = [];

  protected context: IContext;

  constructor(options: any = {}) {
    this.context = {
      dom: options.dom
    };
  }

  add(entity: any) {
    this.taskQueue.push(entity);
    return this;
  }

  remove(entity: any) {
    // todo: 删除麻烦，数据结构要改
    // this.taskQueue.find(task => entity === task)
    return this;
  }

  render() {
    this.taskQueue.forEach(task => task.render(this.context));
    return this;
  }

  // play() {
  //   return this;
  // }

  // playAt() {
  //   return this;
  // }

  // pause() {
  //   return this;
  // }

  // reset() {
  //   return this;
  // }

  release() {}
}
