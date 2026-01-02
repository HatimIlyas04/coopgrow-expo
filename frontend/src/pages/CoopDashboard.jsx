import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getToken, getUser, logout } from "../utils/auth";

const API_HOST = "http://localhost:5000";

export default function CoopDashboard() {
  const nav = useNavigate();
  const token = getToken();
  const user = getUser();

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [tab, setTab] = useState("profile"); // profile | stand | products | requests
  const [loading, setLoading] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // PROFILE
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    city: "",
    bio: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  // STAND
  const [myStand, setMyStand] = useState(null);
  const [standForm, setStandForm] = useState({
    stand_name: "",
    description: "",
    category: "",
    address: "",
  });
  const [coverFile, setCoverFile] = useState(null);

  // PRODUCTS
  const [products, setProducts] = useState([]);
  const [prodForm, setProdForm] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [productImageFile, setProductImageFile] = useState(null);

  // REQUESTS
  const [requests, setRequests] = useState([]);
  const [filterReq, setFilterReq] = useState("NEW");
  const [openReqModal, setOpenReqModal] = useState(false);
  const [reqModalData, setReqModalData] = useState(null);

  // New requests count for notification polling
  const [lastNewCount, setLastNewCount] = useState(0);

  /* ---------------- Helpers ---------------- */

  const toast = (type, text) => {
    const id = Math.random().toString(16).slice(2);
    const item = { id, type, text };
    setToasts((t) => [item, ...t].slice(0, 4));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  };

  const handleAuthError = (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      logout();
      nav("/login");
      return true;
    }
    return false;
  };

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  /* ---------------- Fetchers ---------------- */

  const fetchProfile = async () => {
    const { data } = await api.get("/profile/me", { headers });
    setProfile(data);
    setProfileForm({
      full_name: data.full_name || "",
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      city: data.city || "",
      bio: data.bio || "",
    });
  };

  const fetchMyStand = async () => {
    const { data } = await api.get("/stands/me/list", { headers });
    const stand = data?.[0] || null;
    setMyStand(stand);

    if (!stand) {
      setStandForm({ stand_name: "", description: "", category: "", address: "" });
    }
  };

  const fetchProducts = async () => {
    const { data } = await api.get("/products/my", { headers });
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchRequests = async ({ silent = false } = {}) => {
    const { data } = await api.get("/requests/my", { headers });
    const list = Array.isArray(data) ? data : [];
    setRequests(list);

    const newCount = list.filter((r) => r.status === "NEW").length;

    if (!silent) {
      setLastNewCount(newCount);
    } else {
      if (newCount > lastNewCount) {
        toast("success", `📩 Vous avez ${newCount - lastNewCount} nouvelle(s) demande(s) !`);
        setLastNewCount(newCount);
      }
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      await fetchProfile();
      await fetchMyStand();
      await fetchProducts();
      await fetchRequests();
      toast("info", "✅ Données mises à jour");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Init ---------------- */

  useEffect(() => {
    if (!token) return nav("/login");
    if (user?.role !== "COOP") return nav("/admin");
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // polling notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return;
      fetchRequests({ silent: true }).catch(() => {});
    }, 12000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, lastNewCount]);

  /* ---------------- Actions: Profile ---------------- */

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile/me", profileForm, { headers });
      await fetchProfile();
      toast("success", "✅ Profil enregistré");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur profil");
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return toast("error", "⚠️ Choisissez une image");
    try {
      const fd = new FormData();
      fd.append("logo", logoFile);

      await api.post("/profile/me/logo", fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setLogoFile(null);
      await fetchProfile();
      toast("success", "✅ Logo uploadé");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur logo");
    }
  };

  /* ---------------- Actions: Stand ---------------- */

  const createStand = async (e) => {
    e.preventDefault();
    try {
      await api.post("/stands", standForm, { headers });
      await fetchMyStand();
      toast("success", "✅ Stand créé");
      setTab("stand");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur stand");
    }
  };

  const uploadCover = async () => {
    if (!myStand?.id) return toast("error", "⚠️ Créez un stand d’abord");
    if (!coverFile) return toast("error", "⚠️ Choisissez une cover");
    try {
      const fd = new FormData();
      fd.append("cover", coverFile);

      await api.post(`/stands/${myStand.id}/cover`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setCoverFile(null);
      await fetchMyStand();
      toast("success", "✅ Cover uploadée");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur cover");
    }
  };

  /* ---------------- Actions: Products ---------------- */

  const addProduct = async (e) => {
    e.preventDefault();
    if (!myStand?.id) return toast("error", "⚠️ Créez un stand d’abord");
    if (!prodForm.title.trim()) return toast("error", "⚠️ Titre obligatoire");

    try {
      const { data } = await api.post(
        "/products",
        {
          stand_id: myStand.id,
          title: prodForm.title.trim(),
          price: prodForm.price ? Number(prodForm.price) : null,
          description: prodForm.description || null,
        },
        { headers }
      );

      const newId = data?.product_id || data?.id || data?.insertId;

      if (productImageFile && newId) {
        const fd = new FormData();
        fd.append("image", productImageFile);

        await api.post(`/products/${newId}/image`, fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }

      setProdForm({ title: "", price: "", description: "" });
      setProductImageFile(null);
      await fetchProducts();
      toast("success", "✅ Produit ajouté");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur produit");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/products/${id}`, { headers });
      await fetchProducts();
      toast("success", "✅ Produit supprimé");
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur suppression");
    }
  };

  /* ---------------- Requests Actions ---------------- */

  const updateRequestStatus = async (rid, status) => {
    try {
      await api.put(`/requests/${rid}/status`, { status }, { headers });
      await fetchRequests();
      toast("success", "✅ Statut mis à jour");
      setOpenReqModal(false);
      setReqModalData(null);
    } catch (err) {
      if (!handleAuthError(err)) toast("error", err?.response?.data?.message || "Erreur statut");
    }
  };

  const filteredRequests = useMemo(() => {
    if (filterReq === "ALL") return requests;
    return requests.filter((r) => r.status === filterReq);
  }, [requests, filterReq]);

  const newCount = requests.filter((r) => r.status === "NEW").length;
  const contactedCount = requests.filter((r) => r.status === "CONTACTED").length;
  const closedCount = requests.filter((r) => r.status === "CLOSED").length;

  const logoUrl = profile?.logo ? `${API_HOST}${profile.logo}` : null;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* TOASTS */}
      <div className="fixed top-5 right-5 z-[999] space-y-3">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} text={t.text} />
        ))}
      </div>

      {/* Top header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
              Espace Coopérative
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Simple et clair : Profil → Stand → Produits → Demandes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-xs font-black text-gray-400">LOGO</span>
                )}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black text-gray-900">
                  {profile?.full_name || user?.full_name || "Coopérative"}
                </p>
                <p className="text-xs text-gray-500 font-semibold">Connecté</p>
              </div>
            </div>

            <button
              onClick={refreshAll}
              className="px-5 py-3 rounded-2xl font-black bg-violet-600 text-white hover:bg-violet-700 transition shadow-sm"
            >
              Rafraîchir
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>Profil</TabBtn>
          <TabBtn active={tab === "stand"} onClick={() => setTab("stand")}>Stand</TabBtn>
          <TabBtn active={tab === "products"} onClick={() => setTab("products")}>Produits</TabBtn>
          <TabBtn active={tab === "requests"} onClick={() => setTab("requests")}>
            Demandes
            {newCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                {newCount}
              </span>
            )}
          </TabBtn>
        </div>

        {loading ? (
          <Box>Chargement...</Box>
        ) : tab === "profile" ? (
          <ProfileTab
            profile={profile}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            uploadLogo={uploadLogo}
            updateProfile={updateProfile}
          />
        ) : tab === "stand" ? (
          <StandTab
            myStand={myStand}
            standForm={standForm}
            setStandForm={setStandForm}
            createStand={createStand}
            coverFile={coverFile}
            setCoverFile={setCoverFile}
            uploadCover={uploadCover}
          />
        ) : tab === "products" ? (
          <ProductsTab
            myStand={myStand}
            products={products}
            prodForm={prodForm}
            setProdForm={setProdForm}
            productImageFile={productImageFile}
            setProductImageFile={setProductImageFile}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
          />
        ) : (
          <RequestsTab
            requests={filteredRequests}
            all={requests}
            filterReq={filterReq}
            setFilterReq={setFilterReq}
            newCount={newCount}
            contactedCount={contactedCount}
            closedCount={closedCount}
            formatDate={formatDate}
            updateRequestStatus={updateRequestStatus}
            openDetails={(r) => {
              setReqModalData(r);
              setOpenReqModal(true);
            }}
          />
        )}
      </div>

      {/* Request modal */}
      {openReqModal && reqModalData && (
        <Modal onClose={() => { setOpenReqModal(false); setReqModalData(null); }}>
          <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                Détails de la demande
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {reqModalData.visitor_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(reqModalData.created_at)}
              </p>
            </div>
            <button
              onClick={() => { setOpenReqModal(false); setReqModalData(null); }}
              className="px-3 py-2 rounded-xl border border-gray-200 font-black hover:bg-gray-50"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <Info label="Téléphone" value={reqModalData.visitor_phone || "—"} />
              <Info label="Email" value={reqModalData.visitor_email || "—"} />
              <Info label="Ville" value={reqModalData.visitor_city || "—"} />
              <Info label="Quantité" value={reqModalData.qty || "—"} />
            </div>

            <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
                Message
              </p>
              <p className="text-gray-800 mt-2 whitespace-pre-wrap break-words leading-relaxed">
                {reqModalData.visitor_message || "—"}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => updateRequestStatus(reqModalData.id, "CONTACTED")}
                className="px-5 py-3 rounded-2xl font-black bg-amber-500 text-white hover:opacity-95 transition"
              >
                Marquer CONTACTÉ
              </button>
              <button
                onClick={() => updateRequestStatus(reqModalData.id, "CLOSED")}
                className="px-5 py-3 rounded-2xl font-black bg-emerald-600 text-white hover:opacity-95 transition"
              >
                Marquer FERMÉ
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ProfileTab({ profile, profileForm, setProfileForm, logoFile, setLogoFile, uploadLogo, updateProfile }) {
  return (
    <div className="mt-7 grid lg:grid-cols-2 gap-6">
      <Box>
        <h2 className="text-lg font-black text-gray-900">Logo</h2>
        <p className="text-sm text-gray-500 mt-1">
          Logo carré (PNG) recommandé. L’affichage sera toujours propre.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            {profile?.logo ? (
              <img src={`${API_HOST}${profile.logo}`} className="w-full h-full object-contain p-2" alt="logo" />
            ) : (
              <div className="text-gray-400 font-black">LOGO</div>
            )}
          </div>

          <div className="flex-1">
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} className="w-full" />
            <button
              type="button"
              onClick={uploadLogo}
              className="mt-3 px-4 py-2 rounded-xl font-black bg-violet-600 text-white hover:bg-violet-700 transition"
            >
              Upload Logo
            </button>
            {logoFile && <p className="text-xs text-gray-500 mt-2">{logoFile.name}</p>}
          </div>
        </div>
      </Box>

      <Box>
        <h2 className="text-lg font-black text-gray-900">Informations</h2>
        <form onSubmit={updateProfile} className="mt-4 grid gap-3">
          <Input label="Nom" value={profileForm.full_name} onChange={(v) => setProfileForm((f) => ({ ...f, full_name: v }))} />
          <Input label="Téléphone" value={profileForm.phone} onChange={(v) => setProfileForm((f) => ({ ...f, phone: v }))} />
          <Input label="WhatsApp" value={profileForm.whatsapp} onChange={(v) => setProfileForm((f) => ({ ...f, whatsapp: v }))} />
          <Input label="Ville" value={profileForm.city} onChange={(v) => setProfileForm((f) => ({ ...f, city: v }))} />
          <Textarea label="Bio" value={profileForm.bio} onChange={(v) => setProfileForm((f) => ({ ...f, bio: v }))} />
          <button className="px-5 py-3 rounded-xl font-black bg-violet-600 text-white hover:bg-violet-700 transition">
            Enregistrer
          </button>
        </form>
      </Box>
    </div>
  );
}

