"use client";

import Bounded from "@/app/ui/JSXWrappers/Bounded";
import introCopy from "@/copy/account-creation/account-setup/intro";
import { ListItem, Span } from "@/app/ui/JSXWrappers/TextWrappers";
import Heading from "@/app/ui/JSXWrappers/Heading";
import styles from "./styles.module.css";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import getUsername from "@/app/queries/client/getUsername";
import { useRouter } from "next/router";

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
  // Singleton pattern for Supabase client in the browser
  const supabase = createSupabaseBrowserClient();
  const [userName, setUserName] = useState<string>("user");
  const router = useRouter();

  const setUsernameFromDatabase = useCallback(async () => {
    if (!authUser?.id) {
      console.warn("No authenticated user found.");
      return;
    }
    try {
      const username = await getUsername(authUser, supabase);
      if (username) {
        setUserName(username);
      } else {
        console.warn("Username not found for user");
        router.push("/error?message=User%20not%20found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [authUser]);

  useEffect(() => {
    setUsernameFromDatabase();
  }, [setUsernameFromDatabase]);

  return (
    <Bounded innerClassName={styles.contentContainer}>
      <section className={styles.introHeader}>
        <Span size="48-responsive">Hello {userName}!</Span>
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
