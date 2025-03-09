import { Datum } from '@visactor/vchart/src/typings';
import type { ISequenceScatterSpec } from './interface';
import { CommonChartSpecTransformer } from '@visactor/vchart';

const DATA_KEY = 'dataKey';

export class SequenceScatterChartSpecTransformer extends CommonChartSpecTransformer<any> {
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    const dataSpecs = processSequenceData(spec as unknown as ISequenceScatterSpec);

    spec.type = 'common';
    spec.dataKey = DATA_KEY;
    spec.data = dataSpecs[0].data;

    spec.width = 300;
    spec.height = 300;
    spec.autoFit = false;

    spec.series = [
      {
        type: 'scatter',
        xField: spec.xField,
        yField: spec.yField
      }
    ];

    if (spec.player) {
      spec.player = {
        ...spec.player,
        specs: dataSpecs
      };
      spec.animationAppear = {
        duration: spec.player?.duration ?? 2000,
        easing: 'linear'
      };

      spec.animationUpdate = {
        duration: spec.player?.duration ?? 2000,
        easing: 'linear'
      };
    }

    spec.axes = [
      {
        orient: 'left',
        type: 'linear'
      },
      {
        orient: 'bottom',
        label: { visible: true },
        type: 'linear'
      }
    ];

    spec.customMark = [
      // 背景图像
      {
        type: 'image',
        dataIndex: 2, // 指向背景数据
        style: {
          x: 0,
          y: 0,
          width: 300,
          height: 300,
          image: (datum: Datum) => datum.imageData,
          zIndex: -1 // 确保在散点下方
        }
      },
      {
        type: 'text',
        dataIndex: 1,
        style: {
          text: (datum: Datum) => datum['inter'],
          x: 50,
          y: () => 10,
          textBaseline: 'top',
          textAlign: 'left',
          fontSize: 100,
          fontWeight: 'bolder',
          fill: 'black',
          fillOpacity: 0.2,
          ...spec.infoLabel?.style
        }
      }
      // TODO: draw polygon according to data
      // {
      //   type: 'polygon',
      //   dataIndex: 1,
      //   style: {
      //     points: (datum: Datum) => {
      //       return [
      //         {
      //           x: ,
      //           y:
      //         },
      //         //....
      //       ];
      //     },
      //   }
      // }
    ];

    spec.tooltip = {
      visible: false
    };

    super.transformSpec(spec);
  }
}

export function processSequenceData(spec: ISequenceScatterSpec) {
  const result: any[] = [];
  const BACKGROUND_KEY = 'background';
  Object.keys(spec.data).forEach(inter => {
    let backgroundData = null;
    if (spec.backgroundColors && spec.backgroundColors[inter]) {
      // 创建背景图像数据
      const imageData = createImageDataFromColorMatrix(spec.backgroundColors[inter]);
      backgroundData = { imageData };
    }
    result.push({
      data: [
        {
          id: 'nodes',
          values: spec.data[inter].map((d, i) => {
            return { ...d, [DATA_KEY]: i };
          })
        },
        // TODO: edges data
        // {
        //   id: 'edges',
        //   values: [....]
        // },
        {
          id: 'inter',
          values: [
            {
              inter
            }
          ]
        },
        {
          id: BACKGROUND_KEY,
          values: backgroundData ? [backgroundData] : []
        }
      ]
    });
  });
  return result;
}

// 将RGB三元组数组转换为Canvas可用的imageData
function createImageDataFromColorMatrix(colorMatrix: any[][]): string | null {
  // 浏览器环境检查
  if (typeof document === 'undefined') {
    return null; // 非浏览器环境下返回null
  }

  // 创建Canvas离屏渲染
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // 创建imageData
  const imageData = ctx.createImageData(300, 300);

  // 填充像素数据
  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      const rgb = colorMatrix[y]?.[x] || [0, 0, 0];
      const pixelIndex = (y * 300 + x) * 4;

      // 转换0-1范围到0-255
      imageData.data[pixelIndex] = Math.round(rgb[0] * 255); // R
      imageData.data[pixelIndex + 1] = Math.round(rgb[1] * 255); // G
      imageData.data[pixelIndex + 2] = Math.round(rgb[2] * 255); // B
      imageData.data[pixelIndex + 3] = 255; // A (完全不透明)
    }
  }

  // 将imageData绘制到canvas然后返回dataURL
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
