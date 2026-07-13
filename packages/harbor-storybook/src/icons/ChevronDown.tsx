import React from 'react';
import type { IconProps } from './InfoCircleFilled';

/**
 * "chevron-down" — Figma node 61:385. Used by Select's trigger.
 * Stroke is `currentColor` so it inherits the surrounding text color.
 */
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
