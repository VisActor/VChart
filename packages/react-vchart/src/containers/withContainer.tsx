import React, { useRef, useState, useLayoutEffect } from 'react';

export interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
  id?: string;
}

export default function withContainer<Props extends ContainerProps, CompProps>(
  Comp: any,
  name = 'ChartContainer',
  getProps?: (props: any) => CompProps
) {
  const Cls = React.forwardRef<any, CompProps & Props>((props: CompProps & Props, ref) => {
    const container = useRef();
    const [inited, setInited] = useState(false);
    const { className, style, width, height, id, ...options } = props;

    useLayoutEffect(() => {
      setInited(true);
    }, []);

    return (
      <div
        ref={container}
        id={id}
        className={className}
        style={{
          position: 'relative',
          height: height || '100%',
          width: width || '100%',
          ...style
        }}
      >
        {inited ? (
          <Comp ref={ref} container={container.current} {...(getProps ? getProps(options) : (options as CompProps))} />
        ) : (
          <></>
        )}
      </div>
    );
  });
  Cls.displayName = name || Comp.name;
  return Cls;
}
