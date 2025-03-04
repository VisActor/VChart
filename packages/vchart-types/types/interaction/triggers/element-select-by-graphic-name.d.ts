import type { IMarkGraphic } from '../../mark/interface/common';
import { ElementSelect } from './element-select';
export declare class ElementSelectByGraphicName extends ElementSelect {
    static type: string;
    type: string;
    start(markGraphic: IMarkGraphic): void;
}
export declare const registerElementSelectByGraphicName: () => void;
