import React from 'openinula';
import type { IView } from '@visactor/vgrammar-core';

const ViewContext = React.createContext<IView>(null);
ViewContext.displayName = 'ViewContext';

export function withView<T>(Component: typeof React.Component) {
  const Com = React.forwardRef<any, T>((props: T, ref) => {
    return <ViewContext.Consumer>{ctx => <Component ref={ref} view={ctx} {...props} />}</ViewContext.Consumer>;
  });
  Com.displayName = Component.name;
  return Com;
}

export default ViewContext;
