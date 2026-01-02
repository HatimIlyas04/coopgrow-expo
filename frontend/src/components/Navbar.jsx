import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUser, getToken, logout } from "../utils/auth";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const token = getToken();
  const user = getUser();

  const isAuthed = !!token;
  const isAdmin = user?.role === "ADMIN";
  const isCoop = user?.role === "COOP";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const doLogout = () => {
    logout();
    nav("/");
    setOpen(false);
  };

  const base =
    "relative text-sm font-black transition px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-violet-300";
  const active = "text-violet-700 bg-violet-50";
  const normal = "text-gray-700 hover:text-violet-700 hover:bg-violet-50";

  const fullName = user?.full_name || "Utilisateur";
  const shortName = fullName.length > 20 ? fullName.slice(0, 20) + "…" : fullName;

  const roleLabel = useMemo(() => {
    if (isCoop) return "coopérative";
    if (isAdmin) return "administrateur";
    if (user?.role) return user.role.toLowerCase();
    return "";
  }, [isCoop, isAdmin, user?.role]);

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 min-w-0 group"
          onClick={() => setOpen(false)}
        >
          {/* ✅ COOPERATIVE SYMBOL ICON (Hands + Leaf) */}
          <div className="relative w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-700 to-violet-800 flex items-center justify-center shadow-md overflow-hidden">
            {/* animated glow */}
            <div className="absolute -inset-10 bg-violet-500/35 blur-2xl opacity-70 group-hover:opacity-100 transition" />
            {/* pulse ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/25 group-hover:ring-white/40 transition" />
            {/* moving shine */}
            <div className="absolute -left-16 top-0 h-full w-14 rotate-12 bg-white/25 blur-md animate-[shine_3.4s_ease-in-out_infinite]" />
            {/* floating particles */}
            <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/80 animate-[float1_2.6s_ease-in-out_infinite]" />
            <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/70 animate-[float2_3.2s_ease-in-out_infinite]" />

            <svg
              className="relative w-[26px] h-[26px] text-white drop-shadow-sm group-hover:scale-[1.12] transition duration-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              {/* hands */}
              <path d="M21 12.6l-3.1-3.1a2.2 2.2 0 00-3.1 0l-1 1-1-1a2.2 2.2 0 00-3.1 0L3 12.6a2.1 2.1 0 000 3l1.6 1.6a2.2 2.2 0 003.1 0l.7-.7.7.7a2.2 2.2 0 003.1 0l.9-.9.9.9a2.2 2.2 0 003.1 0l1.6-1.6a2.1 2.1 0 000-3z" />
              {/* leaf in center */}
              <path
                d="M12 7.2c2.2 0 3.7 1.3 3.7 3.2 0 2.6-2.2 4.7-3.7 6-1.5-1.3-3.7-3.4-3.7-6 0-1.9 1.5-3.2 3.7-3.2z"
                opacity="0.35"
              />
            </svg>
          </div>

          {/* ✅ Brand text (Coop violet / Grow red) */}
          <div className="min-w-0 leading-tight">
            <p className="font-black text-[16px] sm:text-lg text-gray-900 truncate max-w-[220px] sm:max-w-[320px]">
              <span className="text-violet-700 drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                Coop
              </span>
              <span className="text-red-600 drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]">
                Grow
              </span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[220px] sm:max-w-[320px]">
              Salon des coopératives
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : normal}`}>
            Accueil
          </NavLink>

          <NavLink to="/stands" className={({ isActive }) => `${base} ${isActive ? active : normal}`}>
            Stands
          </NavLink>

          {isAuthed && isCoop && (
            <NavLink to="/coop" className={({ isActive }) => `${base} ${isActive ? active : normal}`}>
              Mon espace
            </NavLink>
          )}

          {isAuthed && isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `${base} ${isActive ? active : normal}`}>
              Dashboard Admin
            </NavLink>
          )}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed ? (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-black border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-5 py-2 rounded-xl text-sm font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              {/* Greeting */}
              <div className="px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-sm min-w-0">
                <p className="text-sm font-black text-gray-900 leading-tight truncate max-w-[240px]">
                  Bonjour <span className="text-violet-700">{fullName}</span>
                </p>
                <p className="text-xs text-gray-500 font-semibold">{roleLabel}</p>
              </div>

              <button
                onClick={doLogout}
                className="px-5 py-2 rounded-xl text-sm font-black bg-white border border-red-200 text-red-700 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          <div className="flex flex-col gap-1">
            <span
              className={`h-0.5 w-5 bg-gray-900 transition-transform duration-300 ${
                open ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-gray-900 transition duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-gray-900 transition-transform duration-300 ${
                open ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid gap-2">
          <NavLink to="/" className={({ isActive }) => `w-full ${base} ${isActive ? active : normal}`}>
            Accueil
          </NavLink>

          <NavLink
            to="/stands"
            className={({ isActive }) => `w-full ${base} ${isActive ? active : normal}`}
          >
            Stands
          </NavLink>

          {isAuthed && isCoop && (
            <NavLink to="/coop" className={({ isActive }) => `w-full ${base} ${isActive ? active : normal}`}>
              Mon espace
            </NavLink>
          )}

          {isAuthed && isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `w-full ${base} ${isActive ? active : normal}`}
            >
              Dashboard Admin
            </NavLink>
          )}

          <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            {!isAuthed ? (
              <div className="grid gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-3 rounded-2xl text-sm font-black border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-800"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="px-4 py-3 rounded-2xl text-sm font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate max-w-[220px]">
                    Bonjour <span className="text-violet-700">{shortName}</span>
                  </p>
                  <p className="text-xs text-gray-500 font-semibold">{roleLabel}</p>
                </div>

                <button
                  onClick={doLogout}
                  className="px-4 py-2 rounded-xl text-sm font-black bg-white border border-red-200 text-red-700 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Animations CSS */}
      <style>
        {`
          @keyframes shine {
            0% { transform: translateX(-180px) rotate(12deg); opacity: 0; }
            18% { opacity: 1; }
            55% { transform: translateX(480px) rotate(12deg); opacity: 0.9; }
            100% { transform: translateX(480px) rotate(12deg); opacity: 0; }
          }

          @keyframes float1 {
            0%, 100% { transform: translateY(0px); opacity: .75; }
            50% { transform: translateY(-6px); opacity: 1; }
          }

          @keyframes float2 {
            0%, 100% { transform: translateY(0px); opacity: .6; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        `}
      </style>
    </header>
  );
}
