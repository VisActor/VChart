test('预期失败：验证失败后下一文件仍会完整执行', () => {
  globalThis[Symbol.for('vchart.test.electron-isolation')] = 'failed';
  expect(1).toBe(2);
});
