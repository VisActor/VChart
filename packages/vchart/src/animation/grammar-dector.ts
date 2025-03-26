/**
 * 检测语法变化，注册策略针对不同的语法变化，创建不同的planner去依次执行
 * 可以注册的策略有：
 * 1. 如果有数据删除，分为两个planner，先走exit动画，再走其他的动画
 * 2. 如果有数据添加，分为两个planner，先走其他的动画，最后走Enter动画
 * 3. 如果是一般的更新，那么正常走update，也就是一个planner就行
 * 4. 如果有数据维度变化
 *    -   1. 堆积变分组，先执行band方向的插值，在进行value方向的插值
 *    -   2. 分组变堆积，先执行value方向的插值，再执行band方向的插值
 */
import { AnimationPlanner } from './animation-planner';
import type { IMarkGraphic } from '../mark/interface';
import { DiffState } from '../mark/interface/enum';
import type { IAnimationConfig } from './interface';
import type { BaseMark } from '../mark';

export interface IDetectionResult {
  hasExit: boolean;
  hasUpdate: boolean;
  hasEnter: boolean;
  hasAppear: boolean;
  exitGraphics: IMarkGraphic[];
  updateGraphics: IMarkGraphic[];
  enterGraphics: IMarkGraphic[];
  appearGraphics: IMarkGraphic[];
}

export class GrammarDetector {
  private mark: BaseMark<any>;
  // mark.type: 'rect' | 'line' | 'area' ...
  // mark.model.direction: 'horizontal' | 'vertical'

  constructor(mark: BaseMark<any>) {
    this.mark = mark;
  }
  /**
   * 检测图形的变化类型
   * @param graphics 要分析的图形列表
   * @param defaultState 可选的默认状态，用于覆盖图形的状态
   * @returns 一个检测结果，指示需要哪些类型的动画
   */
  detect(graphics: IMarkGraphic[], graphicMap: Map<string, IMarkGraphic>, defaultState?: string): IDetectionResult {
    const exitGraphics: IMarkGraphic[] = [];
    const updateGraphics: IMarkGraphic[] = [];
    const enterGraphics: IMarkGraphic[] = [];
    const appearGraphics: IMarkGraphic[] = [];

    graphics.forEach(g => {
      const state = defaultState ?? g.context.animationState;
      switch (state) {
        case 'update':
          updateGraphics.push(g);
          break;
        case 'enter':
          enterGraphics.push(g);
          break;
        case 'appear':
          appearGraphics.push(g);
          break;
        default:
          // 对于未知状态，根据diffState确定
          if (g.context.diffState === DiffState.exit) {
            exitGraphics.push(g);
          } else if (g.context.diffState === DiffState.enter) {
            enterGraphics.push(g);
          } else {
            updateGraphics.push(g);
          }
      }
    });

    if (graphicMap.size > graphics.length) {
      graphicMap.forEach((g, key) => {
        if (g.context.diffState === DiffState.exit && !g.isExiting) {
          exitGraphics.push(g);
        }
      });
    }

    return {
      hasExit: exitGraphics.length > 0,
      hasUpdate: updateGraphics.length > 0,
      hasEnter: enterGraphics.length > 0,
      hasAppear: appearGraphics.length > 0,
      exitGraphics,
      updateGraphics,
      enterGraphics,
      appearGraphics
    };
  }

  /**
   * 根据检测到的变化创建动画Planner
   * @param result 检测结果
   * @param animationConfig 动画配置
   * @returns 一个动画Planner数组，按顺序执行
   */
  createPlanners(result: IDetectionResult, animationConfig: Record<string, IAnimationConfig[]>): AnimationPlanner[] {
    const planners: AnimationPlanner[] = [];

    // 按顺序创建Planner
    if (result.hasExit && animationConfig.exit) {
      planners.push(new AnimationPlanner('exit', result.exitGraphics, animationConfig.exit));
    }

    if (result.hasUpdate && animationConfig.update) {
      planners.push(new AnimationPlanner('update', result.updateGraphics, animationConfig.update));
    }

    if (result.hasEnter && animationConfig.enter) {
      planners.push(new AnimationPlanner('enter', result.enterGraphics, animationConfig.enter));
    }

    if (result.hasAppear && animationConfig.appear) {
      planners.push(new AnimationPlanner('appear', result.appearGraphics, animationConfig.appear));
    }

    return planners;
  }
}
