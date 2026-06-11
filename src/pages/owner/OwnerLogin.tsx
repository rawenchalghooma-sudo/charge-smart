import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { demoLogin } from "../../api/demoLogin";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ChevronLeft,
  Activity,
  Sun,
  MapPin,
  Zap,
} from "lucide-react";

export default function OwnerLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    if (form.password.trim().length < 3) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de connexion");
      }

      const storage = form.remember ? localStorage : sessionStorage;

      storage.setItem("token", data.token);
      storage.setItem("user_id", String(data.user.id));
      storage.setItem("user_email", data.user.email);
      storage.setItem("user_full_name", data.user.name);
      storage.setItem("user_role", data.user.role);
      storage.setItem("user_logged_in", "true");
      storage.setItem("owner_logged_in", "true");

      navigate("/owner/dashboard");
    } catch (err) {
      console.error(err);

      const demoUser = demoLogin(
        form.email.trim(),
        form.password.trim(),
        "owner"
      );

      if (demoUser) {
        const storage = form.remember ? localStorage : sessionStorage;

        storage.setItem("user", JSON.stringify(demoUser));
        storage.setItem("owner_logged_in", "true");
        storage.setItem("user_role", "owner");
        storage.setItem("user_logged_in", "true");

        navigate("/owner/dashboard");
        return;
      }

      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/25">
              <Sun size={23} />
            </div>

            <span className="text-xl font-extrabold text-slate-950">
              Charge Smart
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-green-600"
          >
            <ChevronLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-8 pt-24 pb-8 lg:grid-cols-2">
        <section>
          <span className="mb-5 inline-flex rounded-full bg-green-100 px-6 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
            Espace Owner
          </span>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight text-slate-950 lg:text-6xl">
            Gérez vos bornes avec{" "}
            <span className="text-green-500">l’énergie du soleil.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-600">
            Connectez-vous pour accéder à votre espace propriétaire, suivre vos
            stations, vos réservations et la performance énergétique.
          </p>

          <div className="mt-10 max-w-xl space-y-5">
            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <MapPin size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Gestion des bornes
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Localisation et état des stations en temps réel.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <Zap size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Suivi des réservations
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Consultez les demandes, revenus et sessions de charge.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <Activity size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Suivi énergétique
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Analyse de la consommation et de l’origine de l’énergie.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[470px] rounded-[2.3rem] border border-slate-200 bg-white p-10 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.15)] lg:p-12">
            <div className="mb-9">
              <h2 className="text-3xl font-black text-slate-950">
                Bon retour !
              </h2>

              <p className="mt-2 text-base font-medium text-slate-500">
                Ravi de vous revoir parmi nous.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-extrabold text-slate-900">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="owner@gmail.com"
                  className="w-full rounded-2xl border border-green-100 bg-green-50/50 px-6 py-5 text-sm font-semibold text-slate-950 outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-extrabold text-slate-900">
                  Mot de passe
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-green-100 bg-green-50/50 px-6 py-5 pr-14 text-sm font-semibold text-slate-950 outline-none transition focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-green-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-5 w-5 cursor-pointer rounded accent-green-600"
                  />
                  Rester connecté
                </label>

                <button
                  type="button"
                  className="text-sm font-extrabold text-green-600 transition hover:text-green-700"
                >
                  Oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#080B10] py-5 text-sm font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter au réseau"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-9 text-center text-sm font-medium text-slate-500">
              Pas encore de compte ?{" "}
              <Link
                to="/signup"
                className="font-extrabold text-green-600 transition hover:text-green-700"
              >
                S’inscrire
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}