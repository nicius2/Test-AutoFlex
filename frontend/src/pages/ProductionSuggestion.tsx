import { useState, useEffect } from "react";
import { Flex, Box, Text, Spinner, Callout, Badge, IconButton } from "@radix-ui/themes";
import { ExclamationTriangleIcon, LightningBoltIcon, MixIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { getProductionSuggestion, type ProductionSuggestionItem, type ProductionSuggestionResponse } from "../api/productionSuggestion";
import { getProducts, type Product } from "../api/products";
import { getProductMaterials, removeProductMaterial } from "../api/productMaterials";
import { ProductManufacturingModal } from "../components/ProductManufacturingModal";

export function ProductionSuggestion() {
     const [products, setProducts] = useState<Product[]>([]);
     const [suggestions, setSuggestions] = useState<ProductionSuggestionItem[]>([]);
     const [grandTotalValue, setGrandTotalValue] = useState<number>(0);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");

     const [materialsOpen, setMaterialsOpen] = useState(false);
     const [materialsTarget, setMaterialsTarget] = useState<Product | null>(null);

     useEffect(() => {
          fetchInitialData();
     }, []);

     async function fetchInitialData() {
          setLoading(true);
          setError("");
          try {
               const [suggestionData, productsData] = await Promise.all([
                    getProductionSuggestion(),
                    getProducts()
               ]);
               setSuggestions(suggestionData.suggestions);
               setGrandTotalValue(suggestionData.grandTotalValue);
               setProducts(productsData);
          } catch (err) {
               setError("Erro ao carregar dados de produção.");
          } finally {
               setLoading(false);
          }
     }

     const formatCurrency = (value: number) => {
          return new Intl.NumberFormat("pt-BR", {
               style: "currency",
               currency: "BRL"
          }).format(value);
     };

     async function handleCloseModal() {
          setMaterialsOpen(false);
          setMaterialsTarget(null);
          await fetchInitialData();
     }

     function openMaterials(productName: string): void {
          const product = products.find(p => p.name === productName);
          if (product) {
               setMaterialsTarget(product);
               setMaterialsOpen(true);
          } else {
               setError(`Detalhes do produto "${productName}" não encontrados.`);
          }
     }

     async function handleDeleteFabricacao(productName: string) {
          if (!confirm(`Tem certeza que deseja excluir a receita/fabricação de ${productName}?`)) return;
          const prod = products.find(p => p.name === productName);
          if (!prod) return;

          try {
               setLoading(true);
               const materials = await getProductMaterials(prod.id);
               await Promise.all(materials.map(m => removeProductMaterial(prod.id, m.rawMaterialId)));
               await fetchInitialData();
          } catch (err) {
               setError("Erro ao excluir fabricação.");
               setLoading(false);
          }
     }

     return (
          <Box className="w-full">
               <Flex justify="between" align="start" wrap="wrap" gap="3" mb="6">
                    <Box>
                         <Text as="div" size="6" weight="bold" className="text-gray-900 tracking-tight">
                              Sugestão de Produção
                         </Text>
                         <Text as="div" size="3" className="text-gray-500 mt-1">
                              Estimativas baseadas no estoque atual de matérias-primas
                         </Text>
                    </Box>
                    <Flex gap="3" wrap="wrap">
                         <button
                              onClick={() => { setMaterialsTarget(null); setMaterialsOpen(true); }}
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                         >
                              <PlusIcon />
                              Criar Fabricação
                         </button>
                         <button
                              onClick={fetchInitialData}
                              disabled={loading}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium transition-colors cursor-pointer disabled:opacity-50"
                         >
                              {loading ? <Spinner /> : <MixIcon />}
                              Atualizar
                         </button>
                    </Flex>
               </Flex>

               {error && (
                    <Callout.Root color="red" size="1" mb="5">
                         <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                         <Callout.Text>{error}</Callout.Text>
                    </Callout.Root>
               )}

               {!loading && !error && (
                    <Flex gap="5" mb="6">
                         <Box className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 flex-1 relative overflow-hidden shadow-sm">
                              <Box className="absolute -right-4 -top-4 text-emerald-100 opacity-40">
                                   <LightningBoltIcon width="120" height="120" />
                              </Box>
                              <Flex direction="column" className="relative z-10">
                                   <Text size="2" weight="bold" className="text-emerald-700/80 uppercase tracking-widest mb-1">
                                        Faturamento Potencial
                                   </Text>
                                   <Text size="8" weight="bold" className="text-emerald-900 tracking-tight">
                                        {formatCurrency(grandTotalValue)}
                                   </Text>
                              </Flex>
                         </Box>
                    </Flex>
               )}

               <Box className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                         <thead>
                              <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                                   <th className="px-5 py-4 font-semibold text-gray-500">Produto</th>
                                   <th className="px-5 py-4 font-semibold text-gray-500 text-right">Qtd. Sugerida</th>
                                   <th className="px-5 py-4 font-semibold text-gray-500 text-right">Valor Total Estimado</th>
                                   <th className="px-5 py-4 font-semibold text-gray-500 text-center w-24">Ações</th>
                              </tr>
                         </thead>
                         <tbody>
                              {loading ? (
                                   <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                                             <Spinner size="3" />
                                             <Text as="div" mt="3">Calculando sugestões...</Text>
                                        </td>
                                   </tr>
                              ) : suggestions.length === 0 ? (
                                   <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                                             Não há matérias-primas suficientes ou receitas cadastradas para gerar produção.
                                        </td>
                                   </tr>
                              ) : (
                                   suggestions.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                             <td className="px-5 py-4 font-medium text-gray-900">
                                                  {item.productName}
                                             </td>
                                             <td className="px-5 py-4 text-right">
                                                  <Badge color="indigo" variant="soft" size="2">
                                                       {item.quantity} unidades
                                                  </Badge>
                                             </td>
                                             <td className="px-5 py-4 font-semibold text-emerald-600 text-right">
                                                  {formatCurrency(item.totalValue)}
                                             </td>
                                             <td className="px-5 py-4 text-center">
                                                  <Flex justify="center" gap="2">
                                                       <IconButton
                                                            size="1" variant="ghost" color="indigo"
                                                            className="cursor-pointer"
                                                            title="Fabricar / Receita"
                                                            onClick={() => openMaterials(item.productName)}
                                                       >
                                                            <LightningBoltIcon />
                                                       </IconButton>
                                                       <IconButton
                                                            size="1" variant="ghost" color="red"
                                                            className="cursor-pointer"
                                                            title="Excluir Fabricação"
                                                            onClick={() => handleDeleteFabricacao(item.productName)}
                                                       >
                                                            <TrashIcon />
                                                       </IconButton>
                                                  </Flex>
                                             </td>
                                        </tr>
                                   ))
                              )}
                         </tbody>
                    </table>
               </Box>

               <ProductManufacturingModal
                    open={materialsOpen}
                    product={materialsTarget}
                    allProducts={products}
                    onClose={handleCloseModal}
               />
          </Box>
     );
}
