import { barLabel, pieLabel } from '../../../../src/component/label/util';

const createLabelInfo = (labelSpec: Record<string, unknown>) =>
  ({
    labelSpec,
    series: {
      direction: 'vertical',
      getMeasureField: () => ['value'],
      getYAxisHelper: (): undefined => undefined
    }
  } as any);

describe('label util', () => {
  describe('barLabel', () => {
    it('preserves disabled smart invert for inside labels', () => {
      const result = barLabel(createLabelInfo({ position: 'inside', smartInvert: false }));

      expect(result.smartInvert).toBe(false);
    });

    it('preserves explicit smart invert options for inside labels', () => {
      const smartInvert = {
        fillStrategy: 'invertBase',
        strokeStrategy: 'similarBase'
      };
      const result = barLabel(createLabelInfo({ position: 'inside', smartInvert }));

      expect(result.smartInvert).toBe(smartInvert);
    });

    it('enables smart invert by default for inside labels', () => {
      const result = barLabel(createLabelInfo({ position: 'inside' }));

      expect(result.smartInvert).toBe(true);
    });
  });

  describe('pieLabel', () => {
    it('preserves disabled smart invert for inside labels', () => {
      const result = pieLabel(createLabelInfo({ position: 'inside', smartInvert: false }));

      expect(result.smartInvert).toBe(false);
    });
  });
});
