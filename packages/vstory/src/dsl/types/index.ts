import { AddAction, AddPatchAction } from './Add';
import { UpdateStyleAction } from './UpdateStyle';
import { UpdateAction } from './Update';
import { MarkPointAction, MarkPointFlickerAction } from './MarkPoint';

export type ActionNode =
  | AddAction
  | AddPatchAction
  | UpdateStyleAction
  | UpdateAction
  | MarkPointAction
  | MarkPointFlickerAction;
