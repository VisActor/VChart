import type { PairPlotObservation } from '../../src/plots/pair-plot/types';

export const pairObservations: PairPlotObservation[] = [0, 1, 2, 3, 4, null].map((x, i) => ({
  id: String(i),
  values: { x, y: i === 0 ? null : i }
}));

export const groupedPairObservations: PairPlotObservation[] = [
  { id: 'a0', series: 'A', values: { x: 0, y: null } },
  { id: 'a1', series: 'A', values: { x: 1, y: 1 } },
  { id: 'b2', series: 'B', values: { x: 2, y: 2 } },
  { id: 'b3', series: 'B', values: { x: 3, y: 3 } },
  { id: 'b4', series: 'B', values: { x: 4, y: 4 } },
  { id: 'c5', series: 'C', values: { x: null, y: 5 } }
];
