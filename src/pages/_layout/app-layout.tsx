import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SymbolslistProvider } from "@/contexts/symbols-contexts";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <SymbolslistProvider>
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-8 pt-6 max-sm:pt-8 max-sm:p-5">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SymbolslistProvider>
    </SidebarProvider>
  );
}
