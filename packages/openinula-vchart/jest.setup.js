global.__DEV__ = true;
global.__VERSION__ = 'test';

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.map(arg => (arg instanceof Error ? arg.stack || arg.message : String(arg))).join(' ');
  if (message.includes('HTMLCanvasElement.prototype.getContext')) {
    return;
  }
  originalConsoleError.apply(console, args);
};
