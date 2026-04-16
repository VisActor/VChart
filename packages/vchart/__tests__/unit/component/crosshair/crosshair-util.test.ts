import { getDatumByValue } from '../../../../src/component/crosshair/utils/common';
import { layoutCrosshair } from '../../../../src/component/crosshair/utils/cartesian';
import type { CrossHairStateItem } from '../../../../src/component/crosshair/interface';

describe('crosshair utils', () => {
  describe('getDatumByValue', () => {
    const data = [
      { start: 0, end: 0.2, name: 'A' },
      { start: 0.2, end: 0.6, name: 'B' },
      { start: 0.6, end: 1, name: 'C' }
    ];

    test('should find datum when startField < endField (histogram-like)', () => {
      const result = getDatumByValue(data, 0.1, 'start', 'end');
      expect(result).toEqual(data[0]);

      const result2 = getDatumByValue(data, 0.4, 'start', 'end');
      expect(result2).toEqual(data[1]);

      const result3 = getDatumByValue(data, 0.8, 'start', 'end');
      expect(result3).toEqual(data[2]);
    });

    test('should find datum when startField > endField (mosaic-like reversed fields)', () => {
      const reversedData = [
        { catEnd: 0.2, catStart: 0, name: 'A' },
        { catEnd: 0.6, catStart: 0.2, name: 'B' },
        { catEnd: 1, catStart: 0.6, name: 'C' }
      ];
      // In mosaic, fieldX[0] = catEnd (larger), fieldX2 = catStart (smaller)
      // so startField=catEnd, endField=catStart → startValue > endValue
      const result = getDatumByValue(reversedData, 0.1, 'catEnd', 'catStart');
      expect(result).toEqual(reversedData[0]);

      const result2 = getDatumByValue(reversedData, 0.4, 'catEnd', 'catStart');
      expect(result2).toEqual(reversedData[1]);

      const result3 = getDatumByValue(reversedData, 0.8, 'catEnd', 'catStart');
      expect(result3).toEqual(reversedData[2]);
    });

    test('should return null when value is out of range', () => {
      const result = getDatumByValue(data, 1.5, 'start', 'end');
      expect(result).toBeNull();

      const result2 = getDatumByValue(data, -0.1, 'start', 'end');
      expect(result2).toBeNull();
    });

    test('should return null for empty data', () => {
      const result = getDatumByValue([], 0.5, 'start', 'end');
      expect(result).toBeNull();
    });

    test('should handle single field (no endField)', () => {
      const pointData = [{ x: 5 }, { x: 10 }, { x: 15 }];
      const result = getDatumByValue(pointData, 10, 'x');
      expect(result).toEqual(pointData[1]);
    });

    test('should match boundary values', () => {
      const result = getDatumByValue(data, 0, 'start', 'end');
      expect(result).toEqual(data[0]);

      const result2 = getDatumByValue(data, 0.2, 'start', 'end');
      // 0.2 matches both data[0] (end) and data[1] (start), returns first match
      expect(result2).toEqual(data[0]);
    });
  });

  describe('layoutCrosshair for rect type', () => {
    test('should compute correct rect position when coord is at left edge (normal order)', () => {
      const stateItem: CrossHairStateItem = {
        coordKey: 'x',
        anotherAxisKey: 'y',
        currentValue: new Map(),
        bandSize: 100,
        offsetSize: 0,
        cacheInfo: {
          coord: 50,
          coordRange: [0, 500],
          sizeRange: [0, 300],
          visible: true,
          labels: {},
          labelsTextStyle: {},
          axis: { getLayoutRect: () => ({ width: 500, height: 300 }) } as any
        },
        attributes: {
          visible: true,
          type: 'rect'
        }
      };

      const result = layoutCrosshair(stateItem);
      expect(result).toBeDefined();
      expect(result.visible).toBe(true);
      // bandSize=100, getRectSize returns [0, 100] for bandSize > 0
      // start.x = max(50 + 0, 0) = 50, end.x = min(50 + 100, 500) = 150
      expect(result.start.x).toBe(50);
      expect(result.end.x).toBe(150);
      expect(result.start.y).toBe(0);
      expect(result.end.y).toBe(300);
    });

    test('should compute correct rect position for mosaic-like scenario', () => {
      // In mosaic after the fix, coord = Math.min(posStart, posEnd)
      // so coord is always at the left edge of the band
      const stateItem: CrossHairStateItem = {
        coordKey: 'x',
        anotherAxisKey: 'y',
        currentValue: new Map(),
        bandSize: 200,
        offsetSize: 0,
        cacheInfo: {
          coord: 100,
          coordRange: [0, 500],
          sizeRange: [0, 300],
          visible: true,
          labels: {},
          labelsTextStyle: {},
          axis: { getLayoutRect: () => ({ width: 500, height: 300 }) } as any
        },
        attributes: {
          visible: true,
          type: 'rect'
        }
      };

      const result = layoutCrosshair(stateItem);
      expect(result).toBeDefined();
      // bandSize=200, getRectSize returns [0, 200]
      // start.x = max(100 + 0, 0) = 100, end.x = min(100 + 200, 500) = 300
      expect(result.start.x).toBe(100);
      expect(result.end.x).toBe(300);
    });

    test('should clamp rect to coordRange', () => {
      const stateItem: CrossHairStateItem = {
        coordKey: 'x',
        anotherAxisKey: 'y',
        currentValue: new Map(),
        bandSize: 100,
        offsetSize: 0,
        cacheInfo: {
          coord: 450,
          coordRange: [0, 500],
          sizeRange: [0, 300],
          visible: true,
          labels: {},
          labelsTextStyle: {},
          axis: { getLayoutRect: () => ({ width: 500, height: 300 }) } as any
        },
        attributes: {
          visible: true,
          type: 'rect'
        }
      };

      const result = layoutCrosshair(stateItem);
      // end.x = min(450 + 100, 500) = 500, clamped
      expect(result.end.x).toBe(500);
    });
  });
});
