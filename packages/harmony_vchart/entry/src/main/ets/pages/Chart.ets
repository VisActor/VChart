// import { Stage } from 'vutil'
import { VChart, ISpec } from '@visactor/harmony-vchart';
// import { VisActor } from './canvas';
import { router } from '@kit.ArkUI';
import promptAction from '@ohos.promptAction';

interface IRouterParams {
  label: string,
  spec: Object
}

const params: IRouterParams = router.getParams() as IRouterParams;

@Entry
@Component
struct Chart {
  @State spec: Object = params.spec;

  build() {
    Row() {
      Column() {
        Text($r(`app.string.name_${params.label}`))
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        // Stage({ bg: 'red', h: 500 })
        VChart({
          spec: params.spec, w: 300, h: 300,
          onChartInitCb: () => {},
          onChartReadyCb: () => {}
        });

        // VisActor()
      }
      .width('100%')
    }
    .height('100%')
  }
}
