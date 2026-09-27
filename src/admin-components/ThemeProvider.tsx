"use client";

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Suppress the known next-themes script tag warning and browser extensions mismatch in development
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const errorStr = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
    if (
      errorStr.includes("Encountered a script tag while rendering React component") ||
      errorStr.includes("Cannot render a sync or defer <script> outside the main document") ||
      errorStr.includes("cz-shortcut-listen")
    ) {
      return; // Ignore warning caused by next-themes or browser extensions
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
