import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  Save,
  XCircle,
  PlusCircle,
} from "lucide-react";

const TUNISIA_CITIES = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
  "Zaghouan",
];

export default function AddStation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("owner_token") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("owner_token");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude === "" ? null : Number(formData.latitude),
        longitude: formData.longitude === "" ? null : Number(formData.longitude),

        // Valeurs par défaut automatiques
        powerKw: 22,
        energySource: "solar",
        batteryLevel: 80,
        pricePerKwh: 0.75,
        status: "available",
        isActive: true,
      };

      const response = await fetch("http://localhost:5000/api/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de la borne.");
      }

      setSuccess("Borne créée avec succès.");

      setTimeout(() => {
        navigate("/owner/stations");
      }, 800);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible d’ajouter la borne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <PlusCircle size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Ajouter une borne
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace propriétaire
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/stations")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour bornes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Nouvelle station de recharge
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ajoutez seulement les informations principales de la borne.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Formulaire simplifié
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Informations principales
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Nom, ville, adresse et position de la borne.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nom de la borne
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Solar Station Gafsa 01"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ville
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                required
              >
                <option value="">Choisir une ville</option>
                {TUNISIA_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: Rue principale, Gafsa"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Ex: 34.4250"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Ex: 8.7842"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/stations")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <XCircle size={18} />
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} />
              {loading ? "Enregistrement..." : "Enregistrer la borne"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}