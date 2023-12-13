export const getTestCompiler = () =>
  ({
    updateData: () => {},
    updateState: () => {},
    renderAsync: () => {},
    getVGrammarView: () => {
      return {
        updateLayoutTag: () => {},
        getDataById: () => {},
        getMarkById: () => {}
      };
    },
    addInteraction: () => {},
    removeInteraction: () => {}
  } as any);
