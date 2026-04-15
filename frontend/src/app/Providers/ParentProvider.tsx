"use client";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function ParentProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
        <QueryClientProvider client={queryClient}>
          {/* <UserContextProvider> */}

          <Toaster />
           <SessionProvider>

          {children}
           </SessionProvider>
          {/* </UserContextProvider> */}
        </QueryClientProvider>
  );
}