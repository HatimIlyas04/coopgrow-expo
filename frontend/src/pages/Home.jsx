// Home.jsx
import { Link } from "react-router-dom";




export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f3fb] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-[#8a22a7]/20 blur-3xl" />
        <div className="absolute top-40 -left-28 w-[420px] h-[420px] rounded-full bg-[#41217f]/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-[520px] h-[520px] rounded-full bg-[#dccfe2]/70 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* LEFT */}
          <div className="lg:col-span-7">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-black/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#8a22a7] animate-pulse" />
              <p className="text-sm font-semibold text-[#41217f]">
                Premier salon en ligne dédié aux coopératives au Maroc
              </p>
            </div>

            {/* Title */}
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-[#1f1633]">
              Découvrez les coopératives marocaines{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#41217f] via-[#8a22a7] to-[#b42bd3]">
                en un seul endroit
              </span>
              .
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-lg leading-relaxed text-gray-700 max-w-2xl">
              CoopGrow est une plateforme qui permet aux{" "}
              <span className="font-bold text-[#41217f]">visiteurs</span> de trouver,
              explorer et contacter des coopératives marocaines facilement, et aux{" "}
              <span className="font-bold text-[#41217f]">coopératives</span> de présenter
              leurs produits, recevoir des demandes et développer leurs opportunités.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/stands"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#41217f] via-[#8a22a7] to-[#b42bd3] text-white font-bold shadow-md hover:opacity-95 hover:-translate-y-[1px] transition-all"
              >
                Explorer les stands
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-[#41217f] font-bold border border-[#dccfe2] shadow-sm hover:bg-[#f3eefe] hover:-translate-y-[1px] transition-all"
              >
                Espace coopérative
              </Link>
            </div>

            {/* Quick trust row */}
            <div className="mt-9 grid sm:grid-cols-3 gap-3">
              <MiniStat icon={<IconShield />} title="Fiable" text="Informations claires & structurées" />
              <MiniStat icon={<IconLightning />} title="Rapide" text="Demande envoyée en quelques secondes" />
              <MiniStat icon={<IconMap />} title="National" text="Coopératives de plusieurs villes" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[44px] bg-gradient-to-br from-[#41217f]/20 via-[#8a22a7]/20 to-[#dccfe2]/40 blur-2xl" />

              <div className="relative bg-white rounded-[44px] shadow-xl border border-black/5 overflow-hidden">
                {/* Top */}
                <div className="p-7 border-b border-black/5 bg-gradient-to-br from-white via-white to-[#f7f3fb]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                    Pour les visiteurs
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-[#1f1633] leading-tight">
                    Trouvez des produits authentiques
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    Explorez les stands, consultez les produits, puis envoyez une demande
                    avec vos informations. La coopérative vous répond ensuite directement.
                  </p>
                </div>

                {/* Steps */}
                <div className="p-7 grid gap-4">
                  <Step
                    n="1"
                    t="Choisissez un stand"
                    d="Filtrez par ville, catégorie ou recherche."
                    icon={<IconStand />}
                  />
                  <Step
                    n="2"
                    t="Explorez les produits"
                    d="Photos, prix et description disponibles."
                    icon={<IconBox />}
                  />
                  <Step
                    n="3"
                    t="Envoyez votre demande"
                    d="Vos informations arrivent à la coopérative."
                    icon={<IconMsg />}
                  />

                  <div className="pt-2">
                    <Link
                      to="/stands"
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-black bg-[#8a22a7] text-white hover:bg-[#7a1e96] transition shadow-md"
                    >
                      Voir les stands →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Coop card */}
            <div className="mt-5 rounded-[34px] bg-white/90 border border-black/5 shadow-sm p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                Pour les coopératives
              </p>
              <p className="mt-2 text-gray-700 leading-relaxed">
                Créez votre profil, ajoutez votre logo, présentez vos produits et recevez
                des demandes structurées (nom, téléphone, ville, message…).
                Tout est centralisé dans votre dashboard.
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black bg-white text-[#41217f] border border-[#dccfe2] hover:bg-[#f3eefe] transition"
              >
                Créer mon espace
                <span className="translate-y-[1px]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHY / VALUE */}
      <section className="relative max-w-7xl mx-auto px-6 pb-14">
        <div className="rounded-[34px] bg-white/85 backdrop-blur border border-black/5 shadow-sm p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                Pourquoi CoopGrow ?
              </p>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold text-[#1f1633] leading-tight">
                Une expérience simple, claire et utile pour tous
              </h2>
              <p className="mt-3 text-gray-600 max-w-3xl leading-relaxed">
                L’objectif est de faciliter la découverte des coopératives et d’aider les visiteurs
                à contacter rapidement les bons stands, tout en permettant aux coopératives
                d’être visibles et organisées.
              </p>
            </div>

            <Link
              to="/stands"
              className="shrink-0 px-6 py-3 rounded-xl font-black bg-gradient-to-r from-[#41217f] via-[#8a22a7] to-[#b42bd3] text-white shadow-md hover:opacity-95 transition"
            >
              Commencer maintenant
            </Link>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<IconEye />}
              title="Visibilité"
              text="Chaque coopérative dispose d’un stand accessible à tous."
            />
            <FeatureCard
              icon={<IconChat />}
              title="Communication"
              text="Les demandes sont claires et regroupées dans un dashboard."
            />
            <FeatureCard
              icon={<IconStar />}
              title="Valorisation"
              text="Une vitrine moderne qui met en avant les produits et l’identité."
            />
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS */}
      <section className="relative max-w-7xl mx-auto px-6 pb-14">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visitors */}
          <div className="rounded-[34px] bg-white/90 border border-black/5 shadow-sm p-8">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f3eefe] border border-[#dccfe2] flex items-center justify-center text-[#41217f]">
                <IconUser />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                  Parcours Visiteur
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-[#1f1633]">
                  Trouver, explorer, contacter
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <HowLine icon={<IconSearch />} text="Rechercher une coopérative ou un produit" />
              <HowLine icon={<IconStand />} text="Visiter un stand et consulter les informations" />
              <HowLine icon={<IconBox />} text="Découvrir les produits et les prix" />
              <HowLine icon={<IconMsg />} text="Envoyer une demande avec vos coordonnées" />
            </div>
          </div>

          {/* Coops */}
          <div className="rounded-[34px] bg-white/90 border border-black/5 shadow-sm p-8">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f3eefe] border border-[#dccfe2] flex items-center justify-center text-[#41217f]">
                <IconStore />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                  Parcours Coopérative
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-[#1f1633]">
                  Présenter et gérer facilement
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <HowLine icon={<IconProfile />} text="Créer un profil + ajouter un logo" />
              <HowLine icon={<IconStand />} text="Créer le stand et ajouter une couverture" />
              <HowLine icon={<IconBox />} text="Ajouter des produits avec photos et descriptions" />
              <HowLine icon={<IconBell />} text="Recevoir des demandes organisées dans le dashboard" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CONTACT */}
      <section className="relative max-w-7xl mx-auto px-6 pb-14">
        <div className="rounded-[34px] bg-gradient-to-br from-white via-white to-[#f7f3fb] border border-black/5 shadow-sm p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a22a7]">
                Contact
              </p>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold text-[#1f1633]">
                Besoin d’aide ou d’informations ?
              </h2>
              <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
                Notre équipe peut vous accompagner. Contactez-nous via email ou téléphone.
              </p>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <ContactChip icon={<IconMail />} text="Startupgrowfoundation@gmail.com" />
                <ContactChip icon={<IconPhone />} text="0660601007" />
              </div>
            </div>

            <div className="shrink-0 rounded-3xl bg-white border border-[#dccfe2] shadow-sm p-6 w-full md:w-[360px]">
              <p className="text-sm font-extrabold text-[#1f1633]">Astuce</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Si vous êtes une coopérative : créez votre espace et ajoutez vos produits.
                Si vous êtes visiteur : explorez les stands et envoyez une demande.
              </p>

              <div className="mt-4 flex gap-3">
                <Link
                  to="/stands"
                  className="flex-1 px-5 py-3 rounded-xl font-black bg-[#8a22a7] text-white hover:bg-[#7a1e96] transition text-center shadow-md"
                >
                  Explorer
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-5 py-3 rounded-xl font-black bg-white text-[#41217f] border border-[#dccfe2] hover:bg-[#f3eefe] transition text-center"
                >
                  S’inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
<footer className="relative max-w-7xl mx-auto px-6 pb-10">
  <div className="bg-white/90 backdrop-blur border border-black/5 rounded-3xl shadow-sm p-6">
    
    {/* Logos */}
    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
  <LogoBox src="/startogrow.png" alt="StartupGrow" size={200} />
  <LogoBox src="/indh.png" alt="INDH" size={200} />
  <LogoBox src="/roche.png" alt="PRN" size={200} />
</div>


    {/* Divider */}
    <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#dccfe2] to-transparent" />

    {/* Footer text */}
    <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-600 text-center md:text-left">
        © {new Date().getFullYear()}{" "}
        <span className="font-black text-[#41217f]">CoopGrow</span> • 
        Premier salon en ligne au Maroc dédié aux coopératives
      </p>

      <p className="text-sm text-gray-500 font-semibold">
        Created by <span className="font-black text-[#8a22a7]">Ilyas Hatim</span>
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function MiniStat({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white/90 border border-black/5 shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f3eefe] border border-[#dccfe2] flex items-center justify-center text-[#41217f]">
          {icon}
        </div>
        <div>
          <p className="font-extrabold text-[#1f1633] leading-tight">{title}</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#f3eefe] border border-[#dccfe2] flex items-center justify-center text-[#41217f]">
          {icon}
        </div>
        <div>
          <p className="font-extrabold text-[#1f1633] text-lg">{title}</p>
          <p className="text-gray-600 mt-2 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function HowLine({ icon, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/5 bg-[#f7f3fb] p-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-[#dccfe2] flex items-center justify-center text-[#41217f] shadow-sm">
        {icon}
      </div>
      <p className="text-gray-700 font-semibold leading-relaxed">{text}</p>
    </div>
  );
}

function ContactChip({ icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#dccfe2] shadow-sm px-4 py-3">
      <div className="w-10 h-10 rounded-xl bg-[#f3eefe] border border-[#dccfe2] flex items-center justify-center text-[#41217f]">
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-800 break-all">{text}</p>
    </div>
  );
}

function LogoBox({ src, alt }) {
  return (
    <div className="w-24 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-contain p-2" />
    </div>
  );
}

function Step({ n, t, d, icon }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/5 bg-[#f7f3fb] p-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-[#dccfe2] flex items-center justify-center text-[#41217f] shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-extrabold text-[#1f1633]">
          <span className="text-[#8a22a7]">({n})</span> {t}
        </p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{d}</p>
      </div>
    </div>
  );
}

/* ---------------- ICONS (NO LIBRARY) ---------------- */

function IconStand() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M3 4h18v5H3V4zm1 6h7v10H4V10zm9 0h7v10h-7V10z" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M21 7l-9-4-9 4 9 4 9-4zm-9 6l-9-4v10l9 4 9-4V9l-9 4z" />
    </svg>
  );
}
function IconMsg() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h14l4 3V6a2 2 0 00-2-2zm0 12H5.2L4 17.1V6h16v10z" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 17.3l-6.2 3.6 1.7-7.1L2 8.9l7.3-.6L12 1.5l2.7 6.8 7.3.6-5.5 4.9 1.7 7.1L12 17.3z" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z" />
    </svg>
  );
}
function IconLightning() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20.5 3l-5.5 2-6-2L3.5 5v16l5.5-2 6 2 5.5-2V3zM9 5l6 2v13l-6-2V5z" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H7l-3 3V6a2 2 0 012-2z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 10c0-5 4-8 9-8s9 3 9 8H3z" />
    </svg>
  );
}
function IconStore() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M4 7V4h16v3l-2 3v10H6V10L4 7zm4 13h8v-6H8v6z" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  );
}
function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 10c0-5 4-8 9-8s9 3 9 8H3z" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5-6.7V3a2 2 0 10-4 0v1.3A7 7 0 005 11v5L3 18v1h18v-1l-2-2z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.2c1.1.4 2.3.7 3.6.7a1 1 0 011 1v3.5a1 1 0 01-1 1C10.3 22 2 13.7 2 3.9a1 1 0 011-1H6.5a1 1 0 011 1c0 1.3.2 2.5.7 3.6a1 1 0 01-.2 1l-2.4 2.3z" />
    </svg>
  );
}
