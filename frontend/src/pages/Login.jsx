import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAuth, getUser } from "../utils/auth";


export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setAuth(res.data.token, res.data.user);

      const user = getUser();
      if (user.role === "ADMIN") nav("/admin");
      else nav("/coop");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Erreur login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3fb] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-black/5 rounded-[28px] shadow-soft p-7">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-[0.18em]">
          Connexion
        </p>
        <h1 className="text-3xl font-black text-[#1f1633] mt-2">
          Accéder à votre espace
        </h1>

        {msg && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black shadow-md hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link className="font-bold text-violet-700 hover:underline" to="/register">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
