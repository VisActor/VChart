export const histogramObservations = [0, 1, 2, 3, 4].map(value => ({ value }));

export const histogramPoints = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ value: ((i * 73) % 997) / 997 }));
