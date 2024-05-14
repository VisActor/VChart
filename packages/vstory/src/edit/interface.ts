import { Edit } from './edit';
import { ICharacter, ICharacterPickInfo } from './../story/character/runtime-interface';
export enum EditActionEnum {
  singleSelection = 'singleSelect', // 单选
  multipleSelection = 'multipleSelect' // 多选
}

export interface IEditSelectionDetailChart extends ICharacterPickInfo {
  model: string;
  mark: any;
  datum: any;
}

export type IEditSelectionDetailComponent = ICharacterPickInfo;

export interface IEditSelectionInfo extends IEditActionInfoBase {
  characterId?: string | string[];
  character?: ICharacter;
  detail: IEditSelectionDetailChart | IEditSelectionDetailComponent;
}

export interface IEditActionInfoBase {
  type: keyof typeof EditActionEnum | string;
  event: Event;
}

export type IEditActionInfo = IEditActionInfoBase | IEditSelectionInfo;

export type ContinuousActionType = 'boxSelection' | 'layerZoom' | 'layerMove';

export interface IEditComponent {
  readonly level: number;

  // 是否 开始/继续 编辑 返回false的话，会导致当前编辑结束
  checkAction(actionInfo: IEditActionInfo): boolean;

  // 编辑结束
  editEnd(): void;
}

export interface IEditComponentConstructor {
  new (edit: Edit): IEditComponent;
}

export interface IEditMessage {
  type: string; // 编辑组件类型，
  actionInfo: IEditActionInfo;
  updateCharacter: (updateParams: any) => void;
}
