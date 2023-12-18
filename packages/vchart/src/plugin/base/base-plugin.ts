import type { IBasePlugin, IBasePluginService } from './interface';
import { createID } from '../../util/id';

export class BasePlugin<T extends IBasePluginService = IBasePluginService> implements IBasePlugin<T> {
  readonly id: number;
  readonly name: string;
  protected service?: T;

  static Name: string;

  constructor(name: string) {
    this.id = createID();
    this.name = `${name}_${this.id}`;
  }

  onAdd(service: T): void {
    this.service = service;
  }
}
