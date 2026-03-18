import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/spinner";
import { imageUrl } from "../utils/imageUrl";

/* ─── Scoped styles ─────────────────────────────────────────── */
const css = `
  .sp-root * { box-sizing: border-box; }

  .sp-root {
    min-height: 100vh;
    background: #faf8ff;
  }

  /* ── Hero ──────────────────────────────────────────────────── */
  .sp-hero {
    position: relative;
    overflow: hidden;
    padding-top: 52px;
  }
  @media (min-width: 640px)  { .sp-hero { padding-top: 68px; } }
  @media (min-width: 1024px) { .sp-hero { padding-top: 88px; } }

  .sp-hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #f0ebff 0%, #ffffff 48%, #fdf0ff 100%);
  }
  .sp-blob {
    position: absolute; border-radius: 50%; filter: blur(72px); pointer-events: none;
  }
  .sp-blob-1 { width: 380px; height: 380px; top: -100px; left: -80px;  background: rgba(139,92,246,.13); }
  .sp-blob-2 { width: 460px; height: 460px; top: 40px;  right: -100px; background: rgba(217,70,239,.09); }
  .sp-blob-3 { width: 320px; height: 320px; bottom: -80px; left: 38%; background: rgba(99,102,241,.08); }

  .sp-hero-inner {
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }
  @media (min-width: 640px)  { .sp-hero-inner { padding: 0 32px; } }
  @media (min-width: 1024px) { .sp-hero-inner { padding: 0 48px; } }

  .sp-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 99px;
    background: rgba(255,255,255,.85); backdrop-filter: blur(10px);
    border: 1px solid rgba(139,92,246,.18);
    font-size: 10px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
    color: #6d28d9; box-shadow: 0 2px 10px rgba(109,40,217,.08);
  }
  .sp-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #c026d3);
    animation: sp-pulse 2s ease-in-out infinite;
  }
  @keyframes sp-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,58,237,.35); }
    50%      { box-shadow: 0 0 0 5px rgba(124,58,237,0); }
  }

  .sp-h1 {
    margin: 18px 0 0;
    font-size: clamp(28px, 5.5vw, 62px);
    font-weight: 900; line-height: 1.04; letter-spacing: -.03em;
    color: #0f0a1e;
  }
  .sp-h1-accent {
    display: block;
    background: linear-gradient(110deg, #6d28d9 0%, #c026d3 55%, #4338ca 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sp-hero-sub {
    margin: 18px 0 0;
    font-size: clamp(14px, 1.8vw, 18px);
    color: #6b5e8c; line-height: 1.7; max-width: 540px;
  }

  /* ── Search Panel ──────────────────────────────────────────── */
  .sp-search-panel {
    margin-top: 36px;
    border-radius: 28px;
    border: 1px solid rgba(255,255,255,.7);
    background: rgba(255,255,255,.82); backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(109,40,217,.10), 0 1px 0 rgba(255,255,255,.9) inset;
    padding: 22px 24px 18px;
  }
  @media (min-width: 640px) { .sp-search-panel { padding: 26px 28px 22px; } }

  .sp-search-grid {
    display: grid; grid-template-columns: 1fr; gap: 14px;
  }
  @media (min-width: 640px) {
    .sp-search-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1024px) {
    .sp-search-grid { grid-template-columns: 5fr 3fr 3fr auto; align-items: end; }
  }

  .sp-field-label {
    display: block;
    font-size: 9.5px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
    color: #9580b0; margin-bottom: 7px;
  }

  .sp-input, .sp-select {
    width: 100%; padding: 12px 16px; border-radius: 14px;
    border: 1.5px solid rgba(139,92,246,.15); background: #fff;
    font-size: 14px; color: #1e1030; outline: none;
    transition: border-color .2s, box-shadow .2s;
    -webkit-appearance: none; appearance: none;
    font-family: inherit;
  }
  .sp-input::placeholder { color: #b8aece; }
  .sp-input:focus, .sp-select:focus {
    border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,.12);
  }

  .sp-input-wrap { position: relative; }
  .sp-input-wrap svg {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    width: 15px; height: 15px; color: #b8aece; pointer-events: none;
  }
  .sp-input-wrap .sp-input { padding-left: 42px; }

  .sp-select-wrap { position: relative; }
  .sp-select-wrap::after {
    content: ''; position: absolute; right: 14px; top: 50%;
    transform: translateY(-50%) rotate(0deg);
    border: 5px solid transparent; border-top-color: #9580b0;
    margin-top: 3px; pointer-events: none;
  }

  .sp-btn-refresh {
    width: 100%; padding: 12px 22px; border-radius: 14px;
    font-size: 13.5px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, #6d28d9 0%, #c026d3 100%);
    border: none; cursor: pointer;
    box-shadow: 0 8px 24px rgba(109,40,217,.28);
    transition: opacity .18s, transform .15s, box-shadow .18s;
    white-space: nowrap; font-family: inherit;
  }
  .sp-btn-refresh:hover { opacity: .92; box-shadow: 0 12px 32px rgba(109,40,217,.35); }
  .sp-btn-refresh:active { transform: translateY(1px); }

  .sp-search-footer {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
    margin-top: 16px; padding-top: 16px;
    border-top: 1px solid rgba(139,92,246,.08);
  }
  .sp-result-count { font-size: 13px; font-weight: 700; color: #6b5e8c; }
  .sp-result-count strong { color: #6d28d9; }
  .sp-filters-row { display: flex; flex-wrap: wrap; gap: 6px; }

  /* wave */
  .sp-wave {
    display: block; width: 100%; margin-top: 40px;
    height: 48px; overflow: hidden;
  }
  @media (min-width: 640px) { .sp-wave { height: 64px; } }

  /* ── List ──────────────────────────────────────────────────── */
  .sp-list {
    max-width: 1280px; margin: 0 auto;
    padding: 40px 20px 80px;
  }
  @media (min-width: 640px)  { .sp-list { padding: 48px 32px 96px; } }
  @media (min-width: 1024px) { .sp-list { padding: 56px 48px 112px; } }

  .sp-grid {
    display: grid; grid-template-columns: 1fr; gap: 20px;
  }
  @media (min-width: 540px)  { .sp-grid { grid-template-columns: repeat(2, 1fr); gap: 22px; } }
  @media (min-width: 1100px) { .sp-grid { grid-template-columns: repeat(3, 1fr); gap: 26px; } }

  /* ── States ────────────────────────────────────────────────── */
  .sp-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 20px; gap: 14px;
    color: #9580b0; font-weight: 600; font-size: 14px;
  }
  .sp-error {
    border-radius: 20px; border: 1px solid rgba(220,38,38,.2);
    background: #fef2f2; color: #dc2626;
    padding: 14px 20px; font-weight: 600; font-size: 14px;
  }
  .sp-empty {
    border-radius: 28px; border: 2px dashed rgba(139,92,246,.2);
    background: rgba(255,255,255,.7); backdrop-filter: blur(10px);
    padding: 64px 24px; text-align: center;
  }
  .sp-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: linear-gradient(135deg, #ede9fe, #fae8ff);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin: 0 auto 20px;
    box-shadow: 0 8px 24px rgba(109,40,217,.12);
  }
  .sp-empty h3 {
    font-size: clamp(18px, 3vw, 24px); font-weight: 900;
    color: #0f0a1e; margin: 0 0 8px; letter-spacing: -.02em;
  }
  .sp-empty p {
    font-size: 14px; color: #9580b0; margin: 0;
    max-width: 320px; margin-inline: auto;
  }

  /* ── Card ──────────────────────────────────────────────────── */
  .sp-card {
    display: block; border-radius: 26px; overflow: hidden;
    background: #fff; border: 1px solid rgba(139,92,246,.1);
    box-shadow: 0 4px 20px rgba(15,10,30,.06);
    text-decoration: none;
    transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease;
  }
  .sp-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 56px rgba(109,40,217,.16);
  }

  .sp-cover {
    position: relative; height: 210px;
    background: #e8e3f5; overflow: hidden;
  }
  @media (min-width: 540px)  { .sp-cover { height: 224px; } }
  @media (min-width: 1100px) { .sp-cover { height: 236px; } }

  .sp-cover img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    transition: transform .5s cubic-bezier(.22,1,.36,1);
  }
  .sp-card:hover .sp-cover img { transform: scale(1.05); }

  .sp-cover-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #ede9fe, #fae8ff);
    font-size: 11px; font-weight: 800; letter-spacing: .22em;
    color: #a78bfa; text-transform: uppercase;
  }
  .sp-cover-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,10,30,.65) 0%, rgba(15,10,30,.08) 55%, transparent 100%);
  }

  .sp-cover-badge {
    position: absolute; top: 14px; left: 14px;
    padding: 5px 14px; border-radius: 99px;
    background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,.8);
    font-size: 9.5px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
    color: #6d28d9; box-shadow: 0 4px 12px rgba(0,0,0,.1);
  }

  .sp-cover-identity {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 14px 16px; display: flex; align-items: flex-end; gap: 12px;
  }
  .sp-logo {
    flex-shrink: 0; width: 52px; height: 52px; border-radius: 16px;
    background: #fff; border: 2px solid rgba(255,255,255,.9);
    box-shadow: 0 8px 20px rgba(0,0,0,.18); overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  @media (min-width: 540px) { .sp-logo { width: 58px; height: 58px; } }
  .sp-logo img { width: 100%; height: 100%; object-fit: cover; }
  .sp-logo-ph { font-size: 8.5px; font-weight: 800; letter-spacing: .14em; color: #c4b5fd; }
  .sp-name-wrap { min-width: 0; flex: 1; }
  .sp-name {
    font-size: clamp(15px, 2vw, 18px); font-weight: 900; color: #fff;
    line-height: 1.2; letter-spacing: -.01em;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    text-shadow: 0 1px 6px rgba(0,0,0,.3);
  }
  .sp-meta {
    margin-top: 3px; font-size: 12px; font-weight: 600;
    color: rgba(255,255,255,.85);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sp-cover-arrow {
    flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: #fff;
    transition: background .2s, transform .2s;
  }
  .sp-card:hover .sp-cover-arrow { background: rgba(255,255,255,.3); transform: translateX(2px); }

  /* body */
  .sp-body { padding: 18px 20px; }
  @media (min-width: 540px) { .sp-body { padding: 20px 22px; } }

  .sp-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .sp-desc {
    font-size: 13.5px; line-height: 1.72; color: #6b5e8c;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden; min-height: 70px;
  }
  .sp-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px; padding-top: 14px;
    border-top: 1px solid rgba(139,92,246,.08);
  }
  .sp-cta {
    font-size: 13.5px; font-weight: 800; color: #6d28d9;
    display: flex; align-items: center; gap: 6px;
    transition: color .18s;
  }
  .sp-card:hover .sp-cta { color: #c026d3; }
  .sp-cta-arrow { transition: transform .18s; }
  .sp-card:hover .sp-cta-arrow { transform: translateX(3px); }
  .sp-star {
    width: 36px; height: 36px; border-radius: 10px;
    background: #f5f3ff; color: #7c3aed;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; transition: background .2s;
  }
  .sp-card:hover .sp-star { background: #ede9fe; }

  .sp-bar {
    height: 3px;
    background: linear-gradient(90deg, #6d28d9 0%, #c026d3 55%, #4338ca 100%);
    opacity: .85;
  }

  /* ── Label ─────────────────────────────────────────────────── */
  .sp-label {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 99px;
    background: #f5f3ff; border: 1px solid rgba(139,92,246,.15);
    font-size: 11px; font-weight: 700; color: #6d28d9; white-space: nowrap;
  }
  .sp-label-filter {
    background: rgba(255,255,255,.75);
    border-color: rgba(139,92,246,.2); color: #7c3aed; font-size: 10.5px;
  }
`;

