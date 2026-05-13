import type { IGraphic, INode } from '@visactor/vrender-core';
import type { ComponentExitReleasable } from '@visactor/vrender-components';

type ExitReleasableGraphic = IGraphic & ComponentExitReleasable;

type ReleaseVRenderComponentOptions = {
  enableExitAnimation?: boolean;
  removeFromParent?: boolean;
  onComplete?: () => void;
};

export const releaseVRenderComponentSync = (component: IGraphic, removeFromParent: boolean = true) => {
  component.release?.(true);

  if (removeFromParent) {
    component.parent?.removeChild(component as unknown as INode);
  }
};

export const releaseVRenderComponent = (component: IGraphic, options: ReleaseVRenderComponentOptions = {}): boolean => {
  const { enableExitAnimation = true, removeFromParent = true, onComplete } = options;
  const releasedWithExit =
    enableExitAnimation &&
    (component as ExitReleasableGraphic).releaseWithExitAnimation?.({
      removeFromParent,
      onComplete
    });

  if (releasedWithExit) {
    return true;
  }

  releaseVRenderComponentSync(component, removeFromParent);
  return false;
};
