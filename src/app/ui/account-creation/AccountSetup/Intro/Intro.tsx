"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import introCopy from "@/copy/account-creation/account-setup/intro";
import { ListItem, Span } from "@/app/ui/JSXWrappers/TextWrappers";
import Heading from "@/app/ui/JSXWrappers/Heading";
import styles from "./styles.module.css";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import getUsername from "@/app/queries/client/getUsername";
import { useRouter } from "next/navigation";

const explainerSections = introCopy.explainers.map((explainer, index) => (
  <section key={index} className={styles.explainerSection}>
    <Heading as="h3" size="30" className={styles.explainerSectionHeading}>
      {explainer.title}
    </Heading>
    <ul className={styles.explainerPointsList}>
      {explainer.points.map((point, pointIndex) => (
        <ListItem key={pointIndex}>
          {point.text}
          {point.nestedPoints && (
            <ul>
              {point.nestedPoints.map((nestedPoint, nestedPointIndex) => (
                <ListItem key={nestedPointIndex}>{nestedPoint}</ListItem>
              ))}
            </ul>
          )}
        </ListItem>
      ))}
    </ul>
  </section>
));

export default function Intro({ authUser }: { authUser: User | null }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userName, setUserName] = useState<string>("user");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    let isMounted = true;
    // This should never happen, but just in case
    if (!authUser?.id) {
      console.warn("No authenticated user found.");
      router.push("/error?message=no%20authenticated%20user");
      return;
    }

    const fetchUsername = async () => {
      // TODO: use error tracking service for production logging
      try {
        const username = await getUsername(authUser, supabase);
        if (!isMounted) return;

        if (username) {
          setUserName(username);
        } else {
          console.warn("Username not found for user");
          router.push("/error?message=user%20not%20found");
        }
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching user data:", error);
        router.push("/error?message=database%20error");
      }
    };

    fetchUsername();

    return () => {
      isMounted = false;
    };
  }, [authUser, supabase, router]);

  return (
    <Bounded innerClassName={styles.contentContainer}>
      <section className={styles.introHeader}>
        <Span size="48-responsive">
          Hello {loading ? "loading username..." : userName}!
        </Span>
        <Heading as="h1" size="48-responsive">
          {introCopy.heading}
        </Heading>
      </section>

      <section className={styles.explainerSectionsContainer}>
        {explainerSections}
      </section>
    </Bounded>
  );
}
