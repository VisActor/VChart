import type React from 'react';

export interface IconBaseProps {
  fill?: string;
  style?: React.CSSProperties;
  onClick?: (event?: React.MouseEvent) => void;
}
