import { type BaseActor, type BaseLayer, type Page, type Player } from '@visactor/story-player';
import { OriginalData } from '../../data/interface';
import anime from '../../lib/anime.es';
import { page02EventDuration } from '../../constant';

export const page02Action = (
  player: Player,
  layerMap: Record<string, BaseLayer>,
  pageMap: Record<string, Page>,
  actorMap: Record<string, BaseActor>,
  data: OriginalData
) => {
  const { page02 } = data;

  const dates = Object.keys(page02);

  dates.forEach((date, i) => {
    const name = `page02ActorPhoto_${date}`;
    player.createAction(actorMap[name], {
      name,
      pageList: [pageMap.page02.id],
      layer: layerMap.layerChart.id,
      timeOffset: i * page02EventDuration,
      acts: [
        {
          duration: page02EventDuration,
          callback: ({ avatar }) => {
            anime
              .timeline({
                duration: page02EventDuration
              })
              .add(
                {
                  targets: avatar,
                  opacity: 1,
                  easing: 'easeInOutQuad',
                  duration: 500
                },
                0
              )
              .add(
                {
                  targets: avatar,
                  easing: 'easeInOutQuad',
                  top: '50px',
                  rotate: (Math.random() - 0.5) * 5,
                  duration: 1000
                },
                0
              );
          }
        }
      ],
      transitionActs: [
        {
          transitionType: 'to',
          duration: 1000,
          callback: ({ avatar }) => {
            anime({
              targets: avatar.dom,
              opacity: 0,
              duration: 1000,
              easing: 'easeInOutQuad'
            });
          }
        }
      ]
    });
  });

  player.createAction(actorMap.page02ActorBar, {
    name: 'page02ActorBar',
    pageList: [pageMap.page02.id],
    layer: layerMap.layerChart.id,
    transitionActs: [
      {
        transitionType: 'from',
        duration: 1000,
        callback: ({ avatar }) => {
          anime({
            targets: avatar.dom,
            opacity: 1,
            duration: 1000,
            easing: 'easeInOutQuad'
          });
        }
      },
      {
        transitionType: 'to',
        duration: 1000,
        callback: ({ avatar }) => {
          anime({
            targets: avatar.dom,
            opacity: 0,
            duration: 1000,
            easing: 'easeInOutQuad'
          });
        }
      }
    ]
  });
};
