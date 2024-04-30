import type { ChartAction, ChartActionNode } from './chart/index';
import type { IAnimationParams } from './common';
import type { GraphicAction, GraphicActonNode } from './graphic';

export interface IActionContext {
  elementType?: string;
  elementId?: number;
  callback?: (...args: any[]) => void;
}

export interface IActionPayload {
  animation?: IAnimationParams;
}

export interface IAction {
  action: string;
  payload: Record<string, any>;
}

export type Action = ChartAction | GraphicAction;

export type ActionNode = ChartActionNode | GraphicActonNode;

export * from './common';
export * from './chart';
export * from './graphic';
