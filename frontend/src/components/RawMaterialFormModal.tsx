import { useState, useEffect } from "react";
import { Dialog, Flex, Box, Text, Button, Spinner, Callout, TextField } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import type { RawMaterialFormProps } from "../types/RawMaterialForm";

const schemaRawMaterialForm = z.object({
     name: z.string().min(1, "Nome é obrigatório."),
     stockQuantity: z.number().min(0, "Quantidade em estoque deve ser maior ou igual a 0."),
});

export function RawMaterialFormModal({ open, onClose, onSave, initial }: RawMaterialFormProps) {
     const [name, setName] = useState("");
     const [stockQuantity, setStockQuantity] = useState("");
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState("");

     useEffect(() => {
          if (open) {
               setName(initial?.name ?? "");
               setStockQuantity(initial?.stockQuantity?.toString() ?? "");
               setError("");
          }
     }, [open, initial]);

     async function handleSubmit(e: React.FormEvent) {
          e.preventDefault();

          const parsedQuantity = parseFloat(stockQuantity);
          const validation = schemaRawMaterialForm.safeParse({
               name: name.trim(),
               stockQuantity: isNaN(parsedQuantity) ? -1 : parsedQuantity
          });

          if (!validation.success) {
               return setError(validation.error.issues[0].message);
          }

          setSaving(true);
          try {
               await onSave(validation.data);
               onClose();
          } catch {
               setError("Erro ao salvar matéria-prima. Tente novamente.");
          } finally {
               setSaving(false);
          }
     }

     return (
          <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
               <Dialog.Content maxWidth="420px" className="rounded-2xl">
                    <Dialog.Title>{initial ? "Editar Matéria-Prima" : "Nova Matéria-Prima"}</Dialog.Title>
                    <Dialog.Description size="2" mb="4" className="text-gray-400">
                         {initial ? "Atualize as informações da matéria-prima." : "Preencha os dados para cadastrar uma nova matéria-prima."}
                    </Dialog.Description>

                    <form onSubmit={handleSubmit}>
                         <Flex direction="column" gap="3">
                              <Box>
                                   <Text as="label" size="2" weight="medium" className="text-gray-700 mb-1 block">
                                        Nome da Matéria-Prima
                                   </Text>
                                   <TextField.Root
                                        name="name"
                                        placeholder="Ex: Aço Carbono"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoFocus
                                   />
                              </Box>
                              <Box>
                                   <Text as="label" size="2" weight="medium" className="text-gray-700 mb-1 block">
                                        Quantidade em Estoque
                                   </Text>
                                   <TextField.Root
                                        name="stockQuantity"
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(e.target.value)}
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
                                   {initial ? "Salvar alterações" : "Criar matéria-prima"}
                              </Button>
                         </Flex>
                    </form>
               </Dialog.Content>
          </Dialog.Root>
     );
}
