import React, { useEffect, useState } from 'react';
import { IAction, IRoleLink, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import { IComponentRoleSpec } from '../../../src/story/character';
import { StoryGraphicType } from '../../../src/dsl/constant';

const duration = 1000;
const width = 200;
const height = 100;

const createRoleAndAction = (type: string, effects: string[], row = 0, col = 0, options = {}) => {
  const appearEffect = effects[0];
  const id = `${type}-${appearEffect}-${row}`;
  const role: IComponentRoleSpec = {
    type,
    id,
    zIndex: 0,
    position: {
      top: 40 + row * 100,
      left: 50 + col * width,
      width,
      height
    },
    options: {
      graphic: {
        fill: 'rgb(13,201,209)'
      },
      text: {
        text: appearEffect
      },
      angle: 0,
      shapePoints: [],
      ...options
    }
  };
  const actions: IAction[] = effects.map((effect, effectIndex) => {
    if (effectIndex === 0) {
      return {
        startTime: 50 + row * duration,
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
        startTime: 50 + row * duration + effectIndex * (duration + 100),
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
      startTime: duration + row * duration,
      duration,
      action: 'appear',
      payload: {
        style: {},
        animation: {
          duration,
          easing: 'linear',
          effect: 'moveIn'
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
    // rect
    // 数组第一项是 appear 效果，第二项是强调效果
    const roles: IStorySpec['roles'] = [];
    const roleActions: IRoleLink[] = [];
    let col = 0;
    // rect
    {
      const effects = [
        ['wipeIn'],
        ['fadeIn', 'brighten'],
        ['grow'],
        ['moveIn'],
        ['fadeIn', 'flicker', 'darken'] //
      ];
      effects.forEach((effect, index) => {
        const { role, roleAction } = createRoleAndAction(StoryGraphicType.RECT, effect, index);
        roles.push(role);
        roleActions.push(roleAction);
      });
      ++col;
    }

    // text
    {
      const effects = [
        ['fadeIn'],
        // ['flicker'], // TODO: 直接 flicker 是有问题的
        ['typewriter', 'flicker'] //
      ];
      effects.forEach((effect, index) => {
        const { role, roleAction } = createRoleAndAction(StoryGraphicType.TEXT, effect, index, col, {
          graphic: { fontSize: 24, text: effect[0], dx: width / 2, dy: height / 2 }
        });
        roles.push(role);
        roleActions.push(roleAction);
      });
      ++col;
    }
    const tempSpec: IStorySpec = {
      roles,
      acts: [
        {
          id: 'default-chapter',
          scenes: [roleActions]
        }
      ]
    };

    console.log(tempSpec);

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
