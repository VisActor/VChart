import { default as VChartConstructor } from '../../../../src/vchart-simple';
import { createCanvas, removeDom } from '../../../util/dom';

describe('poptip simple register', () => {
  let canvasDom: HTMLCanvasElement;
  let vchart: InstanceType<typeof VChartConstructor> | undefined;

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    removeDom(canvasDom);
    vchart?.release();
  });

  test('should not install poptipForText by default in simple entry', () => {
    vchart = new VChartConstructor(
      {
        type: 'area',
        data: {
          values: [
            { type: 'Nail polish', country: 'Africa', value: 4229 },
            { type: 'Nail polish', country: 'EU', value: 4376 },
            { type: 'Eyebrow pencil', country: 'Africa', value: 3932 },
            { type: 'Eyebrow pencil', country: 'EU', value: 3987 }
          ]
        },
        xField: 'type',
        yField: 'value',
        seriesField: 'country',
        legends: [{ visible: false, position: 'middle', orient: 'bottom' }],
        axes: [
          {
            type: 'band',
            orient: 'bottom',
            title: {
              visible: true,
              text: '发圣诞节付款时间饭卡手机打饭卡发圣诞节付款时间饭卡手机打饭卡发圣诞节付款时间饭卡手机打饭卡'
            }
          },
          { type: 'linear', orient: 'left', title: { visible: true } }
        ]
      } as ConstructorParameters<typeof VChartConstructor>[0],
      {
        renderCanvas: canvasDom,
        animation: false
      }
    );
    vchart.renderSync();

    expect(vchart.getStage().pluginService.findPluginsByName('poptipForText').length).toBe(0);
  });
});
