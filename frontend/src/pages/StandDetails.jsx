import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const API_HOST = "http://localhost:5000";

export default function StandDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [stand, setStand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openOrder, setOpenOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [msg, setMsg] = useState("");

  const [orderForm, setOrderForm] = useState({
    visitor_name: "",
    visitor_phone: "",
    visitor_email: "",
    visitor_city: "",
    qty: 1,
    visitor_message: "",
  });

  const cover = useMemo(() => {
    return stand?.cover_image ? `${API_HOST}${stand.cover_image}` : null;
  }, [stand]);

  const logo = useMemo(() => {
    return stand?.logo ? `${API_HOST}${stand.logo}` : null;
  }, [stand]);

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const { data: s } = await api.get(`/stands/${id}`);
      setStand(s);

      const { data: p } = await api.get(`/products/stand/${id}`);
      setProducts(Array.isArray(p) ? p : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Erreur chargement stand");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openOrderModal = (product) => {
    setSelectedProduct(product || null);
    setOpenOrder(true);
    setMsg("");
    setErr("");
  };

  const sendOrder = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!orderForm.visitor_name) return setMsg("Nom obligatoire");
    if (!orderForm.visitor_phone) return setMsg("Téléphone obligatoire");

    try {
      await api.post("/requests", {
        stand_id: Number(id),
        product_id: selectedProduct?.id || null,
        ...orderForm,
        qty: Number(orderForm.qty || 1),
      });

      setMsg("✅ Votre demande a été envoyée !");
      setOrderForm({
        visitor_name: "",
        visitor_phone: "",
        visitor_email: "",
        visitor_city: "",
        qty: 1,
        visitor_message: "",
      });

      setTimeout(() => setOpenOrder(false), 800);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Erreur envoi demande");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => nav("/stands")}
          className="text-sm font-black text-violet-700 hover:underline"
        >
          ← Retour aux stands
        </button>

        {loading ? (
          <div className="mt-8 text-gray-600 font-semibold">Chargement...</div>
        ) : err ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {err}
          </div>
        ) : (
          <>
            {/* HERO */}
            <div className="mt-6 rounded-[32px] overflow-hidden border border-gray-200 shadow-[0_20px_70px_rgba(16,24,40,0.10)] bg-white">
              <div className="relative h-[320px] bg-gray-100">
                {cover ? (
                  <img src={cover} alt="cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
                    NO COVER
                  </div>
                )}

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                {/* Header content */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* LOGO BOX (WHITE PURE) */}
                    <div className="w-[92px] h-[92px] rounded-[26px] bg-white shadow-xl overflow-hidden flex items-center justify-center border border-white/60">
                      {logo ? (
                        <img
                          src={logo}
                          alt="logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-gray-400 font-black">LOGO</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-white/85 text-xs font-bold uppercase tracking-[0.18em]">
                        Coopérative
                      </p>
                      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow line-clamp-2">
                        {stand.stand_name}
                      </h1>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white/90 text-xs font-black">
                          {stand.city || "—"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white/90 text-xs font-black">
                          {stand.category || "—"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white/90 text-xs font-black line-clamp-1">
                          {stand.address || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openOrderModal(null)}
                    className="px-6 py-3 rounded-2xl font-black bg-white text-violet-700 shadow-lg hover:bg-gray-50 transition active:translate-y-[1px]"
                  >
                    Contacter la coopérative
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="p-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                      Présentation
                    </p>
                    <h2 className="text-2xl font-black text-gray-900 mt-2">
                      À propos du stand
                    </h2>
                  </div>

                  <button
                    onClick={fetchAll}
                    className="px-5 py-3 rounded-2xl font-black bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm active:translate-y-[1px]"
                  >
                    Rafraîchir
                  </button>
                </div>

                <p className="text-gray-700 mt-4 leading-relaxed max-w-5xl">
                  {stand.description || "—"}
                </p>
              </div>
            </div>

            {/* PRODUCTS HEADER */}
            <div className="mt-12 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                  Produits
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  Catalogue
                </h2>
                <p className="text-gray-600 mt-2">
                  Cliquez sur un produit pour demander ou commander.
                </p>
              </div>
            </div>

            {/* PRODUCTS LIST */}
            {products.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-8 text-gray-600 font-semibold shadow-sm">
                Aucun produit pour le moment.
              </div>
            ) : (
              <div className="mt-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} onOrder={() => openOrderModal(p)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL ORDER */}
      {openOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpenOrder(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.35)] overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-3 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  Demande / Commande
                </p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  {selectedProduct ? selectedProduct.title : "Contacter la coopérative"}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Remplissez vos informations. La coopérative verra la demande dans son dashboard.
                </p>
              </div>
              <button
                onClick={() => setOpenOrder(false)}
                className="px-3 py-2 rounded-xl border border-gray-200 font-black hover:bg-white transition"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={sendOrder} className="p-6 grid gap-3">
              {err && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}
              {msg && (
                <div className="rounded-2xl border border-violet-200 bg-[#f7f3fb] px-4 py-3 text-sm text-[#41217f]">
                  {msg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Nom complet *"
                  value={orderForm.visitor_name}
                  onChange={(v) => setOrderForm((f) => ({ ...f, visitor_name: v }))}
                />
                <Input
                  label="Téléphone *"
                  value={orderForm.visitor_phone}
                  onChange={(v) => setOrderForm((f) => ({ ...f, visitor_phone: v }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Email"
                  value={orderForm.visitor_email}
                  onChange={(v) => setOrderForm((f) => ({ ...f, visitor_email: v }))}
                />
                <Input
                  label="Ville"
                  value={orderForm.visitor_city}
                  onChange={(v) => setOrderForm((f) => ({ ...f, visitor_city: v }))}
                />
              </div>

              {selectedProduct && (
                <Input
                  label="Quantité"
                  value={orderForm.qty}
                  onChange={(v) => setOrderForm((f) => ({ ...f, qty: v }))}
                />
              )}

              <Textarea
                label="Message"
                value={orderForm.visitor_message}
                onChange={(v) => setOrderForm((f) => ({ ...f, visitor_message: v }))}
              />

              <button className="mt-2 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-[0_12px_25px_rgba(124,58,237,0.28)] hover:opacity-95 transition active:translate-y-[1px]">
                Envoyer la demande
              </button>

              <p className="text-xs text-gray-500 mt-2">
                ⚡ Votre demande sera visible sur le dashboard de la coopérative.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function ProductCard({ p, onOrder }) {
  // ✅ IMPORTANT: works for both image and main_image
  const imgPath = p.image || p.main_image;
  const img = imgPath ? `http://localhost:5000${imgPath}` : null;

  return (
    <div className="group rounded-[28px] overflow-hidden bg-white border border-gray-200 shadow-[0_10px_30px_rgba(16,24,40,0.06)] hover:shadow-[0_18px_45px_rgba(16,24,40,0.12)] transition">
      {/* IMAGE */}
      <div className="relative h-[220px] bg-gray-100 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
            NO IMAGE
          </div>
        )}

        {p.price != null && (
          <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/95 backdrop-blur text-sm font-black text-violet-700 shadow-md border border-white/60">
            {p.price} DH
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-6">
        <p className="text-xl font-black text-gray-900 line-clamp-1">{p.title}</p>

        {p.description && (
          <p className="text-gray-600 mt-2 leading-relaxed line-clamp-2">{p.description}</p>
        )}

        <button
          onClick={onOrder}
          className="mt-5 w-full px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-[0_12px_25px_rgba(124,58,237,0.25)] hover:opacity-95 transition active:translate-y-[1px]"
          type="button"
        >
          Demander / Commander
        </button>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Input({ label, value, onChange }) {
  return (
    <div>
      {label && (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
          {label}
        </p>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      {label && (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
          {label}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}
