import { Flex, Text, IconButton } from "@radix-ui/themes";
import { BellIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

interface NavBarProps {
  /** Título exibido à esquerda do header */
  title: string;
}

export function NavBar({ title }: NavBarProps) {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-100 shrink-0 w-full">
      {/* Page title */}
      <Text size="4" weight="bold" className="text-gray-900 tracking-tight">
        {title}
      </Text>

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