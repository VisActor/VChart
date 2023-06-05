import React, { useRef, useState, useLayoutEffect } from "react";

export interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function withContainer<Props extends ContainerProps, CompProps>(
  Comp: typeof React.Component<any, CompProps>,
  name: string = "ChartContainer",
  getProps?: (props: any) => CompProps
) {
  const Cls = React.forwardRef<any, Props>((props: Props, ref) => {
    const container = useRef();
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
          position: "relative",
          height: props.height || "100%",
          width: props.width || "100%",
          ...style,
        }}
      >
        {inited ? (
          <Comp
            ref={ref}
            container={container.current}
            {...(getProps ? getProps(options) : (options as CompProps))}
          />
        ) : (
          <></>
        )}
      </div>
    );
  });
  Cls.displayName = name || Comp.name;
  return Cls;
}
