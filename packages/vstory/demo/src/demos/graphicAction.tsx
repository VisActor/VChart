import React, { useEffect, useState } from 'react';
import { IAction, IRoleLink, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import { IComponentRoleSpec } from '../../../src/story/role';
import { StoryGraphicType } from '../../../src/dsl/constant';

const duration = 500;
const createRoleAndAction = (type: string, effects: string[], index: number) => {
  const appearEffect = effects[0];
  const id = `${type}-${appearEffect}-${index}`;
  const role: IComponentRoleSpec = {
    type: StoryGraphicType.RECT,
    id,
    zIndex: 0,
    position: {
      top: 40 + index * 100,
      left: 50,
      width: 200,
      height: 100
    },
    options: {
      graphic: {
        fill: 'rgb(13,201,209)'
      },
      text: {
        text: appearEffect,
        fill: 'black'
      },
      angle: 0,
      shapePoints: []
    }
  };
  const actions: IAction[] = effects.map((effect, effectIndex) => {
    if (effectIndex === 0) {
      return {
        startTime: duration + index * duration,
        action: 'appear',
        duration,
        payload: {
          style: {},
          animation: {
            duration,
            easing: 'linear',
            effect
          } as any
        }
      };
    } else {
      return {
        startTime: duration + index * duration + effectIndex * (duration + 100),
        action: effect,
        duration,
        payload: {
          animation: {
            duration,
            easing: 'linear'
          } as any
        }
      };
    }
  });
  if (appearEffect === 'moveIn') {
    actions.push({
      startTime: duration + index * duration,
      duration,
      action: 'appear',
      payload: {
        style: {},
        animation: {
          duration,
          easing: 'linear',
          effect: 'fadeIn'
        } as any
      }
    });
  }
  const roleAction = {
    roleId: id,
    actions
  };
  return { roleAction, role };
};

export const GraphicActionDemo = () => {
  const id = 'graphicAction';
  const [story, setStory] = useState<Story>();
  const [pause, setPause] = useState<boolean>(false);
  useEffect(() => {
    // 数组第一项是 appear 效果，第二项是强调效果
    const effects = [
      ['wipeIn'],
      ['fadeIn', 'brighten'],
      ['grow'],
      ['moveIn'],
      ['fadeIn', 'flicker', 'darken'] //
    ];
    const roles: IStorySpec['roles'] = [];
    const roleActions: IRoleLink[] = [];

    effects.forEach((effect, index) => {
      const { role, roleAction } = createRoleAndAction('rect', effect, index);
      roles.push(role);
      roleActions.push(roleAction);
    });
    console.log('graphic demo:', roles, roleActions);
    // 准备一个图表
    const tempSpec: IStorySpec = {
      roles,
      acts: [
        {
          id: 'default-chapter',
          scenes: [[...roleActions]]
        }
      ]
    };
    const story = new Story(tempSpec, { dom: id });
    setStory(story);
    story.play();
  }, []);

  useEffect(() => {
    document.addEventListener('click', () => {
      if (pause) {
        story?.getPlayer().play();
      } else {
        story?.getPlayer().pause();
      }
      setPause(!pause);
    });
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '100%' }} id={id}></div>
    </div>
  );
};
