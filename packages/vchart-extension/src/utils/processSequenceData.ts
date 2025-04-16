import { BACKGROUND_KEY, DATA_KEY } from '../charts/sequence-scatter/constant';
import { ISequenceScatterSpec } from '../charts/sequence-scatter/interface';
import { createImageDataFromColorMatrix } from './createImageData';

export function processSequenceData(spec: ISequenceScatterSpec) {
  const result: any[] = [];
  Object.keys(spec.data).forEach(inter => {
    let backgroundData = null;
    if (spec.backgroundColors && spec.backgroundColors[inter]) {
      const imageData = createImageDataFromColorMatrix(spec.backgroundColors[inter], spec);
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
