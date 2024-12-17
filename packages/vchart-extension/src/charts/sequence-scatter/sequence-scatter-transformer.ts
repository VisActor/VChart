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
  Object.keys(spec.data).forEach(inter => {
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
        }
      ]
    });
  });
  return result;
}
