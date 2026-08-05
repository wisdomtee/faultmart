"use client";

import { ReactNode } from "react";

import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import ToastProvider from "./toast-provider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}