import type { IActionContext } from '..';
import type { IFlickerAction } from '../common';
import type { IBrightenAction } from '../common/brighten';
import type { IDarkenAction } from '../common/darken';
import type { IMoveToAction } from '../common/moveTo';
import type { IGraphicAppearAction } from './appear';
import type { IGraphicDisappearAction } from './disappear';

import type { IGraphicStyleAction } from './style';

export type GraphicAction =
  | IFlickerAction
  | IBrightenAction
  | IDarkenAction
  | IMoveToAction
  | IGraphicAppearAction
  | IGraphicDisappearAction
  | IGraphicStyleAction;

export type GraphicActonNode = GraphicAction & IActionContext;
