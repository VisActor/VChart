import type { IconBaseProps } from '../typings/svg';

export function IconLineDisable(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={props.style ?? {}}
    >
      <path
        // eslint-disable-next-line
        d="M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9ZM4.91455 14.1142C6.03429 15.0099 7.4546 15.5455 9 15.5455C12.615 15.5455 15.5455 12.615 15.5455 9C15.5455 7.4546 15.0099 6.03429 14.1142 4.91455L4.91455 14.1142ZM3.886 13.0857L13.0857 3.886C11.9659 2.99021 10.5455 2.45455 9 2.45455C5.38505 2.45455 2.45455 5.38505 2.45455 9C2.45455 10.5455 2.9902 11.9659 3.886 13.0857Z"
        fill={props.fill ?? '#2B2F36'}
      />
    </svg>
  );
}

export function IconColorDisable(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={props.style ?? {}}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        // eslint-disable-next-line
        d="M3 12.9978C3 7.47616 7.47616 3 12.9978 3C18.5194 3 22.9956 7.47616 22.9956 12.9978C22.9956 18.5194 18.5194 22.9956 12.9978 22.9956C7.47616 22.9956 3 18.5194 3 12.9978ZM12.9978 2C6.92387 2 2 6.92387 2 12.9978C2 19.0717 6.92387 23.9956 12.9978 23.9956C19.0717 23.9956 23.9956 19.0717 23.9956 12.9978C23.9956 6.92387 19.0717 2 12.9978 2ZM19.9963 5.9993L5.99926 19.9963L6.70636 20.7034L20.7034 6.7064L19.9963 5.9993Z"
        fill="#D0D3D6"
      />
    </svg>
  );
}

export function IconDisableRect(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={props.style ?? {}}
    >
      <g clipPath="url(#clip0_163_4121)">
        <rect x="2" y="2" width="22" height="22" rx="2" fill="white" />
        <path d="M24 2L2.5 23.5" stroke="#D0D3D6" />
      </g>
      <rect x="1" y="1" width="24" height="24" rx="3" stroke="#D0D3D6" strokeWidth="1" />
      <defs>
        <clipPath id="clip0_163_4121">
          <rect x="2" y="2" width="22" height="22" rx="2" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
