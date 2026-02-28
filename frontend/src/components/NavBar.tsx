import { Flex, Text, IconButton } from "@radix-ui/themes";
import { BellIcon, QuestionMarkCircledIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

interface NavBarProps {
  title: string;
  onMenuToggle: () => void;
}

export function NavBar({ title, onMenuToggle }: NavBarProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-gray-100 shrink-0 w-full">
      <Flex align="center" gap="3">
        <div className="md:hidden flex items-center">
          <IconButton
            variant="ghost"
            color="gray"
            radius="full"
            className="cursor-pointer"
            aria-label="Abrir menu"
            onClick={onMenuToggle}
          >
            <HamburgerMenuIcon width="18" height="18" className="text-gray-500" />
          </IconButton>
        </div>

        {/* Page title */}
        <Text size="4" weight="bold" className="text-gray-900 tracking-tight truncate">
          {title}
        </Text>
      </Flex>

      {/* Action buttons */}
      <Flex align="center" gap="2">
        <IconButton
          variant="ghost"
          color="gray"
          radius="full"
          className="cursor-pointer"
          aria-label="Notifications"
        >
          <BellIcon width="18" height="18" className="text-gray-500" />
        </IconButton>

        <IconButton
          variant="ghost"
          color="gray"
          radius="full"
          className="cursor-pointer"
          aria-label="Help"
        >
          <QuestionMarkCircledIcon width="18" height="18" className="text-gray-500" />
        </IconButton>
      </Flex>
    </header>
  );
}