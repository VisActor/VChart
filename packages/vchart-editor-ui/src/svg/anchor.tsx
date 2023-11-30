import type { IconBaseProps } from '../typings/svg';

export function IconAnchor(props: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="3"
      height="14"
      viewBox="0 0 3 14"
      fill="none"
      style={props.style}
      onClick={props.onClick}
    >
      <path d="M0 0C1.65685 0 3 1.34315 3 3V11C3 12.6569 1.65685 14 0 14V0Z" fill="url(#paint0_linear_691_30303)" />
      <defs>
        <linearGradient id="paint0_linear_691_30303" x1="1.5" y1="0" x2="1.5" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3073F2" />
          <stop offset="1" stopColor="#30E6F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
