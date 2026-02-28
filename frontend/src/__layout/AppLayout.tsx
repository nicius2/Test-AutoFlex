import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Flex, Box } from "@radix-ui/themes";
import { NavBar } from "../components/NavBar";
import { Sidebar } from "../components/Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/products": "Product Inventory",
  "/raw-materials": "Raw Material Inventory",
  "/product-material": "Product Material",
  "/suggestions": "Production Suggestion",
};

export function AppLayout() {
  const { pathname } = useLocation();
  const pageTitle = PAGE_TITLES[pathname] ?? "AutoFlex";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Flex className="h-screen w-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans">

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Flex direction="column" className="flex-1 overflow-hidden h-full min-w-0">
        <NavBar title={pageTitle} onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <Box className="flex-1 overflow-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
