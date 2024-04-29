import type { IActionContext } from '..';
import type { IFlickerAction } from '../common';
import type { IBrightenAction } from '../common/Brighten';
import type { IDarkenAction } from '../common/Darken';
import type { IMoveToAction } from '../common/MoveTo';
import type { IGraphicAppearAction } from './appear';

export type GraphicAction = IFlickerAction | IBrightenAction | IDarkenAction | IMoveToAction | IGraphicAppearAction;

export type GraphicActonNode = GraphicAction & IActionContext;
