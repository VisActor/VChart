import { version } from '../src';

describe('VChart Editor', () => {
  it('should get the correct version', () => {
    expect(version).toBeDefined();
  });
});
