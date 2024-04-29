import React, { useEffect, useState } from 'react';
import { IRoleLink, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import { IComponentRoleSpec, IRoleSpecBase } from '../../../src/story/role';
import { StoryGraphicType } from '../../../src/dsl/constant';

const duration = 2000;

const createRole = (attributes: Omit<IRoleSpecBase, 'zIndex' | 'options'>, options = {}) => {
  const role: IComponentRoleSpec = {
    zIndex: 0,
    options: {
      angle: 0,
      shapePoints: [],
      ...options
    },
    ...attributes
  };

  return { role };
};

export const ChartHistory = () => {
  const id = 'graphicAction';
  const [story, setStory] = useState<Story>();
  const [pause, setPause] = useState<boolean>(false);
  useEffect(() => {
    // rect
    // 数组第一项是 appear 效果，第二项是强调效果
    const roles: IStorySpec['roles'] = [];
    const scene1Actions: IRoleLink[] = [];
    const scene2Actions: IRoleLink[] = [];

    {
      const { role } = createRole(
        {
          id: 'title-line-1',
          type: StoryGraphicType.TEXT,
          position: {
            top: 400,
            left: 400,
            width: 700,
            height: 200
          }
        },
        { graphic: { text: 'A BRIEF HISTORY', fontSize: 60, fontWeight: 'bold' } }
      );

      roles.push(role);
      scene1Actions.push({
        roleId: role.id,
        actions: [
          {
            action: 'appear',
            duration,
            startTime: 50,
            payload: {
              animation: {
                duration,
                easing: 'linear',
                effect: 'typewriter'
              }
            }
          },
          {
            action: 'moveTo',
            duration,
            startTime: 50 + duration * 2,
            destination: { x: 350, y: 100 },
            payload: {
              animation: {
                duration,
                easing: 'linear'
              }
            }
          },
          {
            action: 'style',
            duration,
            startTime: 50 + duration * 2,
            graphic: {
              fontSize: 50
            },
            payload: {
              animation: {
                duration,
                easing: 'linear'
              }
            }
          }
        ]
      });
    }
    {
      const { role } = createRole(
        {
          id: 'title-line-2',
          type: StoryGraphicType.TEXT,
          position: {
            top: 500,
            left: 400,
            width: 500,
            height: 200
          }
        },
        { graphic: { text: 'OF CHARTS', fontSize: 60, fontWeight: 'bold' } }
      );

      roles.push(role);
      scene1Actions.push({
        roleId: role.id,
        actions: [
          {
            action: 'appear',
            duration,
            startTime: 50 + duration,
            payload: {
              animation: {
                duration,
                easing: 'linear',
                effect: 'typewriter'
              }
            }
          },
          {
            action: 'moveTo',
            duration,
            startTime: 50 + duration * 2,
            destination: { x: 730, y: 100 },
            payload: {
              animation: {
                duration,
                easing: 'linear'
              }
            }
          },
          {
            action: 'style',
            duration,
            startTime: 50 + duration * 2,
            graphic: {
              fontSize: 50
            },
            payload: {
              animation: {
                duration,
                easing: 'linear'
              }
            }
          }
        ]
      });
    }

    const tempSpec: IStorySpec = {
      roles,
      acts: [
        {
          id: 'default-chapter',
          scenes: [scene1Actions]
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
      window.pause = true;
    });
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '100%' }} id={id}></div>
    </div>
  );
};
