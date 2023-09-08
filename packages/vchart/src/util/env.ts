import type { RenderMode } from '../typings/spec';

export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const domDocument = isBrowser ? globalThis.document : undefined;

// Taro 会模拟实现 DOM，所以还是加上 mode 的判断
export function isTrueBrowser(mode: RenderMode): boolean {
  return (mode === 'desktop-browser' || mode === 'mobile-browser') && isBrowser;
}

export function isPcLikeMode(mode: RenderMode) {
  return mode === 'desktop-miniApp' || mode === 'desktop-browser';
}

export function isMobileLikeMode(mode: RenderMode) {
  return mode === 'miniApp' || mode === 'mobile-browser';
}

export function isMiniAppLikeMode(mode: RenderMode) {
  return mode.includes('miniApp') || mode === 'lynx';
}
