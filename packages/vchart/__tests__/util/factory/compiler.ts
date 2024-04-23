export const getTestCompiler = () =>
  ({
    updateData: () => {},
    updateState: () => {},
    renderAsync: () => {},
    getVGrammarView: () => {
      return {
        updateLayoutTag: () => {},
        getDataById: () => {},
        getMarkById: () => {},
        getSignalById: () => {},
        signal: () => {
          return {
            id: () => {
              return {
                value: () => {}
              };
            }
          };
        }
      };
    },
    addGrammarItem: () => {},
    addInteraction: () => {},
    removeInteraction: () => {}
  } as any);
