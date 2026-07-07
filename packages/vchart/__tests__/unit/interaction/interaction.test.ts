import { Interaction } from '../../../src/interaction/interaction';

describe('Interaction', () => {
  it('clears previous states when the next stated graphics are empty', () => {
    const interaction = new Interaction();
    const previousGraphic = {
      currentStates: ['dimension_hover'],
      setStates(states?: string[] | null) {
        this.currentStates = states ?? [];
      }
    };
    const reverseGraphic = {
      currentStates: ['dimension_hover_reverse'],
      setStates(states?: string[] | null) {
        this.currentStates = states ?? [];
      }
    };
    const mark = {
      id: 1,
      getGraphics: () => [previousGraphic, reverseGraphic],
      hasAnimationByState: () => false
    };
    const trigger = {
      getMarks: () => [mark],
      getMarkIdByState: () => ({
        dimension_hover: [1],
        dimension_hover_reverse: [1]
      })
    };

    interaction.setStatedGraphics(trigger as any, [previousGraphic as any]);

    const nextGraphics = interaction.updateStates(
      trigger as any,
      [],
      [previousGraphic as any],
      'dimension_hover',
      'dimension_hover_reverse'
    );

    expect(nextGraphics).toEqual([]);
    expect(previousGraphic.currentStates).toEqual([]);
    expect(reverseGraphic.currentStates).toEqual([]);
  });
});
