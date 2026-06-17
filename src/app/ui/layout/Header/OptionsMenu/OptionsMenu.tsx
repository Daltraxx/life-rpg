"use client";

import { JSX, useCallback } from "react";
import { DropdownMenu } from "radix-ui";
import styles from "./styles.module.css";
import { Button } from "@/app/ui/JSXWrappers/TextWrappers/TextWrappers";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants/routes";
import { isRelativePath } from "@/utils/helpers/is-relative-path";
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
  profileComplete,
}: {
  className: string;
  profileComplete: boolean;
}): JSX.Element {
  const pages = [
    {
      name: "Manual",
      href: ROUTES.MANUAL,
    },
    {
      name: "Dashboard",
      href: ROUTES.PROFILE,
    },
    {
      name: profileComplete ? "Edit Profile" : "Create Profile",
      href: profileComplete ? ROUTES.EDIT_PROFILE : ROUTES.CREATE_PROFILE,
    },
  ];

  const router = useRouter();
  const handleSignOut = useCallback(async () => {
    try {
      const response = await fetch(ROUTES.AUTH_SIGNOUT, {
        method: "POST",
      });
      if (!response.ok) {
        console.error("Failed to sign out:", response.statusText);
        try {
          const { redirectUrl } = await response.json();
          // Only allow relative paths for redirection to prevent open redirect vulnerabilities
          const redirectPath = isRelativePath(redirectUrl)
            ? redirectUrl
            : ROUTES.HOME;
          router.push(redirectPath); // Redirect to provided URL or fallback to home page
        } catch {
          router.push(ROUTES.HOME); // Fallback redirect to home page if JSON parsing fails
        }
      } else {
        router.push(ROUTES.HOME); // Redirect to home page on successful sign out
      }
    } catch (error) {
      console.error("Error signing out:", error);
      router.push(ROUTES.ERROR); // Redirect to a generic error page on network or unexpected errors
    }
  }, [router]);

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
                // TODO: Ensure accessibility and style current page differently in the dropdown menu
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
            <DropdownMenu.Item
              className={styles.DropdownMenuItem}
              onSelect={handleSignOut}
            >
              Sign Out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </section>
  );
}
