import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BatteryCharging,
  LocateFixed,
  LogOut,
  MapPin,
  Phone,
  Send,
  Siren,
  Car,
  XCircle,
} from "lucide-react";

export default function UserSOS() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: localStorage.getItem("user_full_name") || "",
    phone: "",
    batteryLevel: "",
    locationText: "",
    latitude: "",
    longitude: "",
    problemType: "batterie_vide",
    message: "",
    portableCharger: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("user_token") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("user_token");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetLocation = () => {
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError("La géolocalisation n’est pas supportée par votre appareil.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        setError("Impossible de récupérer votre position actuelle.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName || !formData.phone || !formData.locationText) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        batteryLevel:
          formData.batteryLevel === "" ? null : Number(formData.batteryLevel),
        locationText: formData.locationText,
        latitude: formData.latitude === "" ? null : Number(formData.latitude),
        longitude: formData.longitude === "" ? null : Number(formData.longitude),
        problemType: formData.problemType,
        message: formData.message,
        portableCharger: formData.portableCharger,
        status: "pending",
      };

      const response = await fetch("http://localhost:5000/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l’envoi de la demande SOS.");
      }

      setSuccess("Votre demande SOS a été envoyée avec succès.");
      setFormData((prev) => ({
        ...prev,
        phone: "",
        batteryLevel: "",
        locationText: "",
        latitude: "",
        longitude: "",
        problemType: "batterie_vide",
        message: "",
        portableCharger: true,
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible d’envoyer la demande SOS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Siren size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                SOS Assistance
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace conducteur
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Demande d’assistance d’urgence
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Utilisez cette page si votre véhicule est en panne, si votre batterie
                est critique ou si vous avez besoin d’une borne portable.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
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
              Informations SOS
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Remplissez les informations nécessaires pour envoyer une demande d’assistance.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nom complet
              </label>
              <div className="relative">
                <Car
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Téléphone
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ex: 99 999 999"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Type de problème
              </label>
              <select
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:bg-white"
              >
                <option value="batterie_vide">Batterie vide</option>
                <option value="panne_electrique">Panne électrique</option>
                <option value="voiture_bloquee">Voiture bloquée</option>
                <option value="borne_indisponible">Borne indisponible</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Niveau de batterie (%)
              </label>
              <div className="relative">
                <BatteryCharging
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  name="batteryLevel"
                  value={formData.batteryLevel}
                  onChange={handleChange}
                  placeholder="Ex: 8"
                  min="0"
                  max="100"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Localisation / adresse actuelle
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />
                <input
                  type="text"
                  name="locationText"
                  value={formData.locationText}
                  onChange={handleChange}
                  placeholder="Ex: Route principale, Gafsa"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300 focus:bg-white"
                  required
                />
              </div>
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
                placeholder="Latitude"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:bg-white"
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
                placeholder="Longitude"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleGetLocation}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <LocateFixed size={16} />
                Utiliser ma position actuelle
              </button>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message complémentaire
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez rapidement votre situation..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="portableCharger"
                  checked={formData.portableCharger}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                Demander l’envoi d’une borne portable
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <XCircle size={18} />
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={18} />
              {loading ? "Envoi..." : "Envoyer la demande SOS"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}