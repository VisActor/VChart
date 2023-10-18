import type { IconBaseProps } from '../typings/svg';

export function IconLine(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={props.style}
      onClick={props.onClick}
    >
      <path
        // eslint-disable-next-line
        d="M3 12C3 11.4477 3.44772 11 4 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z"
        fill={props.fill ?? '#2B2F36'}
      />
    </svg>
  );
}

export function IconDashedLine(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      style={props.style}
      onClick={props.onClick}
    >
      <path
        // eslint-disable-next-line
        d="M14.9878 12C14.9878 11.4477 14.54 11 13.9878 11H11.4878C10.9355 11 10.4878 11.4477 10.4878 12C10.4878 12.5523 10.9355 13 11.4878 13H13.9878C14.54 13 14.9878 12.5523 14.9878 12Z"
        fill={props.fill ?? '#2B2F36'}
      />
      <path
        // eslint-disable-next-line
        d="M21.75 12C21.75 11.4477 21.3023 11 20.75 11L18.25 11C17.6977 11 17.25 11.4477 17.25 12C17.25 12.5523 17.6977 13 18.25 13H20.75C21.3023 13 21.75 12.5523 21.75 12Z"
        fill={props.fill ?? '#2B2F36'}
      />
      <path
        // eslint-disable-next-line
        d="M3.75 12C3.75 11.4477 4.19772 11 4.75 11H7.25C7.80228 11 8.25 11.4477 8.25 12C8.25 12.5523 7.80228 13 7.25 13H4.75C4.19772 13 3.75 12.5523 3.75 12Z"
        fill={props.fill ?? '#2B2F36'}
      />
    </svg>
  );
}

export function IconThinDashedLine(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="41"
      height="28"
      viewBox="0 0 41 28"
      fill="none"
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M11.5 13H13.5V15H11.5V13Z" fill={props.fill ?? '#2B2F36'} />
      <path d="M15.5 13H17.5V15H15.5V13Z" fill={props.fill ?? '#2B2F36'} />
      <path d="M21.5 13H19.5V15H21.5V13Z" fill={props.fill ?? '#2B2F36'} />
      <path d="M23.5 13H25.5V15H23.5V13Z" fill={props.fill ?? '#2B2F36'} />
      <path d="M29.5 13H27.5V15H29.5V13Z" fill={props.fill ?? '#2B2F36'} />
    </svg>
  );
}
