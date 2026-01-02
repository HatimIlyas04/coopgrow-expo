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

  const [tab, setTab] = useState("stats"); // stats | pendingUsers | pendingStands | users | stands | products
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

  // Data
  const [stats, setStats] = useState(null);

  const [usersPending, setUsersPending] = useState([]);
  const [standsPending, setStandsPending] = useState([]);

  const [usersAll, setUsersAll] = useState([]);
  const [standsAll, setStandsAll] = useState([]);
  const [productsAll, setProductsAll] = useState([]);

  // Search
  const [qUsers, setQUsers] = useState("");
  const [qStands, setQStands] = useState("");
  const [qProducts, setQProducts] = useState("");

  // Modals edit
  const [openStandEdit, setOpenStandEdit] = useState(false);
  const [standEdit, setStandEdit] = useState(null);

  const [openProdEdit, setOpenProdEdit] = useState(false);
  const [prodEdit, setProdEdit] = useState(null);

  // Action loading
  const [busy, setBusy] = useState({ scope: null, id: null });

  /* ---------------- Fetchers ---------------- */

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
      await Promise.all([
        fetchStats(),
        fetchPendingUsers(),
        fetchPendingStands(),
        fetchAllUsers(),
        fetchAllStands(),
        fetchAllProducts(),
      ]);
      toast.success("✅ Dashboard chargé avec succès !");
    } catch (err) {
      if (!handleAuthError(err)) {
        const m = err?.response?.data?.message || "Erreur chargement Admin";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Actions: Approve/Reject ---------------- */

  const decideUser = async (id, type) => {
    setBusy({ scope: "usersPending", id });
    try {
      await api.put(`/admin/users/${id}/${type}`, null, { headers });
      toast.success(type === "approve" ? "✅ Coopérative approuvée !" : "⛔ Coopérative rejetée !");
      await Promise.all([fetchPendingUsers(), fetchAllUsers(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur action user");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const decideStand = async (id, type) => {
    setBusy({ scope: "standsPending", id });
    try {
      await api.put(`/admin/stands/${id}/${type}`, null, { headers });
      toast.success(type === "approve" ? "✅ Stand approuvé !" : "⛔ Stand rejeté !");
      await Promise.all([fetchPendingStands(), fetchAllStands(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur action stand");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  /* ---------------- Actions: Edit/Delete Stand ---------------- */

  const updateStand = async () => {
    if (!standEdit?.id) return;
    setBusy({ scope: "standsAll", id: standEdit.id });
    try {
      await api.put(`/admin/stands/${standEdit.id}`, standEdit, { headers });
      toast.success("✅ Stand modifié !");
      setOpenStandEdit(false);
      setStandEdit(null);
      await Promise.all([fetchAllStands(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur modification stand");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const deleteStand = async (id) => {
    if (!confirm("Supprimer ce stand ? (Produits seront supprimés)")) return;
    setBusy({ scope: "standsAll", id });
    try {
      await api.delete(`/admin/stands/${id}`, { headers });
      toast.success("✅ Stand supprimé !");
      await Promise.all([fetchAllStands(), fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur suppression stand");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  /* ---------------- Actions: Edit/Delete Product ---------------- */

  const updateProduct = async () => {
    if (!prodEdit?.id) return;
    setBusy({ scope: "productsAll", id: prodEdit.id });
    try {
      await api.put(`/admin/products/${prodEdit.id}`, prodEdit, { headers });
      toast.success("✅ Produit modifié !");
      setOpenProdEdit(false);
      setProdEdit(null);
      await Promise.all([fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur modification produit");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setBusy({ scope: "productsAll", id });
    try {
      await api.delete(`/admin/products/${id}`, { headers });
      toast.success("✅ Produit supprimé !");
      await Promise.all([fetchAllProducts(), fetchStats()]);
    } catch (err) {
      if (!handleAuthError(err)) toast.error(err?.response?.data?.message || "Erreur suppression produit");
    } finally {
      setBusy({ scope: null, id: null });
    }
  };

  /* ---------------- Filters ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f0ff] via-white to-[#f7f5ff]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.20em] text-violet-700">
                Administrateur • Accès total
              </p>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Dashboard Administrateur
            </h1>

            <p className="mt-2 text-gray-600 max-w-2xl">
              Gestion complète du site : validation, modification, suppression et statistiques.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshAll}
              className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition shadow-soft"
            >
              Rafraîchir
            </button>

            <button
              onClick={() => {
                logout();
                nav("/login");
              }}
              className="px-6 py-3 rounded-2xl font-black bg-white border border-red-200 text-red-700 hover:bg-red-50 transition shadow-soft"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Coopératives actives" value={stats.coops} hint="Coops validées" />
            <StatCard label="Stands publiés" value={stats.stands} hint="Visibles" />
            <StatCard label="Produits" value={stats.products} hint="Total" />
            <StatCard label="Coops en attente" value={stats.pendingCoops} hint="À valider" />
          </div>
        )}

        {/* PENDING Alerts */}
        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <PendingMiniCard
            title="Coopératives en attente"
            value={usersPending.length}
            sub="Validez ou rejetez les inscriptions"
            onGo={() => setTab("pendingUsers")}
          />
          <PendingMiniCard
            title="Stands en attente"
            value={standsPending.length}
            sub="Publiez ou rejetez les stands"
            onGo={() => setTab("pendingStands")}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-3">
          <TabBtn active={tab === "stats"} onClick={() => setTab("stats")}>📊 Statistiques</TabBtn>

          <TabBtn active={tab === "pendingUsers"} onClick={() => setTab("pendingUsers")}>
            ⏳ Coopératives en attente
          </TabBtn>

          <TabBtn active={tab === "pendingStands"} onClick={() => setTab("pendingStands")}>
            ⏳ Stands en attente
          </TabBtn>

          <TabBtn active={tab === "users"} onClick={() => setTab("users")}>👥 Tous les utilisateurs</TabBtn>
          <TabBtn active={tab === "stands"} onClick={() => setTab("stands")}>🏪 Tous les stands</TabBtn>
          <TabBtn active={tab === "products"} onClick={() => setTab("products")}>🧺 Tous les produits</TabBtn>
        </div>

        {msg && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
            {msg}
          </div>
        )}

        {loading ? (
          <Box>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-violet-600 animate-pulse" />
              <p className="font-black text-gray-700">Chargement du dashboard...</p>
            </div>
          </Box>
        ) : tab === "stats" ? (
          <StatsView stats={stats} />
        ) : tab === "pendingUsers" ? (
          <PendingUsersView users={usersPending} decideUser={decideUser} busy={busy} />
        ) : tab === "pendingStands" ? (
          <PendingStandsView stands={standsPending} decideStand={decideStand} busy={busy} />
        ) : tab === "users" ? (
          <UsersView users={usersFiltered} q={qUsers} setQ={setQUsers} />
        ) : tab === "stands" ? (
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
        ) : (
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
      </div>

      {/* MODAL: EDIT STAND */}
      {openStandEdit && standEdit && (
        <Modal onClose={() => setOpenStandEdit(false)}>
          <ModalHeader
            title={`Modifier le stand #${standEdit.id}`}
            subtitle={standEdit.stand_name}
            onClose={() => setOpenStandEdit(false)}
          />
          <div className="p-6 grid gap-3">
            <Input label="Nom du stand" value={standEdit.stand_name || ""} onChange={(v) => setStandEdit((s) => ({ ...s, stand_name: v }))} />
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Ville" value={standEdit.city || ""} onChange={(v) => setStandEdit((s) => ({ ...s, city: v }))} />
              <Input label="Catégorie" value={standEdit.category || ""} onChange={(v) => setStandEdit((s) => ({ ...s, category: v }))} />
            </div>
            <Input label="Adresse" value={standEdit.address || ""} onChange={(v) => setStandEdit((s) => ({ ...s, address: v }))} />
            <Textarea label="Description" value={standEdit.description || ""} onChange={(v) => setStandEdit((s) => ({ ...s, description: v }))} />

            <div className="flex gap-3 mt-2">
              <button
                onClick={updateStand}
                className="flex-1 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setOpenStandEdit(false)}
                className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {openProdEdit && prodEdit && (
        <Modal onClose={() => setOpenProdEdit(false)}>
          <ModalHeader
            title={`Modifier le produit #${prodEdit.id}`}
            subtitle={prodEdit.title}
            onClose={() => setOpenProdEdit(false)}
          />
          <div className="p-6 grid gap-3">
            <Input label="Titre" value={prodEdit.title || ""} onChange={(v) => setProdEdit((p) => ({ ...p, title: v }))} />
            <Input label="Prix (DH)" value={prodEdit.price ?? ""} onChange={(v) => setProdEdit((p) => ({ ...p, price: v }))} />
            <Textarea label="Description" value={prodEdit.description || ""} onChange={(v) => setProdEdit((p) => ({ ...p, description: v }))} />

            <div className="flex gap-3 mt-2">
              <button
                onClick={updateProduct}
                className="flex-1 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setOpenProdEdit(false)}
                className="px-6 py-3 rounded-2xl font-black bg-white border border-black/10 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- SUB VIEWS ---------------- */

function StatsView({ stats }) {
  if (!stats) return <Box>Aucune donnée.</Box>;

  const cards = [
    { label: "Coopératives actives", value: stats.coops },
    { label: "Coopératives en attente", value: stats.pendingCoops },
    { label: "Stands publiés", value: stats.stands },
    { label: "Stands en attente", value: stats.pendingStands },
    { label: "Produits", value: stats.products },
    { label: "Demandes totales", value: stats.requests },
    { label: "Demandes NEW", value: stats.newRequests },
  ];

  return (
    <div className="mt-7 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((c, i) => (
        <div key={i} className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-fuchsia-50/40 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{c.label}</p>
            <p className="text-4xl font-black text-gray-900 mt-3">{c.value}</p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-violet-600 to-purple-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingUsersView({ users, decideUser, busy }) {
  return (
    <Box>
      <HeaderBlock
        title="Coopératives en attente"
        sub="Approuver ou rejeter les nouvelles coopératives."
        count={users.length}
      />

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {users.length === 0 ? (
          <EmptyBox text="Aucune coopérative en attente." />
        ) : (
          users.map((u) => {
            const isBusy = busy.scope === "usersPending" && busy.id === u.id;
            return (
              <Card key={u.id} title={u.full_name} subtitle={u.email} badge={`#${u.id}`}>
                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <Info label="Ville" value={u.city || "—"} />
                  <Info label="Téléphone" value={u.phone || "—"} />
                  <Info label="WhatsApp" value={u.whatsapp || "—"} />
                  <Info label="Créé le" value={formatDate(u.created_at)} />
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <ActionBtn green disabled={isBusy} onClick={() => decideUser(u.id, "approve")}>
                    {isBusy ? "Traitement..." : "Approuver"}
                  </ActionBtn>
                  <ActionBtn red disabled={isBusy} onClick={() => decideUser(u.id, "reject")}>
                    {isBusy ? "Traitement..." : "Rejeter"}
                  </ActionBtn>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Box>
  );
}

function PendingStandsView({ stands, decideStand, busy }) {
  return (
    <Box>
      <HeaderBlock title="Stands en attente" sub="Approuver ou rejeter les stands." count={stands.length} />

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {stands.length === 0 ? (
          <EmptyBox text="Aucun stand en attente." />
        ) : (
          stands.map((s) => {
            const isBusy = busy.scope === "standsPending" && busy.id === s.id;
            return (
              <Card key={s.id} title={s.stand_name} subtitle={s.full_name || "Coopérative"} badge={`#${s.id}`}>
                <p className="text-sm text-gray-700 mt-4 line-clamp-3">{s.description || "—"}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <Info label="Ville" value={s.city || "—"} />
                  <Info label="Catégorie" value={s.category || "—"} />
                  <Info label="Téléphone" value={s.phone || "—"} />
                  <Info label="WhatsApp" value={s.whatsapp || "—"} />
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <ActionBtn green disabled={isBusy} onClick={() => decideStand(s.id, "approve")}>
                    {isBusy ? "Traitement..." : "Approuver"}
                  </ActionBtn>
                  <ActionBtn red disabled={isBusy} onClick={() => decideStand(s.id, "reject")}>
                    {isBusy ? "Traitement..." : "Rejeter"}
                  </ActionBtn>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Box>
  );
}

function UsersView({ users, q, setQ }) {
  return (
    <Box>
      <HeaderBlock title="Tous les utilisateurs" sub="Vue complète des comptes et rôles." count={users.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher un utilisateur (nom, email, ville, rôle...)" />

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {users.length === 0 ? (
          <EmptyBox text="Aucun utilisateur." />
        ) : (
          users.map((u) => (
            <Card key={u.id} title={u.full_name} subtitle={u.email} badge={`${u.role} #${u.id}`}>
              <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                <Info label="Ville" value={u.city || "—"} />
                <Info label="Téléphone" value={u.phone || "—"} />
                <Info label="WhatsApp" value={u.whatsapp || "—"} />
                <Info label="Créé le" value={formatDate(u.created_at)} />
              </div>
            </Card>
          ))
        )}
      </div>
    </Box>
  );
}

function StandsView({ stands, q, setQ, busy, onEdit, onDelete }) {
  return (
    <Box>
      <HeaderBlock title="Tous les stands" sub="Modifier ou supprimer les stands publiés." count={stands.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher un stand (nom, ville, catégorie...)" />

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {stands.length === 0 ? (
          <EmptyBox text="Aucun stand." />
        ) : (
          stands.map((s) => {
            const isBusy = busy.scope === "standsAll" && busy.id === s.id;
            return (
              <Card key={s.id} title={s.stand_name} subtitle={s.full_name || "Coopérative"} badge={`#${s.id}`}>
                <p className="text-sm text-gray-700 mt-4 line-clamp-3">{s.description || "—"}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <Info label="Ville" value={s.city || "—"} />
                  <Info label="Catégorie" value={s.category || "—"} />
                  <Info label="Téléphone" value={s.phone || "—"} />
                  <Info label="WhatsApp" value={s.whatsapp || "—"} />
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <ActionBtn green disabled={isBusy} onClick={() => onEdit(s)}>
                    {isBusy ? "..." : "Modifier"}
                  </ActionBtn>
                  <ActionBtn danger disabled={isBusy} onClick={() => onDelete(s.id)}>
                    {isBusy ? "..." : "Supprimer"}
                  </ActionBtn>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Box>
  );
}

function ProductsView({ products, q, setQ, busy, onEdit, onDelete }) {
  return (
    <Box>
      <HeaderBlock title="Tous les produits" sub="Modifier ou supprimer les produits." count={products.length} />
      <SearchBar value={q} onChange={setQ} placeholder="Rechercher un produit (titre, stand...)" />

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {products.length === 0 ? (
          <EmptyBox text="Aucun produit." />
        ) : (
          products.map((p) => {
            const isBusy = busy.scope === "productsAll" && busy.id === p.id;
            return (
              <Card key={p.id} title={p.title} subtitle={`Stand: ${p.stand_name || "—"}`} badge={`#${p.id}`}>
                <p className="text-sm text-gray-700 mt-4 line-clamp-3">{p.description || "—"}</p>
                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <Info label="Prix" value={p.price != null ? `${p.price} DH` : "—"} />
                  <Info label="Stand" value={p.stand_name || "—"} />
                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                  <ActionBtn green disabled={isBusy} onClick={() => onEdit(p)}>
                    {isBusy ? "..." : "Modifier"}
                  </ActionBtn>
                  <ActionBtn danger disabled={isBusy} onClick={() => onDelete(p.id)}>
                    {isBusy ? "..." : "Supprimer"}
                  </ActionBtn>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Box>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-black text-sm border transition ${
        active
          ? "bg-gradient-to-r from-violet-600 to-purple-700 text-white border-transparent shadow-md"
          : "bg-white text-[#41217f] border-[#dccfe2] hover:bg-[#f3eefe]"
      }`}
    >
      {children}
    </button>
  );
}

function PendingMiniCard({ title, value, sub, onGo }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white shadow-soft p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-fuchsia-50/30 pointer-events-none" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{title}</p>
          <p className="text-4xl font-black text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-600 mt-2">{sub}</p>
        </div>
        <button
          onClick={onGo}
          className="px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
        >
          Voir →
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-fuchsia-50/40 pointer-events-none" />
      <div className="relative">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{label}</p>
        <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
        {hint && <p className="text-sm text-gray-600 mt-1">{hint}</p>}
      </div>
    </div>
  );
}

function HeaderBlock({ title, sub, count }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{sub}</p>
      </div>
      <span className="px-4 py-2 rounded-full bg-[#f7f3fb] border border-[#dccfe2] text-sm font-black text-[#41217f]">
        Total: {count}
      </span>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="mt-5 rounded-3xl border border-black/5 bg-white shadow-soft p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Recherche</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-2xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}

function Box({ children }) {
  return <div className="mt-7 rounded-[28px] border border-black/5 bg-white shadow-soft p-6">{children}</div>;
}

function EmptyBox({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-violet-200 bg-[#f7f3fb] p-10 text-center shadow-soft">
      <p className="text-lg font-black text-[#1f1633]">{text}</p>
      <p className="text-sm text-gray-600 mt-1">Rien à afficher pour le moment.</p>
    </div>
  );
}

function Card({ title, subtitle, badge, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-soft">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-fuchsia-50/40 pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{subtitle}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{title}</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-black">{badge}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-[11px] uppercase font-black tracking-[0.14em] text-gray-500">{label}</p>
      <p className="text-gray-800 font-semibold mt-1 break-words">{value}</p>
    </div>
  );
}

function ActionBtn({ green, red, danger, disabled, onClick, children }) {
  const base = "px-4 py-2.5 rounded-xl font-black shadow-md transition disabled:opacity-60";
  const cls = green
    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-95"
    : "bg-white border border-red-200 text-red-700 hover:bg-red-50";

  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="p-6 border-b border-black/5 flex items-start justify-between gap-4 bg-gradient-to-r from-violet-50 to-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 mt-2">{subtitle}</h3>
      </div>
      <button onClick={onClose} className="px-3 py-2 rounded-xl border border-black/10 font-black hover:bg-gray-50">
        ✕
      </button>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-5">
      <button onClick={onClose} className="fixed inset-0 cursor-default" aria-label="close" />
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      {label && <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</p>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      {label && <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("fr-FR");
  } catch {
    return "—";
  }
}
