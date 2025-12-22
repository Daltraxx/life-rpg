export interface ChevronIconProps {
  size?: number;
}

/**
 * ChevronUpIcon component renders an upward-pointing chevron SVG icon.
 * 
 * @param props - The component props
 * @param props.size - Optional size for the icon's width and height. Defaults to 15 if not provided.
 * @returns A TSX element containing an SVG chevron pointing upward
 * 
 * @example
 * ```tsx
 * <ChevronUpIcon size={20} />
 * ```
 */
export const ChevronUpIcon = ({ size }: ChevronIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ?? 15}
    height={size ?? 15}
    fill="none"
    viewBox="0 0 15 15"
    role="img"
    aria-label="Chevron up"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.135 8.842a.5.5 0 0 0 .707.023L7.5 5.435l3.658 3.43a.5.5 0 0 0 .684-.73l-4-3.75a.5.5 0 0 0-.684 0l-4 3.75a.5.5 0 0 0-.023.707"
      clipRule="evenodd"
    ></path>
  </svg>
);

/**
 * A chevron down icon component.
 * 
 * @param props - The component props
 * @param props.size - Optional size for the icon's width and height. Defaults to 15 if not provided.
 * 
 * @returns A React SVG element representing a downward-pointing chevron icon
 * 
 * @example
 * ```tsx
 * <ChevronDownIcon size={20} />
 * ```
 */
export const ChevronDownIcon = ({ size }: ChevronIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size ?? 15}
    height={size ?? 15}
    fill="none"
    viewBox="0 0 15 15"
    role="img"
    aria-label="Chevron down"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M3.135 6.158a.5.5 0 0 1 .707-.023L7.5 9.565l3.658-3.43a.5.5 0 0 1 .684.73l-4 3.75a.5.5 0 0 1-.684 0l-4-3.75a.5.5 0 0 1-.023-.707"
      clipRule="evenodd"
    ></path>
  </svg>
);
