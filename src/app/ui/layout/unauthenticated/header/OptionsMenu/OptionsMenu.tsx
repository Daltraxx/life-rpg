"use client";

import { JSX } from "react";
import { DropdownMenu } from "radix-ui";
import styles from "./styles.module.css";
import { Button } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/constants/routes";
import Link from "next/link";
import clsx from "clsx";

/**
 * OptionsMenu component that provides a dropdown menu for user options.
 *
 * Displays a menu button that opens a dropdown containing navigation and account options,
 * including a "Rules" link and a "Sign Out" button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS class names to apply to the menu container
 * @returns {JSX.Element} A section element containing the dropdown menu
 *
 * @example
 * <OptionsMenu className="header-menu" />
 *
 * @remarks
 * - The Sign Out action makes a POST request to `/auth/signout` endpoint
 * - On successful or failed sign out, the user is redirected to the home page
 * - Uses Radix UI DropdownMenu components for accessibility
 */
export default function OptionsMenu({
  className,
}: {
  className: string;
}): JSX.Element {
  const pages = [
    { name: "Login", href: ROUTES.HOME },
    { name: "Sign Up", href: ROUTES.SIGNUP },
    {
      name: "Manual",
      href: ROUTES.MANUAL,
    },
  ];

  const pathname = usePathname();
  return (
    <section className={`${styles.optionsMenu} ${className}`}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button className={styles.menuButton} size="30-responsive">
            MENU
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={styles.DropdownMenuContent}
            sideOffset={5}
          >
            {pages.map((page) => {
              const isCurrentPage = page.href === pathname;
              return (
                <DropdownMenu.Item
                  key={page.name}
                  className={clsx(
                    styles.DropdownMenuItem,
                    isCurrentPage && styles.currentItem,
                  )}
                  aria-current={isCurrentPage ? "page" : undefined}
                  asChild
                >
                  <Link href={page.href}>{page.name}</Link>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </section>
  );
}
