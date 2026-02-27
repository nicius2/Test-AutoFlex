import { Outlet, useLocation } from "react-router";
import { Flex, Box } from "@radix-ui/themes";
import { NavBar } from "../components/NavBar";
import { Sidebar } from "../components/Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/products":         "Product Inventory",
  "/raw-materials":    "Raw Material Inventory",
  "/product-material": "Product Material",
};

export function AppLayout() {
  const { pathname } = useLocation();
  const pageTitle = PAGE_TITLES[pathname] ?? "AutoFlex";

  return (
    <Flex className="h-screen w-screen bg-[#f8fafc] overflow-hidden text-slate-800 font-sans">

      <Sidebar />

      <Flex direction="column" className="flex-1 overflow-hidden h-full">
        <NavBar title={pageTitle} />
        <Box className="flex-1 overflow-auto bg-[#f8fafc] p-8">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
