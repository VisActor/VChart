import type { IWordCloudSeriesTheme, IWordCloud3dSeriesTheme } from '../../../../series/word-cloud/interface';

const getWordCloudTheme = (): IWordCloudSeriesTheme | IWordCloud3dSeriesTheme => {
  return {
    word: {
      padding: 1,
      style: {
        textAlign: 'center',
        textBaseline: 'alphabetic'
      }
    }
  };
};

export const wordCloud: IWordCloudSeriesTheme = getWordCloudTheme();
export const wordCloud3d: IWordCloud3dSeriesTheme = getWordCloudTheme();
