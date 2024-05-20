import animator, { AnimatorOptions, AnimatorResult } from '@ohos.animator';
import hilog from '@ohos.hilog';

class Target {
  render() {};
}
class Stage {
  render() {};
}
type IAnimate = Object;

export interface ITimeline {
  id: number;
  animateCount: number;
  addAnimate: (animate: IAnimate) => void;
  removeAnimate: (animate: IAnimate, release?: boolean) => void;
  animateHead: IAnimate | null;
  tick: (delta: number) => void;
  clear: () => void;
  pause: () => void;
  resume: () => void;
}

enum STATUS {
  INITIAL = 0, // initial表示初始状态
  RUNNING = 1, // running表示正在执行
  PAUSE = 2 // PULSE表示tick还是继续，只是不执行函数了
}

interface ITickParams { once?: boolean }

export class DefaultTicker {
  protected interval: number = NaN;
  protected status: STATUS = STATUS.INITIAL;
  protected lastFrameTime: number;
  protected tickCounts: number;
  protected timelines: ITimeline[];
  autoStop: boolean;
  animatorResult: AnimatorResult;
  stage?: Stage;

  constructor(timelines: ITimeline[] = []) {
    this.init();
    this.lastFrameTime = -1;
    this.tickCounts = 0;
    this.timelines = timelines;
    this.autoStop = true;
    let options: AnimatorOptions = {
      duration: 1000000,
      easing: 'linear',
      delay: 0,
      fill: "forwards",
      direction: "normal",
      iterations: 1,
      begin: 0,
      end: 1
    };
    this.animatorResult = animator.create(options);
    this.animatorResult.onframe = value => {
      this.handleTick();
      // hilog.info(0, "测试", 'aaaaaa');
      // TODO harmony的 requestAnimationFrame会降帧，这里直接render，不调用renderNextFrame
      if (this.stage) {
        this.stage.render();
      }
    }
  }

  bindStage(stage: Stage) {
    this.stage = stage;
  }

  init() {
    this.interval = NaN;
    this.status = STATUS.INITIAL;
  }

  addTimeline(timeline: ITimeline) {
    this.timelines.push(timeline);
  }
  remTimeline(timeline: ITimeline) {
    this.timelines = this.timelines.filter(t => t !== timeline);
  }

  setInterval(interval: number) {
    this.interval = interval;
  }
  getInterval(): number {
    return this.interval;
  }

  setFPS(fps: number): void {
    this.setInterval(1000 / fps);
  }
  getFPS(): number {
    return 1000 / this.interval;
  }
  tick(interval: number): void {
    return;
  }
  tickTo(t: number): void {
    return;
  }
  pause(): boolean {
    if (this.status === STATUS.INITIAL) {
      return false;
    }
    this.status = STATUS.PAUSE;
    this.animatorResult.pause();
    return true;
  }
  resume(): boolean {
    if (this.status === STATUS.INITIAL) {
      return false;
    }
    this.status = STATUS.RUNNING;
    this.animatorResult.play();
    return true;
  }

  ifCanStop(): boolean {
    if (this.autoStop) {
      if (!this.timelines.length) {
        return true;
      }
      if (this.timelines.reduce((a, b) => a + b.animateCount, 0) === 0) {
        return true;
      }
    }
    return false;
  }

  start(force: boolean = false): boolean {
    if (this.status === STATUS.RUNNING) {
      return false;
    }
    // 如果不需要start，那就不start
    if (!force) {
      // 暂停状态不执行
      if (this.status === STATUS.PAUSE) {
        return false;
      }
      if (!this.timelines.length) {
        return false;
      }
      if (this.timelines.reduce((a, b) => a + b.animateCount, 0) === 0) {
        return false;
      }
    }
    this.status = STATUS.RUNNING;
    this.animatorResult.play();
    return true;
  }
  stop(): void {
    // 重新设置tickHandler
    this.status = STATUS.INITIAL;
    this.animatorResult.cancel();
    this.lastFrameTime = -1;
  }

  protected handleTick = () => {
    // 尝试停止
    if (this.ifCanStop()) {
      this.stop();
      return;
    }
    this._handlerTick();
    this.animatorResult.play();
  };

  protected _handlerTick = () => {
    // 具体执行函数
    // const tickerHandler = this.tickerHandler;
    // const time = tickerHandler.getTime();
    const time = Date.now();
    // 上一帧经过的时间
    let delta = 0;
    if (this.lastFrameTime >= 0) {
      delta = time - this.lastFrameTime;
    }
    this.lastFrameTime = time;

    if (this.status !== STATUS.RUNNING) {
      return;
    }
    this.tickCounts++;

    this.timelines.forEach(t => {
      t.tick(delta);
    });
  };
}
