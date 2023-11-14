import type { ILayoutItem } from '../model/interface';
import type { Layout } from './base-layout';
export declare function layoutLeftInlineItems(items: ILayoutItem[], layout: Layout, limitHeight: number): void;
export declare function layoutRightInlineItems(items: ILayoutItem[], layout: Layout, limitHeight: number): void;
export declare function layoutTopInlineItems(items: ILayoutItem[], layout: Layout, limitWidth: number): void;
export declare function layoutBottomInlineItems(items: ILayoutItem[], layout: Layout, limitWidth: number): void;
