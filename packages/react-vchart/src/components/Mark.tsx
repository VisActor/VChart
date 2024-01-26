import React, { useContext, useEffect } from 'react';
import { isNil } from '@visactor/vutils';
import type { IView, MarkSpec } from '@visactor/vgrammar-core';

import ViewContext from '../context/view';
import { uid } from '../util';

export interface MarkProps extends Omit<MarkSpec, 'name' | 'id'> {
  id?: string | number;
  glyphType?: string;
}

export interface IMarkElement extends React.ReactElement<Props, React.JSXElementConstructor<Props>> {
  id: string | number;
}

type Props = MarkProps & { updateId?: number };

export const Mark: React.FC<Props> = (props: Props) => {
  const context = useContext(ViewContext);
  const id = React.useRef<string | number>(isNil(props.id) ? uid('mark') : props.id);
  const updateId = React.useRef<number>(props.updateId);

  if (props.updateId !== updateId.current) {
    // only update mark when chart finished render
    updateId.current = props.updateId;
    if (context) {
      addOrUpdateMark(context, id.current as string, props);
    }
  }

  useEffect(() => {
    return () => {
      if (context) {
        removeMark(context, id.current as string);
      }
    };
  }, []);

  return null;
};

const addOrUpdateMark = (view: IView, id: string, props: Props) => {
  if (!view.renderer) {
    // view has been released
    return;
  }

  let mark = view.getMarkById(id);
  const { group, glyphType, updateId, ...others } = props;
  if (!mark) {
    mark = (view as any)
      .mark(props.type, props.group ?? view.rootMark, props.glyphType ? { glyphType: props.glyphType } : null)
      .name(id);
  }

  mark.parse(others);
  view.run();
};

const removeMark = (view: IView, id: string) => {
  if (view.renderer) {
    const mark = view.getMarkById(id);
    (view as any).removeGrammar(id);
  }
};
