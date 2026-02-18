import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";
import Spinner from "../components/spinner";

if (loading) return <Spinner />;


export default function  Profile() {
  const token = getToken();
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    city: "",
    bio: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const { data } = await api.get("/profile/me", { headers });
    setProfile(data);
    setForm({
      full_name: data.full_name || "",
      phone: data.phone || "",
      whatsapp: data.whatsapp || "",
      city: data.city || "",
      bio: data.bio || "",
    });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      try {
        await fetchProfile();
      } catch (e) {
        setMsg("Erreur chargement profile");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.put("/profile/me", form, { headers });
      await fetchProfile();
      setMsg("✅ Profil mis à jour");
    } catch {
      setMsg("Erreur update profile");
    }
  };

  const uploadLogo = async () => {
    if (!logoFile) return setMsg("Choisissez une image.");
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("logo", logoFile);

      const res = await api.post("/profile/me/logo", fd, {
        headers: {
          ...headers,
        },
      });

      await fetchProfile();
      setLogoFile(null);
      setMsg("✅ Logo upload avec succès");
      console.log("UPLOAD RESULT:", res.data);
    } catch (e) {
      console.log("UPLOAD ERROR:", e);
      setMsg(e.response?.data?.message || "Erreur upload logo");
    }
  };

  if (loading) return <div className="p-10">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f0ff] via-white to-[#f7f5ff]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-900">Mon Profil</h1>
        <p className="text-gray-600 mt-2">Gérer vos informations et votre logo.</p>

        {msg && (
          <div className="mt-6 rounded-2xl border border-violet-200 bg-[#f7f3fb] px-4 py-3 text-sm text-[#41217f]">
            {msg}
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="rounded-3xl border border-black/5 bg-white shadow-soft p-6">
            <p className="font-black text-gray-900">Logo</p>

            <div className="mt-4 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-black/5 overflow-hidden">
                {profile?.logo ? (
                  <img
                    src={profile.logo} // ✅ important (cloudinary / full url)
                    className="w-full h-full object-cover"
                    alt="logo"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    NO
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full"
                />
                <button
                  onClick={uploadLogo}
                  className="mt-3 px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition"
                >
                  Upload Logo
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-black/5 bg-white shadow-soft p-6">
            <p className="font-black text-gray-900">Informations</p>

            <form onSubmit={updateProfile} className="mt-4 grid gap-3">
              <Input label="Nom" value={form.full_name} onChange={(v)=>setForm(f=>({...f, full_name:v}))} />
              <Input label="Téléphone" value={form.phone} onChange={(v)=>setForm(f=>({...f, phone:v}))} />
              <Input label="WhatsApp" value={form.whatsapp} onChange={(v)=>setForm(f=>({...f, whatsapp:v}))} />
              <Input label="Ville" value={form.city} onChange={(v)=>setForm(f=>({...f, city:v}))} />
              <Textarea label="Bio" value={form.bio} onChange={(v)=>setForm(f=>({...f, bio:v}))} />

              <button className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md hover:opacity-95 transition">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{label}</p>
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
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-[#dccfe2] outline-none focus:ring-2 focus:ring-violet-300"
      />
    </div>
  );
}
