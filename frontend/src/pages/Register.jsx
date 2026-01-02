import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    city: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      nav("/login");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Erreur inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3fb] flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white border border-black/5 rounded-[28px] shadow-soft p-7">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-[0.18em]">
          Inscription
        </p>
        <h1 className="text-3xl font-black text-[#1f1633] mt-2">
          Créer compte Coopérative
        </h1>

        {msg && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-3">
          <input
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Nom coopérative"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Ville"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />

          <input
            className="md:col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="md:col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="WhatsApp"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />

          <button
            disabled={loading}
            className="md:col-span-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black shadow-md hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Création..." : "Créer compte"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600">
          Déjà inscrit ?{" "}
          <Link className="font-bold text-violet-700 hover:underline" to="/login">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
