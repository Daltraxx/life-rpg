import Image from "next/image";
import styles from "./styles.module.css";

/**
 * Props for the Avatar component.
 * @typedef {Object} AvatarProps
 * @property {string} [src] - Optional URL of the avatar image. Defaults to "/dsAvatar200-200.webp" if not provided.
 * @property {string} username - The username to display as alt text for the avatar image.
 */
export type AvatarProps = {
  src?: string;
  username: string;
};

/**
 * Avatar component that displays a user's profile image.
 *
 * Renders a fixed 200x200 pixel avatar image with a fallback to a default image
 * if no src is provided. The component uses Next.js Image for optimized image loading.
 *
 * @param {AvatarProps} props - The component props.
 * @param {string} [props.src] - Optional URL of the avatar image.
 * @param {string} props.username - The username for the avatar's alt text.
 * @returns {JSX.Element} The Avatar component.
 */
export default function Avatar({ src, username }: AvatarProps) {
  src = src || "/dsAvatar200-200.webp"; // Fallback to a default avatar image if src is not provided
  return (
    <Image
      src={src}
      alt={`${username}'s avatar`}
      width={200}
      height={200}
      className={styles.avatarImage}
    />
  );
}
