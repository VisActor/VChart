import { Compiler } from '../../../src/compile/compiler';
import { vglobal } from '../../../src/vrender-bridge';

jest.mock('../../../src/vrender-bridge', () => ({
  ...jest.requireActual<typeof import('../../../src/vrender-bridge')>('../../../src/vrender-bridge'),
  vglobal: {
    getSpecifiedRequestAnimationFrame: jest.fn(),
    getSpecifiedCancelAnimationFrame: jest.fn()
  }
}));

it('cancels queued progressive work and releases its layout before removing graphics', () => {
  const pending = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  const request = (vglobal.getSpecifiedRequestAnimationFrame as jest.Mock).mockReturnValue(
    (callback: FrameRequestCallback) => {
      pending.set(++frameId, callback);
      return frameId;
    }
  );
  const cancel = (vglobal.getSpecifiedCancelAnimationFrame as jest.Mock).mockReturnValue((id: number) => {
    pending.delete(id);
  });
  const renderProgressive = jest.fn();
  const clearProgressive = jest.fn();
  const compiler = new Compiler(null, {} as any);
  const mark = { isDoingProgressive: () => true, renderProgressive, clearProgressive };
  try {
    // 确定性地排入下一帧，模拟增量绘制尚未结束时销毁图表。
    (compiler as any)._progressiveMarks = [mark];
    (compiler as any).doPreProgressive();
    expect(pending.size).toBe(1);
    const removeGraphics = jest.spyOn(compiler, 'releaseGrammar').mockImplementation(() => {
      expect(clearProgressive).toHaveBeenCalledTimes(1);
    });
    compiler.release();
    expect(removeGraphics).toHaveBeenCalledWith(true);
    expect(pending.size).toBe(0);
    for (const callback of pending.values()) {
      callback(0);
    }
    expect(renderProgressive).not.toHaveBeenCalled();
  } finally {
    pending.clear();
    request.mockRestore();
    cancel.mockRestore();
  }
});