function StandTab({ myStand, standForm, setStandForm, createStand, coverFile, setCoverFile, uploadCover }) {
  const coverUrl = myStand?.cover_image ? `${API_HOST}${myStand.cover_image}` : null;

  return (
    <div className="mt-7 grid lg:grid-cols-2 gap-6">
      <Box>
        <h2 className="text-lg font-black text-gray-900">{myStand ? "Mon stand" : "Créer mon stand (1 seul)"}</h2>

        {myStand ? (
          <div className="mt-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">Stand</p>
              <h3 className="text-2xl font-black text-gray-900 mt-2">{myStand.stand_name}</h3>
              <p className="text-sm text-gray-500 mt-1">{myStand.category || "—"} • {myStand.address || "—"}</p>
              <p className="text-gray-700 mt-4 leading-relaxed">{myStand.description || "—"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={createStand} className="mt-4 grid gap-3">
            <Input value={standForm.stand_name} onChange={(v) => setStandForm((s) => ({ ...s, stand_name: v }))} label="Nom du stand*" />
            <Input value={standForm.category} onChange={(v) => setStandForm((s) => ({ ...s, category: v }))} label="Catégorie" />
            <Input value={standForm.address} onChange={(v) => setStandForm((s) => ({ ...s, address: v }))} label="Adresse" />
            <Textarea value={standForm.description} onChange={(v) => setStandForm((s) => ({ ...s, description: v }))} label="Description" />
            <button className="px-5 py-3 rounded-xl font-black bg-violet-600 text-white hover:bg-violet-700 transition">
              Créer mon stand
            </button>
          </form>
        )}
      </Box>

      <Box>
        <h2 className="text-lg font-black text-gray-900">Cover du stand</h2>

        {coverUrl ? (
          <img src={coverUrl} alt="cover" className="mt-4 w-full h-56 object-cover rounded-2xl border border-gray-200" />
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-700 font-black">Aucune cover</p>
            <p className="text-sm text-gray-500 mt-2">Ajoutez une belle image, le stand sera plus attractif.</p>
          </div>
        )}

        <div className="mt-4">
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
          <button
            type="button"
            onClick={uploadCover}
            className="mt-3 px-4 py-2 rounded-xl font-black bg-violet-600 text-white hover:bg-violet-700 transition"
          >
            Upload Cover
          </button>
          {coverFile && <p className="text-xs text-gray-500 mt-2">{coverFile.name}</p>}
        </div>
      </Box>
    </div>
  );
}

function ProductsTab({ myStand, products, prodForm, setProdForm, productImageFile, setProductImageFile, addProduct, deleteProduct }) {
  if (!myStand) return <Box>Créez un stand d’abord.</Box>;

  return (
    <div className="mt-7 grid lg:grid-cols-2 gap-6">
      <Box>
        <h2 className="text-lg font-black text-gray-900">Ajouter un produit</h2>

        <form onSubmit={addProduct} className="mt-4 grid gap-3">
          <Input label="Titre*" value={prodForm.title} onChange={(v) => setProdForm((p) => ({ ...p, title: v }))} />
          <Input label="Prix (DH)" value={prodForm.price} onChange={(v) => setProdForm((p) => ({ ...p, price: v }))} />
          <Textarea label="Description" value={prodForm.description} onChange={(v) => setProdForm((p) => ({ ...p, description: v }))} />

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">Image produit</p>
            <input type="file" accept="image/*" onChange={(e) => setProductImageFile(e.target.files[0])} />
            {productImageFile && <p className="text-xs text-gray-500 mt-1">{productImageFile.name}</p>}
            <p className="text-xs text-gray-500 mt-2">✅ Conseil: 1200x900 (ou carré). Le site ajuste automatiquement.</p>
          </div>

          <button className="px-5 py-3 rounded-xl font-black bg-violet-600 text-white hover:bg-violet-700 transition">
            Ajouter
          </button>
        </form>
      </Box>

      <Box>
        <h2 className="text-lg font-black text-gray-900">Mes produits</h2>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {products.length === 0 ? (
            <div className="text-gray-500 font-semibold">Aucun produit.</div>
          ) : (
            products.map((p) => {
              const imgPath = p.image || p.main_image;
              const img = imgPath ? `${API_HOST}${imgPath}` : null;

              return (
                <div key={p.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition">
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    {img ? (
                      <img src={img} alt="prod" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-black text-gray-900 line-clamp-1">{p.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{p.price != null ? `${p.price} DH` : "—"}</p>

                    {p.description && (
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    )}

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="mt-3 w-full px-4 py-2 rounded-xl font-black bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Box>
    </div>
  );
}

function RequestsTab({ requests, all, filterReq, setFilterReq, newCount, contactedCount, closedCount, formatDate, updateRequestStatus, openDetails }) {
  return (
    <div className="mt-7">
      <Box>
        <div className="flex flex-wrap gap-3 items-end justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">Demandes reçues</h2>
            <p className="text-sm text-gray-500 mt-1">
              Les nouvelles en <span className="font-black text-red-600">rouge</span>, contactées en <span className="font-black text-amber-600">orange</span>, fermées en <span className="font-black text-emerald-600">vert</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterBtn active={filterReq === "NEW"} onClick={() => setFilterReq("NEW")}>Nouvelles ({newCount})</FilterBtn>
            <FilterBtn active={filterReq === "CONTACTED"} onClick={() => setFilterReq("CONTACTED")}>Contactées ({contactedCount})</FilterBtn>
            <FilterBtn active={filterReq === "CLOSED"} onClick={() => setFilterReq("CLOSED")}>Fermées ({closedCount})</FilterBtn>
            <FilterBtn active={filterReq === "ALL"} onClick={() => setFilterReq("ALL")}>Toutes ({all.length})</FilterBtn>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {requests.length === 0 ? (
            <div className="text-gray-500 font-semibold">Aucune demande.</div>
          ) : (
            requests.map((r) => (
              <RequestCard
                key={r.id}
                r={r}
                formatDate={formatDate}
                updateRequestStatus={updateRequestStatus}
                openDetails={() => openDetails(r)}
              />
            ))
          )}
        </div>
      </Box>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Toast({ type, text }) {
  const map = {
    success: "border-emerald-200 text-emerald-800 bg-white",
    error: "border-red-200 text-red-800 bg-white",
    info: "border-violet-200 text-violet-800 bg-white",
  };
  return (
    <div className={`px-4 py-3 rounded-2xl shadow-lg border text-sm font-black flex items-start gap-3 ${map[type] || map.info}`}>
      <span className="text-lg">{type === "success" ? "✅" : type === "error" ? "⛔" : "ℹ️"}</span>
      <div className="leading-snug">{text}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {children}
        <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-black/5" />
      </div>
      <button onClick={onClose} className="fixed inset-0" aria-label="close" />
    </div>
  );
}

function RequestCard({ r, formatDate, updateRequestStatus, openDetails }) {
  const status = r.status;

  const statusStyle =
    status === "NEW"
      ? "border-red-200 bg-red-50"
      : status === "CONTACTED"
      ? "border-amber-200 bg-amber-50"
      : "border-emerald-200 bg-emerald-50";

  const badgeStyle =
    status === "NEW"
      ? "bg-red-600 text-white"
      : status === "CONTACTED"
      ? "bg-amber-500 text-white"
      : "bg-emerald-600 text-white";

  return (
    <div className={`rounded-2xl border p-5 ${statusStyle} shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-700">
            {formatDate(r.created_at)}
          </p>
          <p className="text-xl font-black text-gray-900 mt-1">{r.visitor_name}</p>

          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>📞 {r.visitor_phone || "—"}</p>
            <p>✉️ {r.visitor_email || "—"}</p>
            <p>🏙️ {r.visitor_city || "—"} • Qté: {r.qty || "—"}</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-black ${badgeStyle}`}>
          {status}
        </div>
      </div>

      {/* Message - FIX LONG MESSAGE */}
      <div className="mt-4 rounded-2xl bg-white border border-gray-200 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gray-500">
          Message
        </p>
        <p className="mt-2 text-gray-800 text-sm leading-relaxed break-words whitespace-pre-wrap line-clamp-3">
          {r.visitor_message || "—"}
        </p>

        <button
          onClick={openDetails}
          className="mt-2 text-violet-700 font-black text-sm hover:underline"
        >
          Voir détails
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => updateRequestStatus(r.id, "CONTACTED")}
          className="px-4 py-2 rounded-xl font-black bg-amber-500 text-white hover:opacity-95 transition"
        >
          CONTACTÉ
        </button>
        <button
          onClick={() => updateRequestStatus(r.id, "CLOSED")}
          className="px-4 py-2 rounded-xl font-black bg-emerald-600 text-white hover:opacity-95 transition"
        >
          FERMÉ
        </button>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-black text-sm border transition ${
        active
          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-black border transition ${
        active
          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function Box({ children }) {
  return (
    <div className="mt-7 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      {children}
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
        className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-300 bg-white"
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
        className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-300 bg-white"
      />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
      <p className="text-[11px] uppercase font-black tracking-[0.14em] text-gray-500">{label}</p>
      <p className="text-gray-800 font-semibold mt-1 break-words">{value}</p>
    </div>
  );
}
