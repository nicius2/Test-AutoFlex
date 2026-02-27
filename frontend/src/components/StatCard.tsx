import type { StatCardProps } from "../types/StatCard";
import { Box } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";

export function StatCard({ label, value, icon, iconBg, sub }: StatCardProps) {
     return (
          <Box className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1 min-w-0">
               <Flex justify="between" align="start">
                    <Box>
                         <Text as="div" size="1" className="text-gray-400 uppercase tracking-widest mb-1">
                              {label}
                         </Text>
                         <Text as="div" size="7" weight="bold" className="text-gray-900 leading-tight">
                              {value}
                         </Text>
                         {sub && (
                              <Text as="div" size="1" className="text-gray-400 mt-1">
                                   {sub}
                              </Text>
                         )}
                    </Box>
                    <Flex
                         align="center" justify="center"
                         className={`w-11 h-11 rounded-xl shrink-0 ${iconBg}`}
                    >
                         {icon}
                    </Flex>
               </Flex>
          </Box>
     );
}