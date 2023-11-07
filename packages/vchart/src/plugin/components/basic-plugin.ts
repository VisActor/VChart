import type { IComponentPlugin, IComponentPluginService } from './interface';
import { createID } from '../../util/id';

export class BasicComponentPlugin implements IComponentPlugin {
  readonly id: number;
  readonly name: string;
  protected service?: IComponentPluginService;

  static Name: string;

  constructor(name: string = BasicComponentPlugin.Name) {
    this.id = createID();
    this.name = `${name}_${this.id}`;
  }

  onAdd(service: IComponentPluginService): void {
    this.service = service;
  }
}
