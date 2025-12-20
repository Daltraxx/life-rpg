interface ChevronIconProps {
  size?: number;
}

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
