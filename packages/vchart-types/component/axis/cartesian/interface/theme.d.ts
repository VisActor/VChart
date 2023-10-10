import type { ILayoutPaddingSpec, ILayoutNumber } from '../../../../model/interface';
import type { ITick, IGrid } from '../../interface';
import type { ICartesianDomainLine, ICartesianLabel, ICartesianTitle } from './common';
import type { ICartesianAxisCommonSpec } from './spec';
export interface ICartesianAxisCommonTheme {
  grid?: IGrid;
  subGrid?: IGrid;
  domainLine?: ICartesianDomainLine;
  label?: ICartesianLabel;
  title?: ICartesianTitle;
  tick?: ITick;
  subTick?: ITick;
  background?: ICartesianAxisCommonSpec['background'];
  padding?: ILayoutPaddingSpec;
  width?: ILayoutNumber;
  maxWidth?: ILayoutNumber;
  minWidth?: ILayoutNumber;
  height?: ILayoutNumber;
  maxHeight?: ILayoutNumber;
  minHeight?: ILayoutNumber;
}
