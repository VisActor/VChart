import { InstanceManager } from '../../src/core/instance-manager';

// Electron 窗口会被下一套测试复用，先按公共生命周期释放本套测试遗留的图表。
afterAll(() => {
  InstanceManager.forEach(instance => instance.release());
});
