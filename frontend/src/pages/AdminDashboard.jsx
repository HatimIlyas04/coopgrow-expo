// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { getUser, getToken, logout } from "../utils/auth";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";



// export default function AdminDashboard() {
//   const nav = useNavigate();
//   const token = getToken();
//   const user = getUser();


//   const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

//   const [tab, setTab] = useState("stats"); // stats | pendingUsers | pendingStands | users | stands | products
//   const [loading, setLoading] = useState(true);
//   const [msg, setMsg] = useState("");
  


//   const handleAuthError = (err) => {
//     const status = err?.response?.status;
//     if (status === 401 || status === 403) {
//       logout();
//       nav("/login");
//       return true;
//     }
//     return false;
//   };

//   // Data
//   const [stats, setStats] = useState(null);

//   const [usersPending, setUsersPending] = useState([]);
//   const [standsPending, setStandsPending] = useState([]);

//   const [usersAll, setUsersAll] = useState([]);
//   const [standsAll, setStandsAll] = useState([]);
//   const [productsAll, setProductsAll] = useState([]);

//   // Search
//   const [qUsers, setQUsers] = useState("");
//   const [qStands, setQStands] = useState("");
//   const [qProducts, setQProducts] = useState("");

//   // Modals edit
//   const [openStandEdit, setOpenStandEdit] = useState(false);
//   const [standEdit, setStandEdit] = useState(null);

//   const [openProdEdit, setOpenProdEdit] = useState(false);
//   const [prodEdit, setProdEdit] = useState(null);

//   // Action loading
//   const [busy, setBusy] = useState({ scope: null, id: null });

//   /* ---------------- Fetchers ---------------- */

//   const fetchStats = async () => {
//     const { data } = await api.get("/admin/stats", { headers });
//     setStats(data);
//   };

//   const fetchPendingUsers = async () => {
//     const { data } = await api.get("/admin/users/pending", { headers });
//     setUsersPending(Array.isArray(data) ? data : []);
//   };

//   const fetchPendingStands = async () => {
//     const { data } = await api.get("/admin/stands/pending", { headers });
//     setStandsPending(Array.isArray(data) ? data : []);
//   };

//   const fetchAllUsers = async () => {
//     const { data } = await api.get("/admin/users/all", { headers });
//     setUsersAll(Array.isArray(data) ? data : []);
//   };

//   const fetchAllStands = async () => {
//     const { data } = await api.get("/admin/stands/all", { headers });
//     setStandsAll(Array.isArray(data) ? data : []);
//   };

//   const fetchAllProducts = async () => {
//     const { data } = await api.get("/admin/products/all", { headers });
//     setProductsAll(Array.isArray(data) ? data : []);
//   };

//   const refreshAll = async () => {
//     setLoading(true);
//     setMsg("");
//     try {
//       const results = await Promise.allSettled([
//   fetchStats(),
//   fetchPendingUsers(),
//   fetchPendingStands(),
//   fetchAllUsers(),
//   fetchAllStands(),
//   fetchAllProducts(),
// ]);

// const failed = results.filter((r) => r.status === "rejected");

// if (failed.length > 0) {
//   console.error("Admin dashboard partial errors:", failed);
//   setMsg("بعض البيانات ما تحمّلاتش، ولكن الداشبورد خدام.");
// }
//       toast.success("✅ Dashboard chargé avec succès !");
//     } catch (err) {
//       if (!handleAuthError(err)) {
//         const m = err?.response?.data?.message || "Erreur chargement Admin";
//         setMsg(m);
//         toast.error(m);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) return nav("/login");
//     if (user?.role !== "ADMIN") return nav("/coop");
//     refreshAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* ---------------- Actions: Approve/Reject ---------------- */

//   const decideUser = async (id, type) => {
//     setBusy({ scope: "usersPending", id });
//     try {
//       await api.put(`/admin/users/${id}/${type}`, null, { headers });
//       toast.success(type === "approve" ? "✅ Coopérative approuvée !" : "⛔ Coopérative rejetée !");
//       await Promise.all([fetchPendingUsers(), fetchAllUsers(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur action user");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   const decideStand = async (id, type) => {
//     setBusy({ scope: "standsPending", id });
//     try {
//       await api.put(`/admin/stands/${id}/${type}`, null, { headers });
//       toast.success(type === "approve" ? "✅ Stand approuvé !" : "⛔ Stand rejeté !");
//       await Promise.all([fetchPendingStands(), fetchAllStands(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur action stand");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   /* ---------------- Actions: Edit/Delete Stand ---------------- */

//   const updateStand = async () => {
//     if (!standEdit?.id) return;
//     setBusy({ scope: "standsAll", id: standEdit.id });
//     try {
//       await api.put(`/admin/stands/${standEdit.id}`, standEdit, { headers });
//       toast.success("✅ Stand modifié !");
//       setOpenStandEdit(false);
//       setStandEdit(null);
//       await Promise.all([fetchAllStands(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur modification stand");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   const deleteStand = async (id) => {
//     if (!confirm("Supprimer ce stand ? (Produits seront supprimés)")) return;
//     setBusy({ scope: "standsAll", id });
//     try {
//       await api.delete(`/admin/stands/${id}`, { headers });
//       toast.success("✅ Stand supprimé !");
//       await Promise.all([fetchAllStands(), fetchAllProducts(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur suppression stand");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   /* ---------------- Actions: Edit/Delete Product ---------------- */

