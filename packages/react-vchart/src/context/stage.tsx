import React from 'react';
import type { Stage } from '@visactor/vrender';

const StageContext = React.createContext<Stage>(null);
StageContext.displayName = 'StageContext';

export function withStage<T>(Component: typeof React.Component) {
  const Com = React.forwardRef<any, T>((props: T, ref) => {
    return <StageContext.Consumer>{ctx => <Component ref={ref} stage={ctx} {...props} />}</StageContext.Consumer>;
  });
  Com.displayName = Component.name;
  return Com;
}

export default StageContext;
