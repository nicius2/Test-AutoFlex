import { NavLink } from "react-router";
import { Flex, Box, Text, Avatar, IconButton } from "@radix-ui/themes";
import {
  LayersIcon,
  CubeIcon,
  ExitIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import userImage from "../assets/perfil.png";

// Brand Icon

function CarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H8.3a2 2 0 00-1.6.8L4 11l-5.16.86a1 1 0 00-.84.99V16h3m10 0a2 2 0 104 0m-4 0a2 2 0 11-4 0m-10 0a2 2 0 104 0m-4 0a2 2 0 11-4 0" />
    </svg>
  );
}

// Nav Items 

const navItems = [
  { path: "/products", label: "Product", icon: CubeIcon },
  { path: "/raw-materials", label: "Raw Material", icon: LayersIcon },
  { path: "/suggestions", label: "Production Suggestion", icon: MagicWandIcon },
];

// Component 

export function Sidebar() {
  return (
    <Flex
      direction="column"
      className="w-[240px] bg-white border-r border-gray-100 h-full flex-shrink-0 shadow-sm"
    >
      {/* Logo */}
      <Flex align="center" gap="3" className="h-16 px-5 border-b border-gray-100">
        <Flex
          align="center" justify="center"
          className="w-9 h-9 bg-indigo-600 text-white rounded-xl shrink-0"
        >
          <CarIcon width="18" height="18" />
        </Flex>
        <Text as="div" size="3" weight="bold" className="text-gray-900 leading-tight tracking-tight">
          AutoFlex
        </Text>
      </Flex>

      {/* Navigation */}
      <Flex direction="column" className="flex-1 px-3 pt-5">
        <Text
          as="div" size="1" weight="medium"
          className="text-gray-400 uppercase tracking-widest px-3 mb-2"
        >
          Menu
        </Text>

        <Flex direction="column" gap="1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium no-underline",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
                ].join(" ")
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    {/* Active indicator bar */}
                    <span
                      className={[
                        "absolute left-0 w-[3px] h-6 rounded-r-full bg-indigo-600 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    />
                    <Icon
                      width="17" height="17"
                      className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
                    />
                    {item.label}
                  </>
                );
              }}
            </NavLink>
          ))}
        </Flex>
      </Flex>

      {/* Bottom Profile */}
      <Box className="p-4 border-t border-gray-100">
        <Flex align="center" justify="between">
          <Flex align="center" gap="3">
            <Avatar
              size="2"
              src={userImage}
              fallback="VC"
              radius="full"
            />
            <Box>
              <Text as="div" size="2" weight="medium" className="text-gray-800 leading-tight">
                Vinicius Campos
              </Text>
              <Text as="div" size="1" className="text-gray-400 leading-tight">
                Dev Full-Stack
              </Text>
            </Box>
          </Flex>
          <IconButton variant="ghost" color="gray" radius="full" className="cursor-pointer">
            <ExitIcon width="15" height="15" className="text-gray-400" />
          </IconButton>
        </Flex>
      </Box>
    </Flex>
  );
}
