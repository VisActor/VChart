import { PLAYER_PREFIX } from '../../constant';
import { createElement } from '../../utils';
import type { IActorActionContext } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ActorType } from '../interface';
import { DomActor } from './base';
import type { IDomVideoActorConfig } from './inderface';

export class DomVideoActor extends DomActor<HTMLDivElement> {
  type = ActorType.domVideo;
  tag: keyof HTMLElementTagNameMap = 'video';

  declare config: IDomVideoActorConfig;

  getDefaultStyle(): Partial<CSSStyleDeclaration> {
    return {
      ...super.getDefaultStyle(),
      border: 'none',
    };
  }

  protected _createElement(context: IActorActionContext, classList?: string[], id?: string) {
    const element = createElement(
      this.tag,
      [...(classList ?? []), `${PLAYER_PREFIX}-element-${context.action.id}`],
      {
        ...this.getDefaultStyle(),
        ...this.config.defaultStyle,
      },
      {
        [PLAYER_PREFIX + '-actor-name']: this.name,
      },
      id,
    ) as HTMLVideoElement;
    element.autoplay = true;
    element.controls = false;
    element.muted = true;
    element.src = this.config.src;
    return element;
  }
}
