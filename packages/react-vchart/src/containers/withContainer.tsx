import React, { useRef, useState, useLayoutEffect } from 'react';

export interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function withContainer<P extends ContainerProps>(
  Comp: React.ComponentType<any>,
  name = 'ChartContainer',
  getProps?: (props: any) => any
) {
  const Cls = React.forwardRef<any, P>((props, ref) => {
    const container = useRef<HTMLDivElement>(null);
    const [inited, setInited] = useState(false);
    const { className, style, width, ...options } = props;

    useLayoutEffect(() => {
      setInited(true);
    }, []);

    return (
      <div
        ref={container}
        className={className}
        style={{
          position: 'relative',
          height: props.height || '100%',
          width: props.width || '100%',
          ...style
        }}
      >
        {inited ? (
          <Comp ref={ref} container={container.current} {...(getProps ? getProps(options) : options)} />
        ) : (
          <></>
        )}
      </div>
    );
  });
  Cls.displayName = name || Comp.name;
  return Cls;
}
