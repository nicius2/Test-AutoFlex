import { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import { Box } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";
import { Button } from "@radix-ui/themes";
import { Spinner } from "@radix-ui/themes";
import { Callout } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import { z } from "zod";
import type { ProductFormProps } from "../types/ProductForm";

const schemaProductForm = z.object({
     name: z.string().min(1, "Nome é obrigatório."),
     value: z.number().min(0, "Valor deve ser maior ou igual a 0.").max(1000000, "Valor deve ser menor ou igual a 1.000.000."),
});


export function ProductFormModal({ open, onClose, onSave, initial }: ProductFormProps) {
     const [name, setName] = useState("");
     const [value, setValue] = useState("");
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState("");

     useEffect(() => {
          if (open) {
               setName(initial?.name ?? "");
               setValue(initial?.value?.toString() ?? "");
               setError("");
          }
     }, [open, initial]);

     async function handleSubmit(e: React.FormEvent) {
          e.preventDefault();

          const parsedValue = parseFloat(value);
          const validation = schemaProductForm.safeParse({
               name: name.trim(),
               value: isNaN(parsedValue) ? -1 : parsedValue
          });

          if (!validation.success) {
               return setError(validation.error.issues[0].message);
          }

          setSaving(true);
          try {
               await onSave(validation.data);
               onClose();
          } catch {
               setError("Erro ao salvar produto. Tente novamente.");
          } finally {
               setSaving(false);
          }
     }

     return (
          <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
               <Dialog.Content maxWidth="420px" className="rounded-2xl">
                    <Dialog.Title>{initial ? "Editar Produto" : "Novo Produto"}</Dialog.Title>
                    <Dialog.Description size="2" mb="4" className="text-gray-400">
                         {initial ? "Atualize as informações do produto." : "Preencha os dados para cadastrar um novo produto."}
                    </Dialog.Description>

                    <form onSubmit={handleSubmit}>
                         <Flex direction="column" gap="3">
                              <Box>
                                   <Text as="label" size="2" weight="medium" className="text-gray-700 mb-1 block">
                                        Nome do Produto
                                   </Text>
                                   <TextField.Root
                                        placeholder="Ex: Óleo de Motor 5W-30"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                   />
                              </Box>
                              <Box>
                                   <Text as="label" size="2" weight="medium" className="text-gray-700 mb-1 block">
                                        Valor (R$)
                                   </Text>
                                   <TextField.Root
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                   />
                              </Box>

                              {error && (
                                   <Callout.Root color="red" size="1">
                                        <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                                        <Callout.Text>{error}</Callout.Text>
                                   </Callout.Root>
                              )}
                         </Flex>

                         <Flex gap="3" mt="5" justify="end">
                              <Dialog.Close>
                                   <Button variant="soft" color="gray" type="button" onClick={onClose}>
                                        Cancelar
                                   </Button>
                              </Dialog.Close>
                              <Button type="submit" disabled={saving}>
                                   {saving && <Spinner />}
                                   {initial ? "Salvar alterações" : "Criar produto"}
                              </Button>
                         </Flex>
                    </form>
               </Dialog.Content>
          </Dialog.Root>
     );
}