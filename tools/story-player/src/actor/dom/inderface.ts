import type { IActorConfig } from '../interface';

export interface IDomActorConfig extends IActorConfig {
  defaultStyle?: Partial<CSSStyleDeclaration>;
  domId?: string;
}

export interface IDomImgActorConfig extends IDomActorConfig {
  src?: string;
}