//   const updateProduct = async () => {
//     if (!prodEdit?.id) return;
//     setBusy({ scope: "productsAll", id: prodEdit.id });
//     try {
//       await api.put(`/admin/products/${prodEdit.id}`, prodEdit, { headers });
//       toast.success("✅ Produit modifié !");
//       setOpenProdEdit(false);
//       setProdEdit(null);
//       await Promise.all([fetchAllProducts(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur modification produit");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (!confirm("Supprimer ce produit ?")) return;
//     setBusy({ scope: "productsAll", id });
//     try {
//       await api.delete(`/admin/products/${id}`, { headers });
//       toast.success("✅ Produit supprimé !");
//       await Promise.all([fetchAllProducts(), fetchStats()]);
//     } catch (err) {
//       if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur suppression produit");
//     } finally {
//       setBusy({ scope: null, id: null });
//     }
//   };

//   /* ---------------- Filters ---------------- */

//   const usersFiltered = useMemo(() => {
//     const t = qUsers.trim().toLowerCase();
//     if (!t) return usersAll;
//     return usersAll.filter((u) =>
//       `${u.full_name || ""} ${u.email || ""} ${u.city || ""} ${u.role || ""}`.toLowerCase().includes(t)
//     );
//   }, [usersAll, qUsers]);

//   const standsFiltered = useMemo(() => {
//     const t = qStands.trim().toLowerCase();
//     if (!t) return standsAll;
//     return standsAll.filter((s) =>
//       `${s.stand_name || ""} ${s.city || ""} ${s.category || ""} ${s.full_name || ""}`.toLowerCase().includes(t)
//     );
//   }, [standsAll, qStands]);

