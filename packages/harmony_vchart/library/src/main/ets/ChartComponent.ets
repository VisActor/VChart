import { HTMLTouchEvent } from './event';
import { DefaultTicker } from './ticker';
import { VChart as VChartConstructor, vglobal, registerHarmonyEnv } from './vchart_dist';
import animator, { AnimatorOptions, AnimatorResult } from '@ohos.animator';
import hilog from '@ohos.hilog';

registerHarmonyEnv();
vglobal.setEnv('harmony');

interface IWH {
  width: number;
  height: number;
}

class RenderCanvas {
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  constructor(w: number, h: number, context: CanvasRenderingContext2D) {
    this.width = w;
    this.height = h;
    this.context = context;
  }
  getBoundingClientRect(): IWH {
    return {
      width: this.width,
      height: this.height
    };
  }
  getContext(p: string): CanvasRenderingContext2D {
    return this.context;
  }
}

interface IGraphic {
  setAttributes(params: Record<string, string|number>): void;
}

@Component
export struct VChart {
  private settings: RenderingContextSettings = new RenderingContextSettings(true) // 开启抗锯齿
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private w: number = 300;
  private h: number = 300;
  private fullScreen: boolean = true;
  @Prop @Watch('onSpecUpdate') private spec: Object | null = null;
  private vchart: VChartConstructor | null = null;
  @State time: string = '';

  private onChartInitCb?: (vchart: VChartConstructor) => void;
  private onChartReadyCb?: (vchart: VChartConstructor) => void;

  onSpecUpdate(propName: string) {
    if (!this.vchart) {
      return;
    }
    const spec = this.spec as Record<string, string | number>
    spec.height = this.h;
    spec.width = this.w;
    this.processDefaultTooltipShadow();
    this.vchart.updateSpecSync(this.spec);
  }

  bindChartTouchEvent = (event: TouchEvent) => {
    if (!this.vchart) {
      return;
    }
    const stage: number = this.vchart.getStage();
    console.log(vglobal, stage);
    const e = new HTMLTouchEvent(event);
    e.target = this.vchart.getCanvas();
    this.vchart.getStage().window.dispatchEvent(e);
  }

  // harmony的shadowColor不支持透明度，导致tooltip的shadow过深，这里做一下兼容（如果用户配置了shadow就不处理）
  processDefaultTooltipShadow() {

  }

  aboutToDisappear(): void {
    this.vchart && this.vchart.release();
  }

  build() {
    Column() {
      Canvas(this.context)
        .width(this.w)
        .height(this.h)
        .backgroundColor('#F5DC62')
        .onReady(() => {
          if (!this.spec) {
            return;
          }
          let date = Date.now();
          const spec = this.spec as Record<string, string | number>
          spec.width = this.w;
          spec.height = this.h;
          // 必须用类的形式
          const renderCanvas = new RenderCanvas(this.w, this.h, this.context);
          const ticker = new DefaultTicker();
          this.vchart = new VChartConstructor(this.spec, {
            renderCanvas,
            mode: 'harmony',
            dpr: 1,
            ticker: ticker,
            autoRender: true,
            disableDirtyBounds: this.fullScreen,
            beforeRender: (stage: Record<string, number>) => {
              date = Date.now();
              // stage._skipRender = -1
            },
            afterRender: () => {
              this.time = (Date.now() - date).toString()
            }
          });
          ticker.bindStage(this.vchart.getStage());
          this.onChartInitCb && this.onChartInitCb(this.vchart);
          this.vchart.renderSync();
          this.onChartReadyCb && this.onChartReadyCb(this.vchart);

          // let options: AnimatorOptions = {
          //   duration: 600000,
          //   easing: 'linear',
          //   delay: 0,
          //   fill: "forwards",
          //   direction: "normal",
          //   iterations: 1,
          //   begin: 0,
          //   end: 1
          // };
          // let animatorResult = animator.create(options);
          // let x = 100;
          // let y = 100;
          // const animate = () => {
          //   // this.context.clearRect(0, 0, 1000, 1000);
          //   x++;
          //   if (x > 300) {
          //     x = 0;
          //     y += 10;
          //   }
          //   this.context.fillStyle = 'red';
          //   this.context.fillRect(x, y, 30, 30);
          //   animatorResult.play();
          // }
          // animatorResult.onframe = (value) => {
          //   hilog.info(0, "测试", 'aaaaaa');
          //   animate();
          // }
          // animatorResult.play();
        })
        .onTouch(this.bindChartTouchEvent);
        Text(this.time)
    }
  }
}
