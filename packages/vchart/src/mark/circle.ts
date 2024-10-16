// import { Factory } from './../core/factory';
// import type { ICircleMarkSpec } from '../typings/visual';
// import { BaseMark } from './base/base-mark';
// import type { IMarkRaw, IMarkStyle } from './interface';
// // eslint-disable-next-line no-duplicate-imports
// import { MarkTypeEnum } from './interface/type';

// export type ICircleMark = IMarkRaw<ICircleMarkSpec>;

// export class Circle extends BaseMark<ICircleMarkSpec> implements ICircleMark {
//   static readonly type = MarkTypeEnum.circle;
//   readonly type = Circle.type;

//   protected _getDefaultStyle() {
//     const defaultStyle: IMarkStyle<ICircleMarkSpec> = {
//       ...super._getDefaultStyle(),
//       startAngle: 0,
//       endAngle: Math.PI * 2
//     };
//     return defaultStyle;
//   }
// }

// export const registerCircleMark = () => {
//   Factory.registerMark(Circle.type, Circle);
//   registerCirc();
// };
