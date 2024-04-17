import { AddAction } from './Add';
import { UpdateStyleAction } from './UpdateStyle';
import { UpdateAction } from './Update';

export type ActionNode = AddAction | UpdateStyleAction | UpdateAction;
