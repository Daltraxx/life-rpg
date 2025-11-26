import { Jersey_10 } from "next/font/google";

/**
 * Font configuration module for the Life RPG application.
 * 
 * This file exports configured Google Font instances used throughout the application.
 * The fonts are optimized with specific settings including weight, CSS variables,
 * character subsets, and display strategies for improved loading performance.
 * 
 * Fonts configured here can be imported and utilized the root layout
 * to make them available globally across the app.
 * 
 * @module fonts
 */
export const jersey = Jersey_10({
  weight: "400",
  variable: "--font-jersey",
  subsets: ["latin"],
  display: "swap",
});
