import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  ChevronLeft,
  Server,
  Users,
  Shield,
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
          email: form.email,
          password: form.password,
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

      navigate("/admin/dashboard");
    } catch (error: any) {
      setError(error.message || "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-sky-100/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-indigo-100/20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[3rem] border border-white bg-white/70 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:flex-row">
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-sky-600 to-indigo-600 p-12 text-white lg:w-2/5">
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 rotate-3 shadow-lg shadow-sky-500/20">
                <Shield size={22} className="text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tight">
                SolarPlug
              </span>
            </div>

            <h1 className="mb-8 text-4xl font-bold leading-[1.15]">
              Supervisez la plateforme
              <br />
              <span className="text-white/90 text-3xl">dans sa globalité.</span>
            </h1>

            <div className="mt-12 space-y-10">
              <div className="flex gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/10">
                  <Users size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Gestion des comptes</h3>
                  <p className="mt-1 text-sm leading-relaxed text-sky-50">
                    Supervisez utilisateurs, propriétaires et accès à la plateforme.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/10">
                  <Server size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Monitoring système</h3>
                  <p className="mt-1 text-sm leading-relaxed text-sky-50">
                    Suivez l’état global du réseau, des bornes et des services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">
            <ShieldCheck size={14} />
            Accès Administrateur Sécurisé
          </div>
        </div>

        <div className="flex flex-1 items-center p-8 lg:p-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-12 text-center lg:text-left">
              <span className="mb-3 inline-block rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">
                Administration
              </span>

              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
                Connexion
              </h2>

              <p className="font-medium italic text-slate-400">
                Accédez à l’espace de supervision globale SolarPlug.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Identifiant E-mail
                </label>
                <div className="group relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-sky-500"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@solarplug.com"
                    className="w-full rounded-[1.25rem] border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-sky-200 focus:bg-white focus:ring-[6px] focus:ring-sky-500/5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="ml-1 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Mot de passe
                  </label>

                  <button
                    type="button"
                    className="text-[11px] font-bold text-sky-600 hover:underline"
                  >
                    Oublié ?
                  </button>
                </div>

                <div className="group relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-sky-500"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-[1.25rem] border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-12 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-sky-200 focus:bg-white focus:ring-[6px] focus:ring-sky-500/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1 py-2">
                <input
                  type="checkbox"
                  id="remember-admin"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-200 text-sky-500 focus:ring-sky-500/20"
                />
                <label
                  htmlFor="remember-admin"
                  className="cursor-pointer select-none text-xs font-bold text-slate-500"
                >
                  Rester connecté sur cet appareil
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter à l’administration"}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm font-semibold text-slate-400">
                Besoin d’un accès plateforme ?{" "}
                <Link
                  to="/signup"
                  className="font-black text-sky-600 underline-offset-4 hover:underline"
                >
                  Demander un compte
                </Link>
              </p>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-slate-500"
              >
                <ChevronLeft size={14} />
                Portail Public
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}