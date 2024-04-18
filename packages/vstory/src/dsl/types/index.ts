import { AddAction, AddPatchAction } from './Add';
import { UpdateStyleAction } from './UpdateStyle';
import { UpdateAction } from './Update';
import { FlickerAction } from './Flicker';
import { CreateMarkPointAction } from './CreateComponent';

export interface ActionContext {
  elementType: string;
  elementId: number;
  callback?: () => void;
}

export type ActionNode = (
  | AddAction
  | AddPatchAction
  | UpdateStyleAction
  | UpdateAction
  | CreateMarkPointAction
  | CommonActionNode
) &
  ActionContext;

export type CommonActionNode = FlickerAction;

export type ComponentAction = CommonActionNode;
