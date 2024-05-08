import React, { useEffect, useState } from 'react';
import { IActionsLink, IAction, IStorySpec } from '../../../src/story/interface';
import { Story } from '../../../src/story/story';
import '../../../src/story/index';
import { ICharacterSpec } from '../../../src/story/character';
import { StoryGraphicType } from '../../../src/dsl/constant';

const duration = 1000;
const width = 200;
const height = 100;

const createCharacterAndAction = (type: string, effects: string[], row = 0, col = 0, options = {}) => {
  const appearEffect = effects[0];
  const id = `${type}-${appearEffect}-${row}`;
  const character: ICharacterSpec = {
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
  const characterActions: IAction[] = effects.map((effect, effectIndex) => {
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

  const characterAction: IActionsLink = {
    characterId: id,
    characterActions
  };
  return { characterAction, character };
};

export const GraphicActionDemo = () => {
  const id = 'graphicAction';
  const [story, setStory] = useState<Story>();
  const [pause, setPause] = useState<boolean>(false);
  useEffect(() => {
    // rect
    // 数组第一项是 appear 效果，第二项是强调效果
    const characters: IStorySpec['characters'] = [];
    const characterActions: IActionsLink[] = [];
    let col = 0;
    // rect
    {
      const effects = [
        ['wipe'],
        ['fade', 'brighten'],
        ['grow'],
        ['move'],
        ['fade', 'flicker', 'darken'] //
      ];
      effects.forEach((effect, index) => {
        const { character, characterAction } = createCharacterAndAction(StoryGraphicType.RECT, effect, index);
        characters.push(character);
        characterActions.push(characterAction);
      });
      ++col;
    }

    // text
    {
      const effects = [
        ['fade'],
        // ['flicker'], // TODO: 直接 flicker 是有问题的
        ['typewriter', 'flicker'] //
      ];
      effects.forEach((effect, index) => {
        const { character, characterAction } = createCharacterAndAction(StoryGraphicType.TEXT, effect, index, col, {
          graphic: { fontSize: 24, text: effect[0], dx: width / 2, dy: height / 2 },
          text: { visible: false }
        });
        characters.push(character);
        characterActions.push(characterAction);
      });
      ++col;
    }
    const tempSpec: IStorySpec = {
      characters,
      acts: [
        {
          id: 'default-chapter',
          scenes: [
            {
              id: '11',
              actions: characterActions
            }
          ]
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
