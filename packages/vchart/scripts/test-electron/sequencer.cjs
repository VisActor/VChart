module.exports = class IsolationSequencer {
  sort(tests) {
    const sorted = tests.sort((a, b) => a.path.localeCompare(b.path));
    if (process.env.ELECTRON_ISOLATION_FAILURE) {
      return [sorted[2], sorted[0], sorted[1]];
    }
    return process.env.ELECTRON_ISOLATION_ORDER === 'reverse' ? sorted.reverse() : sorted;
  }
  cacheResults() {}
};