//   const productsFiltered = useMemo(() => {
//     const t = qProducts.trim().toLowerCase();
//     if (!t) return productsAll;
//     return productsAll.filter((p) =>
//       `${p.title || ""} ${p.stand_name || ""} ${p.description || ""}`.toLowerCase().includes(t)
//     );
//   }, [productsAll, qProducts]);

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f4f0ff] via-white to-[#f7f5ff]">
//       <div className="max-w-7xl mx-auto px-6 py-10">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//           <div>
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm">
//               <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
//               <p className="text-xs font-black uppercase tracking-[0.20em] text-violet-700">
//                 Administrateur • Accès total
//               </p>
//             </div>

//             <h1 className="mt-4 text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
//               Dashboard Administrateur
//             </h1>

//             <p className="mt-2 text-gray-600 max-w-2xl">
//               Gestion complète du site : validation, modification, suppression et statistiques.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <button
//               onClick={refreshAll}
//               className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition shadow-soft"
//             >
//               Rafraîchir
//             </button>

//             <button
//               onClick={() => {
//                 logout();
//                 nav("/login");
//               }}
//               className="px-6 py-3 rounded-2xl font-black bg-white border border-red-200 text-red-700 hover:bg-red-50 transition shadow-soft"
//             >
//               Déconnexion
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         {stats && (
//           <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <StatCard label="Coopératives actives" value={stats.coops} hint="Coops validées" />
//             <StatCard label="Stands publiés" value={stats.stands} hint="Visibles" />
//             <StatCard label="Produits" value={stats.products} hint="Total" />
//             <StatCard label="Coops en attente" value={stats.pendingCoops} hint="À valider" />
//           </div>
//         )}

//         {/* PENDING Alerts */}
//         <div className="mt-6 grid lg:grid-cols-2 gap-4">
//           <PendingMiniCard
//             title="Coopératives en attente"
//             value={usersPending.length}
//             sub="Validez ou rejetez les inscriptions"
//             onGo={() => setTab("pendingUsers")}
//           />
//           <PendingMiniCard
//             title="Stands en attente"
//             value={standsPending.length}
//             sub="Publiez ou rejetez les stands"
//             onGo={() => setTab("pendingStands")}
//           />
//         </div>

//         {/* Tabs */}
//         <div className="mt-8 flex flex-wrap gap-3">
//           <TabBtn active={tab === "stats"} onClick={() => setTab("stats")}>📊 Statistiques</TabBtn>

//           <TabBtn active={tab === "pendingUsers"} onClick={() => setTab("pendingUsers")}>
//             ⏳ Coopératives en attente
//           </TabBtn>

//           <TabBtn active={tab === "pendingStands"} onClick={() => setTab("pendingStands")}>
//             ⏳ Stands en attente
//           </TabBtn>

//           <TabBtn active={tab === "users"} onClick={() => setTab("users")}>👥 Tous les utilisateurs</TabBtn>
//           <TabBtn active={tab === "stands"} onClick={() => setTab("stands")}>🏪 Tous les stands</TabBtn>
//           <TabBtn active={tab === "products"} onClick={() => setTab("products")}>🧺 Tous les produits</TabBtn>
//         </div>

//         {msg && (
//           <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
//             {msg}
//           </div>
//         )}

//         {loading ? (
//           <Box>
//             <div className="flex items-center gap-3">
//               <span className="w-3 h-3 rounded-full bg-violet-600 animate-pulse" />
//               <p className="font-black text-gray-700">Chargement du dashboard...</p>
//             </div>
//           </Box>
//         ) : tab === "stats" ? (
//           <StatsView stats={stats} />
//         ) : tab === "pendingUsers" ? (
//           <PendingUsersView users={usersPending} decideUser={decideUser} busy={busy} />
//         ) : tab === "pendingStands" ? (
//           <PendingStandsView stands={standsPending} decideStand={decideStand} busy={busy} />
//         ) : tab === "users" ? (
//           <UsersView users={usersFiltered} q={qUsers} setQ={setQUsers} />
//         ) : tab === "stands" ? (
//           <StandsView
//             stands={standsFiltered}
//             q={qStands}
//             setQ={setQStands}
//             busy={busy}
//             onEdit={(s) => {
//               setStandEdit({ ...s });
//               setOpenStandEdit(true);
//             }}
//             onDelete={deleteStand}
//           />
//         ) : (
//           <ProductsView
//             products={productsFiltered}
//             q={qProducts}
//             setQ={setQProducts}
//             busy={busy}
//             onEdit={(p) => {
//               setProdEdit({ ...p });
//               setOpenProdEdit(true);
//             }}
//             onDelete={deleteProduct}
//           />
//         )}
//       </div>

//       {/* MODAL: EDIT STAND */}
//       {openStandEdit && standEdit && (
//         <Modal onClose={() => setOpenStandEdit(false)}>
//           <ModalHeader
//             title={`Modifier le stand #${standEdit.id}`}
//             subtitle={standEdit.stand_name}
//             onClose={() => setOpenStandEdit(false)}
//           />
//           <div className="p-6 grid gap-3">
//             <Input label="Nom du stand" value={standEdit.stand_name || ""} onChange={(v) => setStandEdit((s) => ({ ...s, stand_name: v }))} />
//             <div className="grid md:grid-cols-2 gap-3">
//               <Input label="Ville" value={standEdit.city || ""} onChange={(v) => setStandEdit((s) => ({ ...s, city: v }))} />
//               <Input label="Catégorie" value={standEdit.category || ""} onChange={(v) => setStandEdit((s) => ({ ...s, category: v }))} />
//             </div>
//             <Input label="Adresse" value={standEdit.address || ""} onChange={(v) => setStandEdit((s) => ({ ...s, address: v }))} />
//             <Textarea label="Description" value={standEdit.description || ""} onChange={(v) => setStandEdit((s) => ({ ...s, description: v }))} />

//             <div className="flex gap-3 mt-2">
//               <button
//                 onClick={updateStand}
//                 className="flex-1 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
//               >
//                 Enregistrer
//               </button>
//               <button
//                 onClick={() => setOpenStandEdit(false)}
//                 className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* MODAL: EDIT PRODUCT */}
//       {openProdEdit && prodEdit && (
//         <Modal onClose={() => setOpenProdEdit(false)}>
//           <ModalHeader
//             title={`Modifier le produit #${prodEdit.id}`}
//             subtitle={prodEdit.title}
//             onClose={() => setOpenProdEdit(false)}
//           />
//           <div className="p-6 grid gap-3">
//             <Input label="Titre" value={prodEdit.title || ""} onChange={(v) => setProdEdit((p) => ({ ...p, title: v }))} />
//             <Input label="Prix (DH)" value={prodEdit.price ?? ""} onChange={(v) => setProdEdit((p) => ({ ...p, price: v }))} />
//             <Textarea label="Description" value={prodEdit.description || ""} onChange={(v) => setProdEdit((p) => ({ ...p, description: v }))} />

//             <div className="flex gap-3 mt-2">
//               <button
//                 onClick={updateProduct}
//                 className="flex-1 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
//               >
//                 Enregistrer
//               </button>
//               <button
//                 onClick={() => setOpenProdEdit(false)}
//                 className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ---------------- SUB VIEWS ---------------- */

// function StatsView({ stats }) {
//   if (!stats) return <Box>Aucune donnée.</Box>;

//   const cards = [
//     { label: "Coopératives actives", value: stats.coops },
//     { label: "Coopératives en attente", value: stats.pendingCoops },
//     { label: "Stands publiés", value: stats.stands },
//     { label: "Stands en attente", value: stats.pendingStands },
//     { label: "Produits", value: stats.products },
//     { label: "Demandes totales", value: stats.requests },
//     { label: "Demandes NEW", value: stats.newRequests },
//   ];

//   return (
//     <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//       {cards.map((c, i) => (
//         <div key={i} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-fuchsia-50/40 pointer-events-none" />
//           <div className="relative">
//             <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{c.label}</p>
//             <p className="text-4xl font-black text-gray-900 mt-3">{c.value}</p>
//             <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
//               <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-violet-600 to-purple-700" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function PendingUsersView({ users, decideUser, busy }) {
//   return (
//     <Box>
//       <HeaderBlock
//         title="Coopératives en attente"
//         sub="Approuver ou rejeter les nouvelles coopératives."
//         count={users.length}
//       />

//       <div className="mt-6 grid md:grid-cols-2 gap-5">
//         {users.length === 0 ? (
//           <EmptyBox text="Aucune coopérative en attente." />
//         ) : (
//           users.map((u) => {
//             const isBusy = busy.scope === "usersPending" && busy.id === u.id;
//             return (
//               <Card key={u.id} title={u.full_name} subtitle={u.email} badge={`#${u.id}`}>
//                 <div className="grid grid-cols-2 gap-3 text-sm mt-4">
//                   <Info label="Ville" value={u.city || "—"} />
//                   <Info label="Téléphone" value={u.phone || "—"} />
//                   <Info label="WhatsApp" value={u.whatsapp || "—"} />
//                   <Info label="Créé le" value={formatDate(u.created_at)} />
//                 </div>

//                 <div className="mt-6 flex gap-3 flex-wrap">
//                   <ActionBtn green disabled={isBusy} onClick={() => decideUser(u.id, "approve")}>
//                     {isBusy ? "Traitement..." : "Approuver"}
//                   </ActionBtn>
//                   <ActionBtn red disabled={isBusy} onClick={() => decideUser(u.id, "reject")}>
//                     {isBusy ? "Traitement..." : "Rejeter"}
//                   </ActionBtn>
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </Box>
//   );
// }

// function PendingStandsView({ stands, decideStand, busy }) {
//   return (
//     <Box>
//       <HeaderBlock title="Stands en attente" sub="Approuver ou rejeter les stands." count={stands.length} />

//       <div className="mt-6 grid md:grid-cols-2 gap-5">
//         {stands.length === 0 ? (
//           <EmptyBox text="Aucun stand en attente." />
//         ) : (
//           stands.map((s) => {
//             const isBusy = busy.scope === "standsPending" && busy.id === s.id;
//             return (
//               <Card key={s.id} title={s.stand_name} subtitle={s.full_name || "Coopérative"} badge={`#${s.id}`}>
//                 <p className="text-sm text-gray-700 mt-4 line-clamp-3">{s.description || "—"}</p>
//                 <div className="grid grid-cols-2 gap-3 text-sm mt-4">
//                   <Info label="Ville" value={s.city || "—"} />
//                   <Info label="Catégorie" value={s.category || "—"} />
//                   <Info label="Téléphone" value={s.phone || "—"} />
//                   <Info label="WhatsApp" value={s.whatsapp || "—"} />
//                 </div>

//                 <div className="mt-6 flex gap-3 flex-wrap">
//                   <ActionBtn green disabled={isBusy} onClick={() => decideStand(s.id, "approve")}>
//                     {isBusy ? "Traitement..." : "Approuver"}
//                   </ActionBtn>
//                   <ActionBtn red disabled={isBusy} onClick={() => decideStand(s.id, "reject")}>
//                     {isBusy ? "Traitement..." : "Rejeter"}
//                   </ActionBtn>
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </Box>
//   );
// }

// function UsersView({ users, q, setQ }) {
//   return (
//     <Box>
//       <HeaderBlock title="Tous les utilisateurs" sub="Vue complète des comptes et rôles." count={users.length} />
//       <SearchBar value={q} onChange={setQ} placeholder="Rechercher un utilisateur (nom, email, ville, rôle...)" />

//       <div className="mt-6 grid md:grid-cols-2 gap-5">
//         {users.length === 0 ? (
//           <EmptyBox text="Aucun utilisateur." />
//         ) : (
//           users.map((u) => (
//             <Card key={u.id} title={u.full_name} subtitle={u.email} badge={`${u.role} #${u.id}`}>
//               <div className="grid grid-cols-2 gap-3 text-sm mt-4">
//                 <Info label="Ville" value={u.city || "—"} />
//                 <Info label="Téléphone" value={u.phone || "—"} />
//                 <Info label="WhatsApp" value={u.whatsapp || "—"} />
//                 <Info label="Créé le" value={formatDate(u.created_at)} />
//               </div>
//             </Card>
//           ))
//         )}
//       </div>
//     </Box>
//   );
// }

// function StandsView({ stands, q, setQ, busy, onEdit, onDelete }) {
//   return (
//     <Box>
//       <HeaderBlock title="Tous les stands" sub="Modifier ou supprimer les stands publiés." count={stands.length} />
//       <SearchBar value={q} onChange={setQ} placeholder="Rechercher un stand (nom, ville, catégorie...)" />

//       <div className="mt-6 grid md:grid-cols-2 gap-5">
//         {stands.length === 0 ? (
//           <EmptyBox text="Aucun stand." />
//         ) : (
//           stands.map((s) => {
//             const isBusy = busy.scope === "standsAll" && busy.id === s.id;
//             return (
//               <Card key={s.id} title={s.stand_name} subtitle={s.full_name || "Coopérative"} badge={`#${s.id}`}>
//                 <p className="text-sm text-gray-700 mt-4 line-clamp-3">{s.description || "—"}</p>
//                 <div className="grid grid-cols-2 gap-3 text-sm mt-4">
//                   <Info label="Ville" value={s.city || "—"} />
//                   <Info label="Catégorie" value={s.category || "—"} />
//                   <Info label="Téléphone" value={s.phone || "—"} />
//                   <Info label="WhatsApp" value={s.whatsapp || "—"} />
//                 </div>

//                 <div className="mt-6 flex gap-3 flex-wrap">
//                   <ActionBtn green disabled={isBusy} onClick={() => onEdit(s)}>
//                     {isBusy ? "..." : "Modifier"}
//                   </ActionBtn>
//                   <ActionBtn danger disabled={isBusy} onClick={() => onDelete(s.id)}>
//                     {isBusy ? "..." : "Supprimer"}
//                   </ActionBtn>
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </Box>
//   );
// }

// function ProductsView({ products, q, setQ, busy, onEdit, onDelete }) {
//   return (
//     <Box>
//       <HeaderBlock title="Tous les produits" sub="Modifier ou supprimer les produits." count={products.length} />
//       <SearchBar value={q} onChange={setQ} placeholder="Rechercher un produit (titre, stand...)" />

//       <div className="mt-6 grid md:grid-cols-2 gap-5">
//         {products.length === 0 ? (
//           <EmptyBox text="Aucun produit." />
//         ) : (
//           products.map((p) => {
//             const isBusy = busy.scope === "productsAll" && busy.id === p.id;
//             return (
//               <Card key={p.id} title={p.title} subtitle={`Stand: ${p.stand_name || "—"}`} badge={`#${p.id}`}>
//                 <p className="text-sm text-gray-700 mt-4 line-clamp-3">{p.description || "—"}</p>
//                 <div className="grid grid-cols-2 gap-3 text-sm mt-4">
//                   <Info label="Prix" value={p.price != null ? `${p.price} DH` : "—"} />
//                   <Info label="Stand" value={p.stand_name || "—"} />
//                 </div>

//                 <div className="mt-6 flex gap-3 flex-wrap">
//                   <ActionBtn green disabled={isBusy} onClick={() => onEdit(p)}>
//                     {isBusy ? "..." : "Modifier"}
//                   </ActionBtn>
//                   <ActionBtn danger disabled={isBusy} onClick={() => onDelete(p.id)}>
//                     {isBusy ? "..." : "Supprimer"}
//                   </ActionBtn>
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </Box>
//   );
// }

// /* ---------------- UI COMPONENTS ---------------- */

// function TabBtn({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-5 py-2.5 rounded-xl font-black text-sm border transition ${
//         active
//           ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white border-transparent shadow-md"
//           : "bg-white text-[#41217f] border-[#dccfe2] hover:bg-[#f3eefe]"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function PendingMiniCard({ title, value, sub, onGo }) {
//   return (
//     <div className="rounded-3xl border border-black/5 bg-white shadow-soft p-6 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-fuchsia-50/30 pointer-events-none" />
//       <div className="relative flex items-center justify-between gap-4">
//         <div>
//           <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{title}</p>
//           <p className="text-4xl font-black text-gray-900 mt-2">{value}</p>
//           <p className="text-sm text-gray-600 mt-2">{sub}</p>
//         </div>
//         <button
//           onClick={onGo}
//           className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
//         >
//           Voir →
//         </button>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, hint }) {
//   return (
//     <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-fuchsia-50/40 pointer-events-none" />
//       <div className="relative">
//         <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{label}</p>
//         <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
//         {hint && <p className="text-sm text-gray-600 mt-1">{hint}</p>}
//       </div>
//     </div>
//   );
// }

// function HeaderBlock({ title, sub, count }) {
//   return (
//     <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
//       <div>
//         <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
//         <p className="text-gray-600 mt-1">{sub}</p>
//       </div>
//       <span className="px-4 py-2 rounded-full bg-[#f7f3fb] border border-[#dccfe2] text-sm font-black text-[#41217f]">
//         Total: {count}
//       </span>
//     </div>
//   );
// }

// function SearchBar({ value, onChange, placeholder }) {
//   return (
//     <div className="mt-5 rounded-3xl border border-black/5 bg-white shadow-soft p-4">
//       <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Recherche</p>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="mt-2 w-full px-4 py-3 rounded-2xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
//       />
//     </div>
//   );
// }

// function Box({ children }) {
//   return <div className="mt-7 rounded-[28px] border border-black/5 bg-white shadow-soft p-6">{children}</div>;
// }

// function EmptyBox({ text }) {
//   return (
//     <div className="rounded-3xl border border-dashed border-violet-200 bg-[#f7f3fb] p-10 text-center shadow-soft">
//       <p className="text-lg font-black text-[#1f1633]">{text}</p>
//       <p className="text-sm text-gray-600 mt-1">Rien à afficher pour le moment.</p>
//     </div>
//   );
// }

// function Card({ title, subtitle, badge, children }) {
//   return (
//     <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-fuchsia-50/40 pointer-events-none" />
//       <div className="relative">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{subtitle}</p>
//             <h3 className="text-2xl font-black text-gray-900 mt-1">{title}</h3>
//           </div>
//           <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-black">{badge}</span>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
//       <p className="text-[11px] uppercase font-black tracking-[0.14em] text-gray-500">{label}</p>
//       <p className="text-gray-800 font-semibold mt-1 break-words">{value}</p>
//     </div>
//   );
// }

// function ActionBtn({ green, red, danger, disabled, onClick, children }) {
//   const base = "px-4 py-2.5 rounded-xl font-black shadow-md transition disabled:opacity-60";
//   const cls = green
//     ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-95"
//     : "bg-white border border-red-200 text-red-700 hover:bg-red-50";

//   return (
//     <button disabled={disabled} onClick={onClick} className={`${base} ${cls}`}>
//       {children}
//     </button>
//   );
// }

// function ModalHeader({ title, subtitle, onClose }) {
//   return (
//     <div className="p-6 border-b border-black/5 flex items-start justify-between gap-4 bg-gradient-to-r from-violet-50 to-white">
//       <div>
//         <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{title}</p>
//         <h3 className="text-2xl font-black text-gray-900 mt-2">{subtitle}</h3>
//       </div>
//       <button onClick={onClose} className="px-3 py-2 rounded-xl border border-black/10 font-black hover:bg-gray-50">
//         ✕
//       </button>
//     </div>
//   );
// }

// function Modal({ children, onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-5">
//       <button onClick={onClose} className="fixed inset-0 cursor-default" aria-label="close" />
//       <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }

// function Input({ label, value, onChange }) {
//   return (
//     <div>
//       {label && <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</p>}
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="mt-1 w-full px-4 py-3 rounded-xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
//       />
//     </div>
//   );
// }

// function Textarea({ label, value, onChange }) {
//   return (
//     <div>
//       {label && <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</p>}
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         rows={4}
//         className="mt-1 w-full px-4 py-3 rounded-xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
//       />
//     </div>
//   );
// }

// function formatDate(d) {
//   if (!d) return "—";
//   try {
//     return new Date(d).toLocaleString("fr-FR");
//   } catch {
//     return "—";
//   }
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUser, getToken, logout } from "../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const nav = useNavigate();
  const token = getToken();
  const user = getUser();

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const handleAuthError = (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      logout();
      nav("/login");
      return true;
    }
    return false;
  };

  // Data states
  const [stats, setStats] = useState(null);
  const [usersPending, setUsersPending] = useState([]);
  const [standsPending, setStandsPending] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
  const [standsAll, setStandsAll] = useState([]);
  const [productsAll, setProductsAll] = useState([]);

  // Search states
  const [qUsers, setQUsers] = useState("");
  const [qStands, setQStands] = useState("");
  const [qProducts, setQProducts] = useState("");

  // Modals
  const [openStandEdit, setOpenStandEdit] = useState(false);
  const [standEdit, setStandEdit] = useState(null);
  const [openProdEdit, setOpenProdEdit] = useState(false);
  const [prodEdit, setProdEdit] = useState(null);

  // Action loading
  const [busy, setBusy] = useState({ scope: null, id: null });

  // Fetchers
  const fetchStats = async () => {
    const { data } = await api.get("/admin/stats", { headers });
    setStats(data);
  };

  const fetchPendingUsers = async () => {
    const { data } = await api.get("/admin/users/pending", { headers });
    setUsersPending(Array.isArray(data) ? data : []);
  };

  const fetchPendingStands = async () => {
    const { data } = await api.get("/admin/stands/pending", { headers });
    setStandsPending(Array.isArray(data) ? data : []);
  };

  const fetchAllUsers = async () => {
    const { data } = await api.get("/admin/users/all", { headers });
    setUsersAll(Array.isArray(data) ? data : []);
  };

  const fetchAllStands = async () => {
    const { data } = await api.get("/admin/stands/all", { headers });
    setStandsAll(Array.isArray(data) ? data : []);
  };

  const fetchAllProducts = async () => {
    const { data } = await api.get("/admin/products/all", { headers });
    setProductsAll(Array.isArray(data) ? data : []);
  };

  const refreshAll = async () => {
    setLoading(true);
    setMsg("");
    try {
      const results = await Promise.allSettled([
        fetchStats(),
        fetchPendingUsers(),
        fetchPendingStands(),
        fetchAllUsers(),
        fetchAllStands(),
        fetchAllProducts(),
      ]);

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.error("Admin dashboard partial errors:", failed);
        setMsg("Certaines données n'ont pas pu être chargées.");
      }
      toast.success("✅ Dashboard actualisé avec succès");
    } catch (err) {
      if (!handleAuthError(err)) {
        const m = err?.response?.data?.message || "Erreur de chargement";
        setMsg(m);
        toast.error(m);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return nav("/login");
    if (user?.role !== "ADMIN") return nav("/coop");
    refreshAll();
  }, []);

  // Actions
  const decideUser = async (id, type) => {
    setBusy({ scope: "usersPending", id });
    try {
      await api.put(`/admin/users/${id}/${type}`, null, { headers });
      toast.success(type === "approve" ? "✅ Coopérative approuvée" : "⛔ Coopérative rejetée");
      await Promise.all([fetchPendingUsers(), fetchAllUsers(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const decideStand = async (id, type) => {
    setBusy({ scope: "standsPending", id });
    try {
      await api.put(`/admin/stands/${id}/${type}`, null, { headers });
      toast.success(type === "approve" ? "✅ Stand approuvé" : "⛔ Stand rejeté");
      await Promise.all([fetchPendingStands(), fetchAllStands(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const updateStand = async () => {
    if (!standEdit?.id) return;
    setBusy({ scope: "standsAll", id: standEdit.id });
    try {
      await api.put(`/admin/stands/${standEdit.id}`, standEdit, { headers });
      toast.success("✅ Stand modifié");
      setOpenStandEdit(false);
      setStandEdit(null);
      await Promise.all([fetchAllStands(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const deleteStand = async (id) => {
    if (!confirm("Supprimer ce stand ?")) return;
    setBusy({ scope: "standsAll", id });
    try {
      await api.delete(`/admin/stands/${id}`, { headers });
      toast.success("✅ Stand supprimé");
      await Promise.all([fetchAllStands(), fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const updateProduct = async () => {
    if (!prodEdit?.id) return;
    setBusy({ scope: "productsAll", id: prodEdit.id });
    try {
      await api.put(`/admin/products/${prodEdit.id}`, prodEdit, { headers });
      toast.success("✅ Produit modifié");
      setOpenProdEdit(false);
      setProdEdit(null);
      await Promise.all([fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setBusy({ scope: "productsAll", id });
    try {
      await api.delete(`/admin/products/${id}`, { headers });
      toast.success("✅ Produit supprimé");
      await Promise.all([fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  // Filters
  const usersFiltered = useMemo(() => {
    const t = qUsers.trim().toLowerCase();
    if (!t) return usersAll;
    return usersAll.filter((u) =>
      `${u.full_name || ""} ${u.email || ""} ${u.city || ""} ${u.role || ""}`.toLowerCase().includes(t)
    );
  }, [usersAll, qUsers]);

  const standsFiltered = useMemo(() => {
    const t = qStands.trim().toLowerCase();
    if (!t) return standsAll;
    return standsAll.filter((s) =>
      `${s.stand_name || ""} ${s.city || ""} ${s.category || ""} ${s.full_name || ""}`.toLowerCase().includes(t)
    );
  }, [standsAll, qStands]);

  const productsFiltered = useMemo(() => {
    const t = qProducts.trim().toLowerCase();
    if (!t) return productsAll;
    return productsAll.filter((p) =>
      `${p.title || ""} ${p.stand_name || ""} ${p.description || ""}`.toLowerCase().includes(t)
    );
  }, [productsAll, qProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8ff] via-white to-[#f5f0ff]">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-violet-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-700">
                Administration • Accès total
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Tableau de bord
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                Administrateur
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Gérez l'ensemble de la plateforme : validations, modifications, statistiques et utilisateurs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={refreshAll}
              className="px-6 py-3 rounded-xl font-semibold bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-all duration-300 shadow-sm hover:shadow group"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </span>
            </button>

            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="px-6 py-3 rounded-xl font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <StatCard
              icon="🏢"
              label="Coopératives actives"
              value={stats.coops}
              trend="+2 cette semaine"
              color="violet"
            />
            <StatCard
              icon="🏪"
              label="Stands publiés"
              value={stats.stands}
              trend={`${stats.pendingStands} en attente`}
              color="fuchsia"
            />
            <StatCard
              icon="📦"
              label="Produits"
              value={stats.products}
              trend="Total catalogue"
              color="purple"
            />
            <StatCard
              icon="⏳"
              label="En attente"
              value={stats.pendingCoops}
              trend={`${stats.pendingStands} stands`}
              color="amber"
            />
          </div>
        )}

        {/* Pending Alerts */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <PendingCard
            title="Coopératives en attente"
            count={usersPending.length}
            subtitle="Inscriptions à valider"
            icon="👥"
            onClick={() => setTab("pendingUsers")}
            color="violet"
          />
          <PendingCard
            title="Stands en attente"
            count={standsPending.length}
            subtitle="Nouveaux stands à examiner"
            icon="🏪"
            onClick={() => setTab("pendingStands")}
            color="fuchsia"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton active={tab === "stats"} onClick={() => setTab("stats")}>
            📊 Vue d'ensemble
          </TabButton>
          <TabButton active={tab === "pendingUsers"} onClick={() => setTab("pendingUsers")}>
            ⏳ Coops en attente
          </TabButton>
          <TabButton active={tab === "pendingStands"} onClick={() => setTab("pendingStands")}>
            ⏳ Stands en attente
          </TabButton>
          <TabButton active={tab === "users"} onClick={() => setTab("users")}>
            👥 Utilisateurs
          </TabButton>
          <TabButton active={tab === "stands"} onClick={() => setTab("stands")}>
            🏪 Stands
          </TabButton>
          <TabButton active={tab === "products"} onClick={() => setTab("products")}>
            📦 Produits
          </TabButton>
        </div>

        {msg && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50/90 backdrop-blur-sm px-4 py-3 text-red-700">
            {msg}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {tab === "stats" && <StatsView stats={stats} />}
            {tab === "pendingUsers" && (
              <PendingUsersView users={usersPending} decideUser={decideUser} busy={busy} />
            )}
            {tab === "pendingStands" && (
              <PendingStandsView stands={standsPending} decideStand={decideStand} busy={busy} />
            )}
            {tab === "users" && (
              <UsersView users={usersFiltered} q={qUsers} setQ={setQUsers} />
            )}
            {tab === "stands" && (
              <StandsView
                stands={standsFiltered}
                q={qStands}
                setQ={setQStands}
                busy={busy}
                onEdit={(s) => {
                  setStandEdit({ ...s });
                  setOpenStandEdit(true);
                }}
                onDelete={deleteStand}
              />
            )}
            {tab === "products" && (
              <ProductsView
                products={productsFiltered}
                q={qProducts}
                setQ={setQProducts}
                busy={busy}
                onEdit={(p) => {
                  setProdEdit({ ...p });
                  setOpenProdEdit(true);
                }}
                onDelete={deleteProduct}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <EditStandModal
        open={openStandEdit}
        stand={standEdit}
        onClose={() => setOpenStandEdit(false)}
        onSave={updateStand}
        busy={busy}
        setStand={setStandEdit}
      />

      <EditProductModal
        open={openProdEdit}
        product={prodEdit}
        onClose={() => setOpenProdEdit(false)}
        onSave={updateProduct}
        busy={busy}
        setProduct={setProdEdit}
      />
    </div>
  );
}

// ==================== SUB COMPONENTS ====================

function StatCard({ icon, label, value, trend, color }) {
  const colors = {
    violet: "from-violet-50 to-violet-100/50 border-violet-100",
    fuchsia: "from-fuchsia-50 to-fuchsia-100/50 border-fuchsia-100",
    purple: "from-purple-50 to-purple-100/50 border-purple-100",
    amber: "from-amber-50 to-amber-100/50 border-amber-100",
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${colors[color]} border p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{icon}</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm text-gray-600">
            {trend}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function PendingCard({ title, count, subtitle, icon, onClick, color }) {
  const colors = {
    violet: "from-violet-600 to-purple-600",
    fuchsia: "from-fuchsia-600 to-pink-600",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 p-6 hover:shadow-xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-50/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{count}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={onClick}
          className={`px-6 py-3 rounded-xl bg-gradient-to-r ${colors[color]} text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
        >
          Voir
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200"
          : "bg-white text-gray-600 border border-gray-200 hover:border-violet-200 hover:text-violet-600 hover:shadow-md"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

// View Components
function StatsView({ stats }) {
  if (!stats) return null;

  const statsData = [
    { label: "Coopératives", value: stats.coops, sub: `${stats.pendingCoops} en attente` },
    { label: "Stands", value: stats.stands, sub: `${stats.pendingStands} en attente` },
    { label: "Produits", value: stats.products, sub: "Total catalogue" },
    { label: "Demandes", value: stats.requests || 0, sub: `${stats.newRequests || 0} nouvelles` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsData.map((item, idx) => (
        <div key={idx} className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 p-6 hover:shadow-xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-fuchsia-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <p className="text-sm font-medium text-gray-500 mb-2">{item.label}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{item.value}</p>
            <p className="text-sm text-gray-500">{item.sub}</p>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingUsersView({ users, decideUser, busy }) {
  return (
    <Section title="Coopératives en attente de validation" count={users.length}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {users.length === 0 ? (
          <EmptyState message="Aucune coopérative en attente" />
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              busy={busy}
              onApprove={() => decideUser(user.id, "approve")}
              onReject={() => decideUser(user.id, "reject")}
            />
          ))
        )}
      </div>
    </Section>
  );
}

function PendingStandsView({ stands, decideStand, busy }) {
  return (
    <Section title="Stands en attente de validation" count={stands.length}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stands.length === 0 ? (
          <EmptyState message="Aucun stand en attente" />
        ) : (
          stands.map((stand) => (
            <StandCard
              key={stand.id}
              stand={stand}
              busy={busy}
              onApprove={() => decideStand(stand.id, "approve")}
              onReject={() => decideStand(stand.id, "reject")}
            />
          ))
        )}
      </div>
    </Section>
  );
}

function UsersView({ users, q, setQ }) {
  return (
    <Section title="Tous les utilisateurs" count={users.length}>
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher par nom, email, ville..." />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <EmptyState message="Aucun utilisateur trouvé" />
        ) : (
          users.map((user) => <UserCard key={user.id} user={user} isReadOnly />)
        )}
      </div>
    </Section>
  );
}

function StandsView({ stands, q, setQ, busy, onEdit, onDelete }) {
  return (
    <Section title="Tous les stands" count={stands.length}>
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher par nom, ville, catégorie..." />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stands.length === 0 ? (
          <EmptyState message="Aucun stand trouvé" />
        ) : (
          stands.map((stand) => (
            <StandCard
              key={stand.id}
              stand={stand}
              busy={busy}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </Section>
  );
}

function ProductsView({ products, q, setQ, busy, onEdit, onDelete }) {
  return (
    <Section title="Tous les produits" count={products.length}>
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher par titre, stand..." />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <EmptyState message="Aucun produit trouvé" />
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              busy={busy}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </Section>
  );
}

// ==================== UI COMPONENTS ====================

function Section({ title, count, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
        <span className="px-4 py-2 rounded-full bg-violet-50 text-violet-700 font-medium text-sm border border-violet-100">
          Total: {count}
        </span>
      </div>
      {children}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 rounded-xl sm:rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-violet-500 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="col-span-full py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-50 mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function UserCard({ user, busy, onApprove, onReject, isReadOnly }) {
  const isBusy = busy?.scope === "usersPending" && busy.id === user.id;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
            #{user.id}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Ville" value={user.city || "—"} />
          <InfoItem label="Rôle" value={user.role || "—"} />
          <InfoItem label="Téléphone" value={user.phone || "—"} />
          <InfoItem label="WhatsApp" value={user.whatsapp || "—"} />
        </div>

        {!isReadOnly && (
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              loading={isBusy}
              onClick={onApprove}
              className="flex-1"
            >
              Approuver
            </Button>
            <Button
              variant="danger"
              loading={isBusy}
              onClick={onReject}
              className="flex-1"
            >
              Rejeter
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function StandCard({ stand, busy, onApprove, onReject, onEdit, onDelete }) {
  const isBusy = busy?.scope === (onEdit ? "standsAll" : "standsPending") && busy.id === stand.id;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{stand.stand_name}</h3>
            <p className="text-sm text-gray-500">{stand.full_name || "Coopérative"}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100">
            #{stand.id}
          </span>
        </div>

        {stand.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{stand.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="Ville" value={stand.city || "—"} />
          <InfoItem label="Catégorie" value={stand.category || "—"} />
          <InfoItem label="Téléphone" value={stand.phone || "—"} />
          <InfoItem label="WhatsApp" value={stand.whatsapp || "—"} />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {onApprove && onReject ? (
            <>
              <Button variant="primary" loading={isBusy} onClick={onApprove} className="flex-1">
                Approuver
              </Button>
              <Button variant="danger" loading={isBusy} onClick={onReject} className="flex-1">
                Rejeter
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" loading={isBusy} onClick={() => onEdit(stand)} className="flex-1">
                Modifier
              </Button>
              <Button variant="danger" loading={isBusy} onClick={() => onDelete(stand.id)} className="flex-1">
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProductCard({ product, busy, onEdit, onDelete }) {
  const isBusy = busy?.scope === "productsAll" && busy.id === product.id;

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-500">{product.stand_name || "Stand inconnu"}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            #{product.id}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <InfoItem label="Prix" value={product.price ? `${product.price} DH` : "—"} />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" loading={isBusy} onClick={() => onEdit(product)} className="flex-1">
            Modifier
          </Button>
          <Button variant="danger" loading={isBusy} onClick={() => onDelete(product.id)} className="flex-1">
            Supprimer
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Card({ children }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-50/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative">{children}</div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function Button({ variant = "primary", loading, children, className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-200",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:border-violet-200 hover:text-violet-600",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300",
  };

  return (
    <button
      className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
}

// Modal Components
function EditStandModal({ open, stand, onClose, onSave, busy, setStand }) {
  if (!open || !stand) return null;

  return (
    <Modal onClose={onClose} title="Modifier le stand" subtitle={`Stand #${stand.id}`}>
      <div className="space-y-4">
        <Input
          label="Nom du stand"
          value={stand.stand_name || ""}
          onChange={(v) => setStand((s) => ({ ...s, stand_name: v }))}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Ville" value={stand.city || ""} onChange={(v) => setStand((s) => ({ ...s, city: v }))} />
          <Input label="Catégorie" value={stand.category || ""} onChange={(v) => setStand((s) => ({ ...s, category: v }))} />
        </div>
        <Input label="Adresse" value={stand.address || ""} onChange={(v) => setStand((s) => ({ ...s, address: v }))} />
        <Textarea
          label="Description"
          value={stand.description || ""}
          onChange={(v) => setStand((s) => ({ ...s, description: v }))}
        />
        <div className="flex gap-3 pt-4">
          <Button variant="primary" onClick={onSave} loading={busy.scope === "standsAll"} className="flex-1">
            Enregistrer
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function EditProductModal({ open, product, onClose, onSave, busy, setProduct }) {
  if (!open || !product) return null;

  return (
    <Modal onClose={onClose} title="Modifier le produit" subtitle={`Produit #${product.id}`}>
      <div className="space-y-4">
        <Input
          label="Titre"
          value={product.title || ""}
          onChange={(v) => setProduct((p) => ({ ...p, title: v }))}
        />
        <Input
          label="Prix (DH)"
          type="number"
          value={product.price ?? ""}
          onChange={(v) => setProduct((p) => ({ ...p, price: v }))}
        />
        <Textarea
          label="Description"
          value={product.description || ""}
          onChange={(v) => setProduct((p) => ({ ...p, description: v }))}
        />
        <div className="flex gap-3 pt-4">
          <Button variant="primary" onClick={onSave} loading={busy.scope === "productsAll"} className="flex-1">
            Enregistrer
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ onClose, title, subtitle, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-modal-in">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-violet-600 uppercase tracking-wider">{title}</p>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{subtitle}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-300 resize-none"
      />
    </div>
  );
}

// ==================== UTILS ====================

function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}