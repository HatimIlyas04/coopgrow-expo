import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { imageUrl } from "../utils/imageUrl";

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

  const cover = useMemo(
    () => (stand?.cover_image ? imageUrl(stand.cover_image) : null),
    [stand]
  );
  const logo = useMemo(
    () => (stand?.logo ? imageUrl(stand.logo) : null),
    [stand]
  );

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
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5ff] via-white to-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => nav("/stands")}
          className="inline-flex items-center gap-2 text-sm font-black text-violet-700 hover:text-violet-800 transition"
        >
          <span>←</span>
          <span>Retour aux stands</span>
        </button>

        {loading ? (
          <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-violet-600 animate-pulse" />
              <p className="text-gray-700 font-bold">Chargement du stand...</p>
            </div>
          </div>
        ) : err ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {err}
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-[32px] overflow-hidden border border-gray-200 bg-white shadow-[0_20px_70px_rgba(16,24,40,0.10)]">
              <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[500px] bg-gray-100">
                {cover ? (
                  <img
                    src={cover}
                    alt="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 font-black text-lg">
                    NO COVER
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                <div className="relative z-10 flex min-h-[360px] sm:min-h-[420px] md:min-h-[500px] flex-col justify-end p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end min-w-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[24px] bg-white/95 backdrop-blur shadow-xl overflow-hidden flex items-center justify-center border border-white/70 shrink-0">
                        {logo ? (
                          <img
                            src={logo}
                            alt="logo"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-gray-400 font-black text-sm">
                            LOGO
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-white/85 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em]">
                          Coopérative
                        </p>

                        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight break-words max-w-3xl">
                          {stand.stand_name}
                        </h1>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white text-xs sm:text-sm font-bold">
                            {stand.city || "—"}
                          </span>
                          <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white text-xs sm:text-sm font-bold">
                            {stand.category || "—"}
                          </span>
                          <span className="max-w-full px-3 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur text-white text-xs sm:text-sm font-bold break-words">
                            {stand.address || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openOrderModal(null)}
                      className="w-full md:w-auto px-6 py-3 rounded-2xl font-black bg-white text-violet-700 shadow-lg hover:bg-gray-50 transition active:translate-y-[1px]"
                    >
                      Contacter la coopérative
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                      Présentation
                    </p>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                      À propos du stand
                    </h2>
                  </div>

                  <button
                    onClick={fetchAll}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm active:translate-y-[1px]"
                  >
                    Rafraîchir
                  </button>
                </div>

                <p className="text-gray-700 mt-4 leading-7 max-w-5xl text-sm sm:text-base break-words">
                  {stand.description || "—"}
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                  Produits
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  Catalogue
                </h2>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Cliquez sur un produit pour demander ou commander.
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-6 sm:p-8 text-gray-600 font-semibold shadow-sm">
                Aucun produit pour le moment.
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    onOrder={() => openOrderModal(p)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {openOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-5">
          <div
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpenOrder(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-2xl bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.35)] overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between gap-3 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  Demande / Commande
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 break-words">
                  {selectedProduct
                    ? selectedProduct.title
                    : "Contacter la coopérative"}
                </h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Remplissez vos informations. La coopérative verra la demande
                  dans son dashboard.
                </p>
              </div>
              <button
                onClick={() => setOpenOrder(false)}
                className="px-3 py-2 rounded-xl border border-gray-200 font-black hover:bg-white transition shrink-0"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={sendOrder} className="p-5 sm:p-6 grid gap-3">
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
                  onChange={(v) =>
                    setOrderForm((f) => ({ ...f, visitor_name: v }))
                  }
                />
                <Input
                  label="Téléphone *"
                  value={orderForm.visitor_phone}
                  onChange={(v) =>
                    setOrderForm((f) => ({ ...f, visitor_phone: v }))
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Email"
                  value={orderForm.visitor_email}
                  onChange={(v) =>
                    setOrderForm((f) => ({ ...f, visitor_email: v }))
                  }
                />
                <Input
                  label="Ville"
                  value={orderForm.visitor_city}
                  onChange={(v) =>
                    setOrderForm((f) => ({ ...f, visitor_city: v }))
                  }
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
                onChange={(v) =>
                  setOrderForm((f) => ({ ...f, visitor_message: v }))
                }
              />

              <button className="mt-2 px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-[0_12px_25px_rgba(124,58,237,0.28)] hover:opacity-95 transition active:translate-y-[1px]">
                Envoyer la demande
              </button>

              <p className="text-xs text-gray-500 mt-2">
                ⚡ Votre demande sera visible sur le dashboard de la
                coopérative.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ p, onOrder }) {
  const imgPath = p.image || p.main_image;
  const img = imgPath ? imageUrl(imgPath) : null;

  return (
    <div className="group rounded-[28px] overflow-hidden bg-white border border-gray-200 shadow-[0_10px_30px_rgba(16,24,40,0.06)] hover:shadow-[0_18px_45px_rgba(16,24,40,0.12)] transition duration-300">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.title}
            className="w-full h-full object-contain bg-white p-3 group-hover:scale-[1.03] transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
            NO IMAGE
          </div>
        )}

        {p.price != null && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs sm:text-sm font-black text-violet-700 shadow-md border border-white/60">
            {p.price} DH
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 md:p-6">
        <p className="text-lg sm:text-xl font-black text-gray-900 break-words line-clamp-2 min-h-[3.5rem]">
          {p.title}
        </p>

        {p.description && (
          <p className="text-gray-600 mt-2 leading-6 text-sm sm:text-base line-clamp-3 min-h-[4.5rem] break-words">
            {p.description}
          </p>
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