import { DimensionHoverEvent, DimensionEventEnum, DimensionClickEvent } from './dimension';

export * from './dimension';

export const ComposedEventMapper = {
  [DimensionEventEnum.dimensionHover]: DimensionHoverEvent,
  [DimensionEventEnum.dimensionClick]: DimensionClickEvent
};
