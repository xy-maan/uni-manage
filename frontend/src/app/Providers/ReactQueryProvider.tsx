"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
   const query=new QueryClient();
  return (
    <QueryClientProvider  client={query}>
      {children}
    </QueryClientProvider>
  );
}