import { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";
import { IconButton } from "@radix-ui/themes";
import { CopyIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "@radix-ui/react-icons";

// copy id with icon
export function IdWithCopy({ id }: { id: string | number }) {
     const str = String(id);
     const short = str.length > 8 ? `#${str.slice(0, 8)}...` : `#${str}`;
     const [copied, setCopied] = useState(false);

     function handleCopy() {
          navigator.clipboard.writeText(str);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     }

     return (
          <Flex align="center" gap="2">
               <Text size="2" className="text-indigo-600 font-mono font-medium" title={str}>
                    {short}
               </Text>
               <IconButton
                    size="1"
                    variant="ghost"
                    color="gray"
                    onClick={handleCopy}
                    title="Copiar ID"
                    className="cursor-pointer"
               >
                    {copied ? <CheckIcon width="14" height="14" className="text-green-600" /> : <CopyIcon width="14" height="14" />}
               </IconButton>
          </Flex>
     );
}