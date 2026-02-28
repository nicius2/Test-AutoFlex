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
     ReloadIcon,
     ArchiveIcon,
     LayersIcon,
} from "@radix-ui/react-icons";
import {
     getRawMaterials,
     createRawMaterial,
     updateRawMaterial,
     deleteRawMaterial,
} from "../api/rawMaterials";
import type { RawMaterial, RawMaterialRequest } from "../types/RawMaterialForm";
import { IdWithCopy } from "../components/IdWithCopy";
import { RawMaterialFormModal } from "../components/RawMaterialFormModal";
import { DeleteConfirmModal } from "../components/DeleteConfirm";
import { StatCard } from "../components/StatCard";

export function RawMaterials() {
     const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState("");
     const [search, setSearch] = useState("");

     const [formOpen, setFormOpen] = useState(false);
     const [editTarget, setEditTarget] = useState<RawMaterial | null>(null);

     const [deleteOpen, setDeleteOpen] = useState(false);
     const [deleteTarget, setDeleteTarget] = useState<RawMaterial | null>(null);

     async function fetchRawMaterials() {
          setLoading(true);
          setError("");
          try {
               const data = await getRawMaterials();
               setRawMaterials(data);
          } catch {
               setError("Não foi possível carregar as matérias-primas. Verifique se a API está rodando.");
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => { fetchRawMaterials(); }, []);

     const filtered = useMemo(() => {
          const q = search.toLowerCase().trim();
          if (!q) return rawMaterials;
          return rawMaterials.filter(
               (p) => p.name.toLowerCase().includes(q) || p.id.toString().includes(q)
          );
     }, [rawMaterials, search]);

     // Stats
     const totalStock = rawMaterials.reduce((sum, p) => sum + p.stockQuantity, 0);

     function openCreate() {
          setEditTarget(null);
          setFormOpen(true);
     }

     function openEdit(rm: RawMaterial) {
          setEditTarget(rm);
          setFormOpen(true);
     }

     function openDelete(rm: RawMaterial) {
          setDeleteTarget(rm); // Reusing DeleteConfirmModal - it might cast it. We can cast as any.
          setDeleteOpen(true);
     }

     async function handleSave(data: RawMaterialRequest) {
          if (editTarget) {
               const updated = await updateRawMaterial(editTarget.id, data);
               setRawMaterials((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          } else {
               const created = await createRawMaterial(data);
               setRawMaterials((prev) => [...prev, created]);
          }
     }

     async function handleDelete() {
          if (!deleteTarget) return;
          await deleteRawMaterial(deleteTarget.id);
          setRawMaterials((prev) => prev.filter((p) => p.id !== deleteTarget.id));
     }

     return (
          <Flex direction="column" gap="6">
               {/* ─── Header ─── */}
               <Flex justify="between" align="center" wrap="wrap" gap="3">
                    <Box>
                         <Text as="div" size="6" weight="bold" className="text-gray-900">
                              Matérias-Primas
                         </Text>
                         <Text as="div" size="2" className="text-gray-400 mt-0.5">
                              Gerencie o estoque e catálogo de matérias-primas.
                         </Text>
                    </Box>
                    <Button size="3" onClick={openCreate} className="cursor-pointer">
                         <PlusIcon /> Nova Matéria-Prima
                    </Button>
               </Flex>

               {/* ─── Stats ─── */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                         label="Total de Tipos"
                         value={rawMaterials.length}
                         icon={<LayersIcon width="20" height="20" className="text-indigo-600" />}
                         iconBg="bg-indigo-50"
                         sub="matérias-primas"
                    />
                    <StatCard
                         label="Estoque Total"
                         value={totalStock}
                         icon={<ArchiveIcon width="20" height="20" className="text-emerald-600" />}
                         iconBg="bg-emerald-50"
                         sub="unidades disponíveis"
                    />
               </div>

               {/* ─── Error Banner ─── */}
               {error && (
                    <Callout.Root color="red">
                         <Callout.Icon><ExclamationTriangleIcon /></Callout.Icon>
                         <Callout.Text>{error}</Callout.Text>
                         <Button size="1" variant="ghost" color="red" onClick={fetchRawMaterials} className="ml-auto cursor-pointer">
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
                                   onClick={fetchRawMaterials}
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
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Qtd Estoque</th>
                                        <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Ações</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {loading ? (
                                        <tr>
                                             <td colSpan={4} className="px-5 py-16 text-center">
                                                  <Flex justify="center" align="center" gap="2" className="text-gray-400">
                                                       <Spinner />
                                                       <Text size="2">Carregando matérias-primas...</Text>
                                                  </Flex>
                                             </td>
                                        </tr>
                                   ) : filtered.length === 0 ? (
                                        <tr>
                                             <td colSpan={4} className="px-5 py-16 text-center">
                                                  <Flex direction="column" align="center" gap="2" className="text-gray-300">
                                                       <LayersIcon width="40" height="40" />
                                                       <Text size="2" className="text-gray-400">
                                                            {search ? "Nenhuma matéria-prima encontrada." : "Nenhuma matéria-prima cadastrada."}
                                                       </Text>
                                                       {!search && (
                                                            <Button size="1" variant="soft" onClick={openCreate} className="cursor-pointer mt-1">
                                                                 <PlusIcon /> Adicionar
                                                            </Button>
                                                       )}
                                                  </Flex>
                                             </td>
                                        </tr>
                                   ) : (
                                        filtered.map((rm, idx) => (
                                             <tr
                                                  key={rm.id}
                                                  className={[
                                                       "border-t border-gray-50 transition-colors hover:bg-gray-50/70",
                                                       idx % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                                                  ].join(" ")}
                                             >
                                                  <td className="px-5 py-3.5">
                                                       <IdWithCopy id={rm.id} />
                                                  </td>
                                                  <td className="px-5 py-3.5">
                                                       <Text size="2" weight="medium" className="text-gray-800">
                                                            {rm.name}
                                                       </Text>
                                                  </td>
                                                  <td className="px-5 py-3.5 text-right">
                                                       <Badge color={rm.stockQuantity === 0 ? 'red' : 'green'} variant="soft">
                                                            <Text size="2" className="font-medium tabular-nums">
                                                                 {rm.stockQuantity} un
                                                            </Text>
                                                       </Badge>
                                                  </td>
                                                  <td className="px-5 py-3.5">
                                                       <Flex justify="center" gap="1">
                                                            <IconButton
                                                                 size="1" variant="ghost" color="gray"
                                                                 className="cursor-pointer"
                                                                 title="Editar"
                                                                 onClick={() => openEdit(rm)}
                                                            >
                                                                 <Pencil1Icon />
                                                            </IconButton>
                                                            <IconButton
                                                                 size="1" variant="ghost" color="red"
                                                                 className="cursor-pointer"
                                                                 title="Excluir"
                                                                 onClick={() => openDelete(rm)}
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
               <RawMaterialFormModal
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSave={handleSave}
                    initial={editTarget}
               />

               <DeleteConfirmModal
                    open={deleteOpen}
                    product={deleteTarget as any}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={handleDelete}
               />
          </Flex>
     );
}
