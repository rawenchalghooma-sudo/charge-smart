import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { demoLogin } from "../../api/demoLogin";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ChevronLeft,
  Server,
  Users,
  Shield,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {
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

      const response = await fetch("http://localhost:5000/api/auth/login/admin", {
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
      storage.setItem("admin_logged_in", "true");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);

      const demoUser = demoLogin(
        form.email.trim(),
        form.password.trim(),
        "admin"
      );

      if (demoUser) {
        const storage = form.remember ? localStorage : sessionStorage;

        storage.setItem("user", JSON.stringify(demoUser));
        storage.setItem("admin_logged_in", "true");
        storage.setItem("user_role", "admin");
        storage.setItem("user_logged_in", "true");

        navigate("/admin/dashboard");
        return;
      }

      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
              <Shield size={23} />
            </div>

            <span className="text-xl font-extrabold text-slate-950">
              Charge Smart
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ChevronLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-8 pt-24 pb-8 lg:grid-cols-2">
        <section>
          <span className="mb-5 inline-flex rounded-full bg-blue-100 px-6 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">
            Administration
          </span>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight text-slate-950 lg:text-6xl">
            Supervisez la plateforme avec{" "}
            <span className="text-blue-600">sécurité et contrôle.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-600">
            Connectez-vous pour gérer les utilisateurs, superviser les bornes,
            contrôler les accès et suivre l’état global du système.
          </p>

          <div className="mt-10 max-w-xl space-y-5">
            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Gestion des comptes
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Supervision des utilisateurs, owners et rôles.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Server size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Monitoring système
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Suivi global du réseau, des bornes et des services.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-950">
                  Sécurité plateforme
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Contrôle des accès et protection des données.
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
                Accédez à l’administration globale.
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
                  placeholder="admin@solarplug.com"
                  className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-6 py-5 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
                    className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-6 py-5 pr-14 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    id="remember-admin"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-5 w-5 cursor-pointer rounded accent-blue-600"
                  />
                  Rester connecté
                </label>

                <button
                  type="button"
                  className="text-sm font-extrabold text-blue-600 transition hover:text-blue-700"
                >
                  Oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#080B10] py-5 text-sm font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter à l’administration"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-9 text-center text-sm font-medium text-slate-500">
              Besoin d’un accès ?{" "}
              <Link
                to="/signup"
                className="font-extrabold text-blue-600 transition hover:text-blue-700"
              >
                Demander un compte
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}