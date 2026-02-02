import type { IWordCloudSeriesTheme } from '../../../../series/word-cloud/interface';

const getWordCloudTheme = (): IWordCloudSeriesTheme => {
  return {
    word: {
      padding: 1,
      style: {
        textAlign: 'center',
        textBaseline: 'alphabetic',
        scaleX: 1,
        scaleY: 1
      }
    }
  };
};

export const wordCloud: IWordCloudSeriesTheme = getWordCloudTheme();
