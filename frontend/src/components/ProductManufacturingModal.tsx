import { useState, useEffect, useMemo } from "react";
import { Dialog, Flex, Box, Text, Button, Spinner, Callout, TextField, Select, Badge, IconButton } from "@radix-ui/themes";
import { ExclamationTriangleIcon, TrashIcon, PlusIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import { getProductMaterials, addProductMaterial, removeProductMaterial, type ProductMaterialResponseDto, type ProductMaterialRequestDto } from "../api/productMaterials";
import { getRawMaterials } from "../api/rawMaterials";
import { getProductionSuggestion, type ProductionSuggestionItem } from "../api/productionSuggestion";
import type { RawMaterial } from "../types/RawMaterialForm";
import type { Product } from "../api/products";

interface ProductManufacturingModalProps {
     open: boolean;
     onClose: () => void;
     product: Product | null;
     allProducts?: Product[];
}

export function ProductManufacturingModal({ open, onClose, product, allProducts }: ProductManufacturingModalProps) {
     const [activeProduct, setActiveProduct] = useState<Product | null>(null);
     const [materials, setMaterials] = useState<ProductMaterialResponseDto[]>([]);
     const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
     const [suggestions, setSuggestions] = useState<ProductionSuggestionItem[]>([]);

     const [loading, setLoading] = useState(false);
     const [saving, setSaving] = useState(false);
     const [error, setError] = useState("");

     const [selectedMaterialId, setSelectedMaterialId] = useState("");
     const [requiredQuantity, setRequiredQuantity] = useState("1");

     useEffect(() => {
          if (open) {
               if (product) {
                    setActiveProduct(product);
                    fetchData(product.id);
               } else {
                    setActiveProduct(null);
                    setMaterials([]);
                    setSelectedMaterialId("");
                    setRequiredQuantity("1");
                    setError("");
                    setSuggestions([]);
               }
          } else {
               setActiveProduct(null);
               setMaterials([]);
               setSelectedMaterialId("");
               setRequiredQuantity("1");
               setError("");
               setSuggestions([]);
          }
     }, [open, product]);

     async function fetchData(productId: string) {
          setLoading(true);
          setError("");
          try {
               const [assignedMats, availableMats, suggestionRes] = await Promise.all([
                    getProductMaterials(productId),
                    getRawMaterials(),
                    getProductionSuggestion()
               ]);
               setMaterials(assignedMats);
               setRawMaterials(availableMats);
               setSuggestions(suggestionRes.suggestions);
          } catch {
               setError("Erro ao carregar os dados para fabricação.");
          } finally {
               setLoading(false);
          }
     }

     async function refreshSuggestions() {
          try {
               const suggestionRes = await getProductionSuggestion();
               setSuggestions(suggestionRes.suggestions);
          } catch {
               // Do not override main errors, just silently fail the suggestion refresh
          }
     }

     const maxProductionLimit = useMemo(() => {
          if (!activeProduct || suggestions.length === 0) return 0;
          // Find the suggestion for this specific product
          const suggestion = suggestions.find(s => s.productName === activeProduct.name);
          return suggestion ? suggestion.quantity : 0;
     }, [suggestions, activeProduct]);

     async function handleAddMaterial() {
          if (!activeProduct) return;
          if (!selectedMaterialId) {
               setError("Selecione uma matéria-prima.");
               return;
          }
          const qty = parseInt(requiredQuantity, 10);
          if (isNaN(qty) || qty < 1) {
               setError("A quantidade deve ser de pelo menos 1.");
               return;
          }

          setSaving(true);
          setError("");
          try {
               const payload: ProductMaterialRequestDto = {
                    rawMaterialId: selectedMaterialId,
                    requiredQuantity: qty
               };
               const added = await addProductMaterial(activeProduct.id, payload);
               setMaterials(prev => [...prev, added]);
               setSelectedMaterialId("");
               setRequiredQuantity("1");

               // Instantly refresh the estimate
               await refreshSuggestions();
          } catch (err: any) {
               setError(err.response?.data?.message || err.message || "Erro ao associar matéria-prima.");
          } finally {
               setSaving(false);
          }
     }

     async function handleRemoveMaterial(rawMaterialId: string) {
          if (!activeProduct) return;
          try {
               await removeProductMaterial(activeProduct.id, rawMaterialId);
               setMaterials(prev => prev.filter(m => m.rawMaterialId !== rawMaterialId));

               // Instantly refresh the estimate
               await refreshSuggestions();
          } catch {
               setError("Erro ao remover a matéria-prima.");
          }
     }

     return (
          <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
               <Dialog.Content maxWidth="650px" className="rounded-2xl">
                    <Dialog.Title>{activeProduct ? `Fabricação: ${activeProduct.name}` : "Criar Fabricação"}</Dialog.Title>
                    <Dialog.Description size="2" mb="4" className="text-gray-400">
                         Defina os materiais e quantidades necessárias para criar <strong className="text-indigo-600">uma unidade</strong> deste produto.
                    </Dialog.Description>

                    {error && (
                         <Callout.Root color="red" size="1" mb="4">
                              <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                              <Callout.Text>{error}</Callout.Text>
                         </Callout.Root>
                    )}

                    {!activeProduct && allProducts && (
                         <Box mb="5">
                              <Text as="label" size="2" weight="bold" className="text-gray-800 block mb-2">
                                   Selecione o Produto
                              </Text>
                              <Select.Root onValueChange={(val) => {
                                   const p = allProducts.find(x => x.id === val);
                                   if (p) {
                                        setActiveProduct(p);
                                        fetchData(p.id);
                                   }
                              }}>
                                   <Select.Trigger placeholder="Escolha um produto..." className="w-full text-left" />
                                   <Select.Content>
                                        {allProducts.map(p => (
                                             <Select.Item key={p.id} value={p.id}>{p.name}</Select.Item>
                                        ))}
                                   </Select.Content>
                              </Select.Root>
                         </Box>
                    )}

                    {activeProduct && (
                         <>
                              {!loading && materials.length > 0 && (
                                   <Box className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 mb-5 relative overflow-hidden">
                                        <Box className="absolute -right-4 -top-4 text-indigo-100 opacity-50">
                                             <LightningBoltIcon width="120" height="120" />
                                        </Box>
                                        <Flex direction="column" className="relative z-10">
                                             <Text size="2" weight="medium" className="text-indigo-600/80 uppercase tracking-widest mb-1">
                                                  Estimativa de Produção
                                             </Text>
                                             <Flex align="baseline" gap="2">
                                                  <Text size="8" weight="bold" className="text-indigo-900 tracking-tight">
                                                       {maxProductionLimit}
                                                  </Text>
                                                  <Text size="3" className="text-indigo-700 font-medium">
                                                       unidades possíveis
                                                  </Text>
                                             </Flex>
                                             <Text size="1" className="text-indigo-900/60 mt-1 max-w-[80%]">
                                                  Baseado na receita definida abaixo e no estoque atual de matérias-primas.
                                             </Text>
                                        </Flex>
                                   </Box>
                              )}

                              <Box className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5">
                                   <Text as="div" size="2" weight="bold" mb="3" className="text-gray-800">
                                        Adicionar Matéria-Prima
                                   </Text>
                                   <Flex gap="3" align="end" wrap="wrap">
                                        <Box flexGrow="1">
                                             <Text as="label" size="2" weight="medium" className="text-gray-700 block mb-1">
                                                  Selecione a matéria-prima
                                             </Text>
                                             <Select.Root value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                                                  <Select.Trigger placeholder="Selecione..." className="w-full" disabled={loading} />
                                                  <Select.Content>
                                                       {rawMaterials.map(rm => (
                                                            <Select.Item key={rm.id} value={rm.id}>
                                                                 {rm.name} (Estoque: {rm.stockQuantity})
                                                            </Select.Item>
                                                       ))}
                                                  </Select.Content>
                                             </Select.Root>
                                        </Box>
                                        <Box width="100px">
                                             <Text as="label" size="2" weight="medium" className="text-gray-700 block mb-1">
                                                  Quantidade
                                             </Text>
                                             <TextField.Root
                                                  type="number"
                                                  min="1"
                                                  step="1"
                                                  value={requiredQuantity}
                                                  onChange={(e) => setRequiredQuantity(e.target.value)}
                                                  disabled={loading}
                                             />
                                        </Box>
                                        <Button
                                             color="indigo"
                                             onClick={handleAddMaterial}
                                             disabled={saving || !selectedMaterialId || loading}
                                             className="cursor-pointer"
                                        >
                                             {saving ? <Spinner /> : <PlusIcon />}
                                             Adicionar
                                        </Button>
                                   </Flex>
                              </Box>

                              <Text as="div" size="2" weight="bold" mb="3" className="text-gray-800">
                                   Receita do Produto
                              </Text>

                              <Box className="overflow-x-auto border border-gray-100 rounded-xl mb-4">
                                   <table className="w-full text-sm">
                                        <thead>
                                             <tr className="bg-gray-50 text-left border-b border-gray-100">
                                                  <th className="px-4 py-2 font-medium text-gray-500">Matéria-Prima</th>
                                                  <th className="px-4 py-2 font-medium text-gray-500 text-right">Qtd</th>
                                                  <th className="px-4 py-2 font-medium text-gray-500 text-center w-16">Ação</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {loading ? (
                                                  <tr>
                                                       <td colSpan={3} className="px-4 py-6 text-center">
                                                            <Spinner />
                                                       </td>
                                                  </tr>
                                             ) : materials.length === 0 ? (
                                                  <tr>
                                                       <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                                                            Nenhuma matéria-prima associada. Adicione ingredientes para compor a receita.
                                                       </td>
                                                  </tr>
                                             ) : (
                                                  materials.map((m, idx) => (
                                                       <tr key={m.rawMaterialId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                                                            <td className="px-4 py-2 font-medium text-gray-800">
                                                                 {m.rawMaterialName}
                                                            </td>
                                                            <td className="px-4 py-2 text-right">
                                                                 <Badge color="indigo" variant="soft">
                                                                      {m.requiredQuantity} un
                                                                 </Badge>
                                                            </td>
                                                            <td className="px-4 py-2 text-center">
                                                                 <IconButton
                                                                      size="1" variant="ghost" color="red"
                                                                      className="cursor-pointer"
                                                                      title="Remover"
                                                                      onClick={() => handleRemoveMaterial(m.rawMaterialId)}
                                                                 >
                                                                      <TrashIcon />
                                                                 </IconButton>
                                                            </td>
                                                       </tr>
                                                  ))
                                             )}
                                        </tbody>
                                   </table>
                              </Box>
                         </>
                    )}

                    <Flex justify="end">
                         <Dialog.Close>
                              <Button variant="soft" color="gray" type="button" onClick={onClose} className="cursor-pointer">
                                   Fechar
                              </Button>
                         </Dialog.Close>
                    </Flex>
               </Dialog.Content>
          </Dialog.Root>
     );
}
