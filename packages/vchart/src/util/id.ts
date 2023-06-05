let ChartSpaceId = 0;
const ChartSpaceIdMax = 9999999;

export function createID(): number {
  ChartSpaceId >= ChartSpaceIdMax && (ChartSpaceId = 0);
  return ChartSpaceId++;
}

export function resetID() {
  ChartSpaceId = 0;
}
