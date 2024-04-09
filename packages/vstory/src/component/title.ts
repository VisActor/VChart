import { IAnimate as IVRenderAnimate, InputText } from '@visactor/vrender-core';
import { GraphicAnimate } from '../animate/animate';
import { Title } from '@visactor/vrender-components';
import { IContext } from '../interface/type';
import { Action } from '../scene/action';
import { TaskCb } from '../task';

export function textWriter(title: Title, duration: number) {
  const _textWriter = new TextWriter(title, duration);
  return new Action(_textWriter, (_textWriter, context) => {
    if (context && context.stage) {
      context.stage.defaultLayer.add(_textWriter.getEntity());
      _textWriter.run();
    }
  });
}

export class TextWriter extends GraphicAnimate {
  protected _title: Title;
  getEntity() {
    return this._title;
  }
  protected _duration: number;

  protected _mainAnimate: IVRenderAnimate;
  protected _subAnimate: IVRenderAnimate;

  constructor(title: Title, duration: number) {
    super(null);
    this._title = title;
    this._duration = duration;
  }

  run(context: Partial<IContext>): void {
    if (this._title && this._duration > 0) {
      // @ts-ignore
      const { _subtitle: subtitle, _mainTitle: mainTitle } = this._title;
      if (mainTitle) {
        this._mainAnimate = mainTitle.animate().play(
          new InputText(
            { text: '' },
            {
              text: mainTitle.attribute.text[0]
            },
            this._duration,
            'linear'
          )
        );
      }
      if (subtitle) {
        this._subAnimate = subtitle.animate().play(
          new InputText(
            { text: '' },
            {
              text: subtitle.attribute.text
            },
            this._duration,
            'linear'
          )
        );
      }
    }
  }

  runCb(cb: TaskCb): void {
    if (this._mainAnimate) {
      this._mainAnimate.runCb(cb);
    }

    if (this._subAnimate) {
      this._subAnimate.runCb(cb);
    }
  }
}

export { Title } from '@visactor/vrender-components';
