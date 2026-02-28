import { useEffect, useState, useMemo } from "react";
import {
     Flex,
     Box,
     Text,
     Button,
     TextField,
     IconButton,
     Badge,
     Spinner,
     Callout,
} from "@radix-ui/themes";
import {
     PlusIcon,
     MagnifyingGlassIcon,
     Pencil1Icon,
     TrashIcon,
     ExclamationTriangleIcon,
     ArchiveIcon,
     CubeIcon,
     LightningBoltIcon,
     ReloadIcon
} from "@radix-ui/react-icons";
import {
     getProducts,
     createProduct,
     updateProduct,
     deleteProduct,
     type Product,
     type ProductRequest,
} from "../api/products";
import { IdWithCopy } from "../components/IdWithCopy";
import { ProductFormModal } from "../components/ProductFormModal";
import { DeleteConfirmModal } from "../components/DeleteConfirm";
import { ProductManufacturingModal } from "../components/ProductManufacturingModal";
import { StatCard } from "../components/StatCard";

export function Products() {
     const [products, setProducts] = useState<Product[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [search, setSearch] = useState("");

     const [formOpen, setFormOpen] = useState(false);
     const [editTarget, setEditTarget] = useState<Product | null>(null);

     const [materialsOpen, setMaterialsOpen] = useState(false);
     const [materialsTarget, setMaterialsTarget] = useState<Product | null>(null);

     const [deleteOpen, setDeleteOpen] = useState(false);
     const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

     async function fetchProducts() {
          setLoading(true);
          setError("");
          try {
               const data = await getProducts();
               setProducts(data);
          } catch {
               setError("Não foi possível carregar os produtos. Verifique se a API está rodando.");
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => { fetchProducts(); }, []);

     const filtered = useMemo(() => {
          const q = search.toLowerCase().trim();
          if (!q) return products;
          return products.filter(
               (p) => p.name.toLowerCase().includes(q) || p.id.toString().includes(q)
          );
     }, [products, search]);

     // Stats
     const totalValue = products.reduce((sum, p) => sum + p.value, 0);
     const avgValue = products.length ? totalValue / products.length : 0;

     function openCreate() {
          setEditTarget(null);
          setFormOpen(true);
     }

     function openEdit(product: Product) {
          setEditTarget(product);
          setFormOpen(true);
     }

     function openMaterials(product: Product) {
          setMaterialsTarget(product);
          setMaterialsOpen(true);
     }

     function openDelete(product: Product) {
          setDeleteTarget(product);
          setDeleteOpen(true);
     }

     async function handleSave(data: ProductRequest) {
          if (editTarget) {
               const updated = await updateProduct(editTarget.id, data);
               setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          } else {
               const created = await createProduct(data);
               setProducts((prev) => [...prev, created]);
          }
     }

     async function handleDelete() {
          if (!deleteTarget) return;
          await deleteProduct(deleteTarget.id);
          setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
     }

     const fmtCurrency = (v: number) =>
          new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

     return (
          <Flex direction="column" gap="6">
               {/* ─── Header ─── */}
               <Flex justify="between" align="start" wrap="wrap" gap="3">
                    <Box>
                         <Text as="div" size="6" weight="bold" className="text-gray-900">
                              Produtos
                         </Text>
                         <Text as="div" size="2" className="text-gray-400 mt-0.5">
                              Gerencie o catálogo de produtos, preços e especificações.
                         </Text>
                    </Box>
                    <Button size="3" onClick={openCreate} className="cursor-pointer">
                         <PlusIcon /> Novo Produto
                    </Button>
               </Flex>

               {/* ─── Stats ─── */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                         label="Total de Produtos"
                         value={products.length}
                         icon={<ArchiveIcon width="20" height="20" className="text-indigo-600" />}
                         iconBg="bg-indigo-50"
                         sub="cadastrados"
                    />
                    <StatCard
                         label="Valor Total"
                         value={fmtCurrency(totalValue)}
                         icon={<CubeIcon width="20" height="20" className="text-emerald-600" />}
                         iconBg="bg-emerald-50"
                         sub="soma do portfólio"
                    />
                    <StatCard
                         label="Valor Médio"
                         value={fmtCurrency(avgValue)}
                         icon={<CubeIcon width="20" height="20" className="text-amber-600" />}
                         iconBg="bg-amber-50"
                         sub="por produto"
                    />
               </div>

               {/* ─── Error Banner ─── */}
               {error && (
                    <Callout.Root color="red">
                         <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                         <Callout.Text>{error}</Callout.Text>
                         <Button size="1" variant="ghost" color="red" onClick={fetchProducts} className="ml-auto cursor-pointer">
                              <ReloadIcon /> Tentar novamente
                         </Button>
                    </Callout.Root>
               )}

               {/* ─── Table Card ─── */}
               <Box className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <Flex
                         align="center" justify="between" gap="3"
                         className="px-5 py-4 border-b border-gray-100"
                         wrap="wrap"
                    >
                         <TextField.Root
                              placeholder="Buscar por nome ou ID..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full sm:w-72"
                         >
                              <TextField.Slot>
                                   <MagnifyingGlassIcon className="text-gray-400" />
                              </TextField.Slot>
                         </TextField.Root>

                         <Flex align="center" gap="2">
                              <Badge color="gray" variant="soft" radius="full">
                                   {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                              </Badge>
                              <IconButton
                                   variant="soft" color="gray" radius="full"
                                   onClick={fetchProducts}
                                   className="cursor-pointer"
                                   title="Atualizar"
                              >
                                   <ReloadIcon />
                              </IconButton>
                         </Flex>
                    </Flex>

                    {/* Table */}
                    <Box className="overflow-x-auto">
                         <table className="w-full text-sm">
                              <thead>
                                   <tr className="bg-gray-50 text-left">
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">ID</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Valor</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Ações</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {loading ? (
                                        <tr>
                                             <td colSpan={4} className="px-5 py-16 text-center">
                                                  <Flex justify="center" align="center" gap="2" className="text-gray-400">
                                                       <Spinner />
                                                       <Text size="2">Carregando produtos...</Text>
                                                  </Flex>
                                             </td>
                                        </tr>
                                   ) : filtered.length === 0 ? (
                                        <tr>
                                             <td colSpan={4} className="px-5 py-16 text-center">
                                                  <Flex direction="column" align="center" gap="2" className="text-gray-300">
                                                       <ArchiveIcon width="40" height="40" />
                                                       <Text size="2" className="text-gray-400">
                                                            {search ? "Nenhum produto encontrado para a busca." : "Nenhum produto cadastrado ainda."}
                                                       </Text>
                                                       {!search && (
                                                            <Button size="1" variant="soft" onClick={openCreate} className="cursor-pointer mt-1">
                                                                 <PlusIcon /> Adicionar produto
                                                            </Button>
                                                       )}
                                                  </Flex>
                                             </td>
                                        </tr>
                                   ) : (
                                        filtered.map((product, idx) => (
                                             <tr
                                                  key={product.id}
                                                  className={[
                                                       "border-t border-gray-50 transition-colors hover:bg-gray-50/70",
                                                       idx % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                                                  ].join(" ")}
                                             >
                                                  <td className="px-5 py-3.5">
                                                       <IdWithCopy id={product.id} />
                                                  </td>
                                                  <td className="px-5 py-3.5">
                                                       <Text size="2" weight="medium" className="text-gray-800">
                                                            {product.name}
                                                       </Text>
                                                  </td>
                                                  <td className="px-5 py-3.5 text-right">
                                                       <Text size="2" className="text-gray-700 font-medium tabular-nums">
                                                            {fmtCurrency(product.value)}
                                                       </Text>
                                                  </td>
                                                  <td className="px-5 py-3.5">
                                                       <Flex justify="center" gap="1">
                                                            <IconButton
                                                                 size="1" variant="ghost" color="indigo"
                                                                 className="cursor-pointer"
                                                                 title="Fabricar / Receita"
                                                                 onClick={() => openMaterials(product)}
                                                            >
                                                                 <LightningBoltIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                 size="1" variant="ghost" color="gray"
                                                                 className="cursor-pointer"
                                                                 title="Editar"
                                                                 onClick={() => openEdit(product)}
                                                            >
                                                                 <Pencil1Icon />
                                                            </IconButton>
                                                            <IconButton
                                                                 size="1" variant="ghost" color="red"
                                                                 className="cursor-pointer"
                                                                 title="Excluir"
                                                                 onClick={() => openDelete(product)}
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
               </Box>

               {/* ─── Modals ─── */}
               <ProductFormModal
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSave={handleSave}
                    initial={editTarget}
               />

               <ProductManufacturingModal
                    open={materialsOpen}
                    product={materialsTarget}
                    onClose={() => setMaterialsOpen(false)}
               />

               <DeleteConfirmModal
                    open={deleteOpen}
                    product={deleteTarget}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
               />
          </Flex>
     );
}