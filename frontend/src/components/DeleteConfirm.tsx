import type { DeleteConfirmProps } from "../types/DeleteConfirm";
import { useState } from "react";
import { Dialog } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";
import { Spinner } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { Box } from "@radix-ui/themes";

export function DeleteConfirmModal({ open, product, onClose, onConfirm }: DeleteConfirmProps) {
     const [loading, setLoading] = useState(false);

     async function handleConfirm() {
          setLoading(true);
          try {
               await onConfirm();
               onClose();
          } finally {
               setLoading(false);
          }
     }

     return (
          <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
               <Dialog.Content maxWidth="400px" className="rounded-2xl">
                    <Flex gap="3" align="start">
                         <Flex
                              align="center" justify="center"
                              className="w-10 h-10 rounded-full bg-red-50 shrink-0 mt-1"
                         >
                              <TrashIcon className="text-red-500" width="18" height="18" />
                         </Flex>
                         <Box>
                              <Dialog.Title>Excluir produto</Dialog.Title>
                              <Dialog.Description size="2" className="text-gray-500">
                                   Tem certeza que deseja excluir <strong>{product?.name}</strong>?
                                   Essa ação não pode ser desfeita.
                              </Dialog.Description>
                         </Box>
                    </Flex>

                    <Flex gap="3" mt="5" justify="end">
                         <Button variant="soft" color="gray" onClick={onClose} type="button">
                              Cancelar
                         </Button>
                         <Button color="red" onClick={handleConfirm} disabled={loading}>
                              {loading && <Spinner />}
                              Excluir
                         </Button>
                    </Flex>
               </Dialog.Content>
          </Dialog.Root>
     );
}