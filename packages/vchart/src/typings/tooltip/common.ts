import type { Datum } from '../common';

export type TooltipContentCallback = (datum: Datum) => string | undefined;
