import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/spinner";

if (loading) return <Spinner />;


const API_HOST = "http://localhost:5000";

export default function StandPage() {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // UI states
  const [q, setQ] = useState("");
  const [city, setCity] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const fetchStands = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/stands");
      setStands(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Erreur lors du chargement des stands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStands();
  }, []);

  const cities = useMemo(() => {
    const set = new Set();
    stands.forEach((s) => s.city && set.add(s.city));
    return ["ALL", ...Array.from(set)];
  }, [stands]);

  const categories = useMemo(() => {
    const set = new Set();
    stands.forEach((s) => s.category && set.add(s.category));
    return ["ALL", ...Array.from(set)];
  }, [stands]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return stands.filter((s) => {
      const matchTerm =
        !term ||
        (s.stand_name || "").toLowerCase().includes(term) ||
        (s.description || "").toLowerCase().includes(term) ||
        (s.category || "").toLowerCase().includes(term) ||
        (s.city || "").toLowerCase().includes(term);

      const matchCity = city === "ALL" || s.city === city;
      const matchCat = category === "ALL" || s.category === category;

      return matchTerm && matchCity && matchCat;
    });
  }, [stands, q, city, category]);

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* HERO */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        {/* subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 pointer-events-none" />
        {/* soft blobs */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-violet-200/35 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-24 w-[460px] h-[460px] rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-700">
            Salon des coopératives
          </p>

          <h1 className="mt-3 text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            Découvrez des stands <span className="text-violet-700">modernes</span> <br />
            et des produits authentiques
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
            Parcourez les stands, consultez leurs produits et envoyez une demande en quelques secondes.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-9 rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(16,24,40,0.08)] p-4 md:p-5">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <Label>Recherche</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔎</div>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ex: miel, argan, tapis, artisanat..."
                    className="mt-1 w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>

              <div>
                <Label>Ville</Label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "Toutes les villes" : c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Catégorie</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "Toutes les catégories" : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Résultats : <span className="font-black text-gray-900">{filtered.length}</span> stand(s)
              </p>

              <button
                onClick={fetchStands}
                className="px-5 py-3 rounded-2xl font-black bg-violet-600 text-white hover:bg-violet-700 transition shadow-[0_10px_25px_rgba(124,58,237,0.25)] active:translate-y-[1px]"
              >
                Rafraîchir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-gray-600 font-semibold">Chargement...</div>
        ) : err ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-semibold">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-[0_10px_30px_rgba(16,24,40,0.06)]">
            <p className="text-gray-900 font-black text-lg">Aucun stand trouvé</p>
            <p className="text-gray-600 mt-2">Essayez une autre recherche ou filtre.</p>
          </div>
        ) : (
          // ✅ cards kbar + spacing zwina
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {filtered.map((s) => (
              <StandCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StandCard({ s }) {
  const cover = s.cover_image ? `${API_HOST}${s.cover_image}` : null;
  const logo = s.logo ? `${API_HOST}${s.logo}` : null;

  return (
    <Link
      to={`/stands/${s.id}`}
      className="group relative rounded-[30px] border border-gray-200 bg-white overflow-hidden transition
                 shadow-[0_14px_40px_rgba(16,24,40,0.08)]
                 hover:shadow-[0_22px_60px_rgba(16,24,40,0.14)]"
    >
      {/* Cover */}
      {/* ✅ bigger + fixed format */}
      <div className="relative h-[220px] bg-gray-100 overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt="cover"
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
            NO COVER
          </div>
        )}

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur border border-white/40 shadow">
          <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-900">
            Stand
          </span>
        </div>

        {/* Logo + title */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* ✅ logo pure white */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-white/70 shadow-md overflow-hidden flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-[10px] font-black text-gray-400">LOGO</span>
              )}
            </div>

            <div className="text-white min-w-0">
              <p className="text-xl font-black leading-tight line-clamp-1 drop-shadow-sm">
                {s.stand_name}
              </p>
              <p className="text-xs text-white/85 font-semibold mt-1 line-clamp-1">
                {s.city || "—"} • {s.category || "—"}
              </p>
            </div>
          </div>

          {/* arrow */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 border border-white/25 backdrop-blur text-white font-black text-sm">
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Info row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-black border border-violet-100">
              {s.category || "—"}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-black border border-gray-100">
              {s.city || "—"}
            </span>
          </div>

          <span className="text-xs font-black text-gray-400">#{s.id}</span>
        </div>

        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {s.description || "Aucune description pour le moment."}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-violet-700 font-black text-sm">
          Voir le stand
          <span className="group-hover:translate-x-1 transition">→</span>
        </div>
      </div>

      {/* bottom highlight */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600/20 via-purple-600/15 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition" />
    </Link>
  );
}

function Label({ children }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
      {children}
    </p>
  );
}
