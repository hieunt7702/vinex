"use client";

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Suppress the known next-themes script tag warning in development
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string") {
      if (args[0].includes("Encountered a script tag while rendering React component")) {
        return; // Ignore this specific warning caused by next-themes
      }
      if (args[0].includes("Cannot render a sync or defer <script> outside the main document")) {
        return; // Ignore another specific warning caused by next-themes in sub-layouts
      }
    }
    originalError.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider attribute="class" disableTransitionOnChange {...props}>{children}</NextThemesProvider>
}

export { useTheme } from "next-themes";
