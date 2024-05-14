import { EditActionEnum, IEditComponent, IEditSelectionInfo } from './../interface';
import { Edit } from '../edit';

export class CommonEditComponent implements IEditComponent {
  readonly level = 2;
  protected _actionInfo: IEditSelectionInfo;

  constructor(public readonly edit: Edit) {}
  editEnd(): void {}
  checkAction(actionInfo: IEditSelectionInfo): boolean {
    if (actionInfo.type !== EditActionEnum.singleSelection) {
      return false;
    }
    if (!actionInfo.detail) {
      return false;
    }
    this.startEdit(actionInfo);
    return true;
  }

  startEdit(actionInfo: IEditSelectionInfo) {
    this._actionInfo = actionInfo;
    this.edit.startEdit({
      type: 'commonEdit',
      actionInfo: this._actionInfo,
      updateCharacter: (params: {}) => {
        this._actionInfo.character.updateSpec(params);
      }
    });
  }
}
