import {
  BaseChart,
  VChart,
  registerArcMark,
  registerCommonChart,
  registerCustomMark,
  registerGroupMark,
  registerImageMark,
  registerLineMark,
  registerPathMark,
  registerRectMark,
  registerTextMark
} from '@visactor/vchart';
import type { IStorylineSpec } from './interface';
import { StorylineChartSpecTransformer } from './storyline-transformer';

export class StorylineChart<T extends IStorylineSpec = IStorylineSpec> extends BaseChart<
  Omit<T, 'data' | 'title' | 'layout'>
> {
  type = 'storyline';
  static type = 'storyline';
  static readonly view: string = 'singleDefault';

  declare _spec: T;

  static readonly transformerConstructor = StorylineChartSpecTransformer;
  readonly transformerConstructor = StorylineChartSpecTransformer;

  init() {
    if (!this.isValid()) {
      return;
    }
    super.init();
  }

  protected isValid() {
    const { data } = this._spec;
    if (!Array.isArray(data)) {
      this._option.onError?.('Data is required and should be an array for storyline chart');
      return false;
    }
    return true;
  }
}

export const registerStorylineChart = (option?: { VChart?: typeof VChart }) => {
  registerCommonChart();
  registerCustomMark();
  registerGroupMark();
  registerRectMark();
  registerTextMark();
  registerImageMark();
  registerLineMark();
  registerPathMark();
  registerArcMark();

  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([StorylineChart]);
  }
};
