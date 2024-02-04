import { AttributeLevel } from '../../constant';
import type { ITextMark } from '../../mark/text';
// eslint-disable-next-line no-duplicate-imports
import { registerTextMark } from '../../mark/text';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IWordCloud3dSeriesSpec } from './interface';
import type { Datum } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { BaseWordCloudSeries } from './base';
import { Factory } from '../../core/factory';
import { registerWordCloud3dAnimation } from './animation';
import { registerWordCloudTransforms } from '@visactor/vgrammar-wordcloud';
import { registerWordCloudShapeTransforms } from '@visactor/vgrammar-wordcloud-shape';

export class WordCloud3dSeries<
  T extends IWordCloud3dSeriesSpec = IWordCloud3dSeriesSpec
> extends BaseWordCloudSeries<T> {
  static readonly type: string = SeriesTypeEnum.wordCloud3d;
  type = SeriesTypeEnum.wordCloud3d;

  protected _wordCloudTransformOption() {
    return {
      ...super._wordCloudTransformOption(),
      postProjection: this._spec.postProjection ?? 'StereographicProjection',
      depth_3d: this._spec.depth_3d
    };
  }

  protected _wordCloudShapeTransformOption() {
    return {
      ...super._wordCloudShapeTransformOption(),
      postProjection: this._spec.postProjection ?? 'StereographicProjection',
      depth_3d: this._spec.depth_3d
    };
  }

  initMark(): void {
    this._wordMark = this._createMark(BaseWordCloudSeries.mark.word, {
      groupKey: this._seriesField,
      support3d: true,
      isSeriesMark: true
    }) as ITextMark;
  }

  initMarkStyle() {
    super.initMarkStyle();
    const wordMark = this._wordMark;
    if (wordMark) {
      this.setMarkStyle(
        wordMark,
        {
          z: (datum: Datum) => datum.z ?? 0
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initAnimation() {
    const padding = this._padding ?? {};
    if (this._wordMark) {
      this._wordMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('wordCloud3d')?.(() => {
            const srView = this.getCompiler().getVGrammarView();
            const width = srView.width() - padding.left || 0 - padding.right || 0;
            const height = srView.height() - padding.top || 0 - padding.bottom || 0;
            const r = Math.max(width, height) / 2;
            return {
              center: { x: r, y: r, z: this._spec.depth_3d ?? r },
              r
            };
          }),
          userAnimationConfig(SeriesMarkNameEnum.word, this._spec, this._markAttributeContext)
        )
      );
    }
  }
}

export const registerWordCloud3dSeries = () => {
  registerWordCloudTransforms();
  registerTextMark();
  registerWordCloud3dAnimation();
  Factory.registerSeries(WordCloud3dSeries.type, WordCloud3dSeries);
};

export const registerWordCloudShape3dSeries = () => {
  registerWordCloudShapeTransforms();
  registerWordCloud3dSeries();
};
