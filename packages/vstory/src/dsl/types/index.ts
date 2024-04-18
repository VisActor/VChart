import { AddAction, AddAction as AddPatchAction } from './Add';
import { StyleAction } from './Style';
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
  | StyleAction
  | UpdateAction
  | CreateMarkPointAction
  | CommonActionNode
) &
  ActionContext;

export type CommonActionNode = FlickerAction;

export type ComponentAction = CommonActionNode;

export * from './Style';