export default function StandPage() {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const fetchStands = async () => {
    setLoading(true); setErr("");
    const cached = localStorage.getItem("stands_cache");
    if (cached) { try { setStands(JSON.parse(cached)); } catch {} }
    try {
      const { data } = await api.get("/stands");
      const arr = Array.isArray(data) ? data : [];
      setStands(arr);
      localStorage.setItem("stands_cache", JSON.stringify(arr));
    } catch (e) {
      setErr(e?.response?.data?.message || "Erreur lors du chargement des stands");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStands(); }, []);

  const cities = useMemo(() => {
    const set = new Set();
    stands.forEach(s => s.city && set.add(s.city));
    return ["ALL", ...Array.from(set)];
  }, [stands]);

  const categories = useMemo(() => {
    const set = new Set();
    stands.forEach(s => s.category && set.add(s.category));
    return ["ALL", ...Array.from(set)];
  }, [stands]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return stands.filter(s => {
      const matchTerm = !term ||
        (s.stand_name || "").toLowerCase().includes(term) ||
        (s.description || "").toLowerCase().includes(term) ||
        (s.category || "").toLowerCase().includes(term) ||
        (s.city || "").toLowerCase().includes(term);
      return matchTerm && (city === "ALL" || s.city === city) && (category === "ALL" || s.category === category);
    });
  }, [stands, q, city, category]);

  return (
    <div className="sp-root">
      <style>{css}</style>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="sp-hero">
        <div className="sp-hero-bg" />
        <div className="sp-blob sp-blob-1" />
        <div className="sp-blob sp-blob-2" />
        <div className="sp-blob sp-blob-3" />

        <div className="sp-hero-inner">
          <div className="sp-eyebrow">
            <span className="sp-eyebrow-dot" />
            Salon des coopératives
          </div>

          <h1 className="sp-h1">
            Découvrez des stands modernes
            <span className="sp-h1-accent">et des produits authentiques</span>
          </h1>

          <p className="sp-hero-sub">
            Parcourez les stands, consultez leurs produits et envoyez une
            demande en quelques secondes.
          </p>

          {/* search panel */}
          <div className="sp-search-panel">
            <div className="sp-search-grid">
              <div>
                <label className="sp-field-label">Recherche</label>
                <div className="sp-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
                  </svg>
                  <input
                    className="sp-input"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Ex: miel, argan, tapis, artisanat..."
                  />
                </div>
              </div>

              <div>
                <label className="sp-field-label">Ville</label>
                <div className="sp-select-wrap">
                  <select className="sp-select" value={city} onChange={e => setCity(e.target.value)}>
                    {cities.map(c => <option key={c} value={c}>{c === "ALL" ? "Toutes les villes" : c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="sp-field-label">Catégorie</label>
                <div className="sp-select-wrap">
                  <select className="sp-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "Toutes les catégories" : c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <button className="sp-btn-refresh" onClick={fetchStands} type="button">
                  ↻ Rafraîchir
                </button>
              </div>
            </div>

            <div className="sp-search-footer">
              <p className="sp-result-count">
                Résultats : <strong>{filtered.length}</strong> stand{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="sp-filters-row">
                <span className="sp-label sp-label-filter">
                  {city === "ALL" ? "Toutes les villes" : city}
                </span>
                <span className="sp-label sp-label-filter">
                  {category === "ALL" ? "Toutes les catégories" : category}
                </span>
              </div>
            </div>
          </div>

          {/* wave divider */}
          <svg className="sp-wave" viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32 C360,72 1080,-8 1440,32 L1440,64 L0,64 Z" fill="#faf8ff" />
          </svg>
        </div>
      </section>

      {/* ── LIST ──────────────────────────────────────────── */}
      <section className="sp-list">
        {loading ? (
          <div className="sp-loading">
            <Spinner />
            <p>Chargement des stands...</p>
          </div>
        ) : err ? (
          <div className="sp-error">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="sp-empty">
            <div className="sp-empty-icon">🔎</div>
            <h3>Aucun stand trouvé</h3>
            <p>Essayez une autre recherche ou modifiez vos filtres.</p>
          </div>
        ) : (
          <div className="sp-grid">
            {filtered.map(s => <StandCard key={s.id} s={s} />)}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Stand Card ─────────────────────────────────────────────── */
function StandCard({ s }) {
  const cover = s.cover_image ? imageUrl(s.cover_image) : null;
  const logo  = s.logo        ? imageUrl(s.logo)        : null;

  return (
    <Link to={`/stands/${s.id}`} className="sp-card">
      <div className="sp-cover">
        {cover
          ? <img src={cover} alt={s.stand_name} />
          : <div className="sp-cover-placeholder">No Cover</div>
        }
        <div className="sp-cover-overlay" />
        <span className="sp-cover-badge">Stand</span>

        <div className="sp-cover-identity">
          <div className="sp-logo">
            {logo
              ? <img src={logo} alt={s.stand_name} />
              : <span className="sp-logo-ph">Logo</span>
            }
          </div>
          <div className="sp-name-wrap">
            <div className="sp-name">{s.stand_name}</div>
            <div className="sp-meta">{s.city || "—"} · {s.category || "—"}</div>
          </div>
          <div className="sp-cover-arrow">→</div>
        </div>
      </div>

      <div className="sp-body">
        <div className="sp-tags">
          <Label>{s.category || "—"}</Label>
          <Label>{s.city || "—"}</Label>
          <Label>#{s.id}</Label>
        </div>
        <p className="sp-desc">{s.description || "Aucune description pour le moment."}</p>
        <div className="sp-card-footer">
          <span className="sp-cta">
            Voir le stand
            <span className="sp-cta-arrow">→</span>
          </span>
          <span className="sp-star">✦</span>
        </div>
      </div>

      <div className="sp-bar" />
    </Link>
  );
}

function Label({ children }) {
  return <span className="sp-label">{children}</span>;
}