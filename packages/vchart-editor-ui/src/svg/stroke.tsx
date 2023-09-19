import type { IconBaseProps } from '../typings/svg';

export function IconStroke(props: IconBaseProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask id="path-1-inside-1_163_2254" fill="white">
        <path
          // eslint-disable-next-line
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM6.96 12C6.96 14.7835 9.21649 17.04 12 17.04C14.7835 17.04 17.04 14.7835 17.04 12C17.04 9.21649 14.7835 6.96 12 6.96C9.21649 6.96 6.96 9.21649 6.96 12Z"
        />
      </mask>
      <path
        // eslint-disable-next-line
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM6.96 12C6.96 14.7835 9.21649 17.04 12 17.04C14.7835 17.04 17.04 14.7835 17.04 12C17.04 9.21649 14.7835 6.96 12 6.96C9.21649 6.96 6.96 9.21649 6.96 12Z"
        fill={props.fill ?? '#FF6969'}
        stroke="black"
        strokeOpacity="0.1"
        strokeWidth="2"
        mask="url(#path-1-inside-1_163_2254)"
      />
    </svg>
  );
}
