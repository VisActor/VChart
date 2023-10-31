import type { RenderMode } from '../typings/spec/common';
export declare function getDefaultInteractionConfigByMode(mode: RenderMode):
  | {
      hover: {
        enable: boolean;
        trigger: string;
        triggerOff: string[];
      };
      select: {
        enable: boolean;
        trigger: string;
      };
    }
  | {
      hover: {
        enable: boolean;
        trigger: string;
        triggerOff: string;
      };
      select: {
        enable: boolean;
        trigger: string;
      };
    };
