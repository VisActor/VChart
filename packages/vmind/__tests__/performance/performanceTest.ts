import VMind from '../../src/index';
import { Model } from '../../src/typings';

describe('VMind', () => {
  it('performance', () => {
    console.info('---------------VMind performance test---------------');
    const CHART_GENERATION_AVERAGE_TIME = 10000;
    const QPM_LIMIT = 10; //qpm limit of your llm service
    const TOKEN_LIMIT = 20000; //token limit of your llm service

    const skylarkKey = process.env.VITE_SKYLARK_KEY;
    const skylarkURL = process.env.VITE_SKYLARK_JEST_URL;
    if (skylarkKey && skylarkURL) {
      console.log(skylarkKey, skylarkURL);
      const vmind = new VMind({
        url: skylarkURL,
        model: Model.SKYLARK,
        headers: {
          'api-key': skylarkKey
        }
      });
    }

    expect(1).toBeLessThan(CHART_GENERATION_AVERAGE_TIME);
  });
});
