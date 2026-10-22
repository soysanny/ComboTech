"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store, persistor, type RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Applies the persisted theme preference to the document root so Tailwind's
 * `dark` variant activates. Reacts to system changes when mode is "system".
 */
function ThemeSync({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const isDark = mode === "dark" || (mode === "system" && media.matches);
      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    };

    apply();
    if (mode === "system") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
  }, [mode]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeSync>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </ThemeSync>
          <Toaster richColors closeButton position="top-right" />
        </QueryClientProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
