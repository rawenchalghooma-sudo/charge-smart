import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Icônes (lucide-react)
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Sun,
  MapPin,
  Brain,
  BatteryCharging,
} from "lucide-react";

/**
 * Page : Connexion Conducteur
 * - UI propre + moderne
 * - Connectée au backend Node.js / MySQL
 * - Login via API + récupération du token JWT
 */
export default function UserLogin() {
  const navigate = useNavigate();

  // ===============================
  // Etat UI : afficher / masquer mot de passe
  // ===============================
  const [showPassword, setShowPassword] = useState(false);

  // ===============================
  // Données du formulaire
  // ===============================
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  // ===============================
  // Etats interface
  // ===============================
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Met à jour un champ du formulaire
   * et supprime l'erreur si l'utilisateur retape
   */
  function onChange<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (error) setError(null);
  }

  /**
   * Soumission du formulaire
   * - validation simple côté frontend
   * - appel API backend /api/auth/login
   * - stockage du token JWT
   * - redirection vers dashboard
   */
  async function onSubmit(e: React.FormEvent) {
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

    const res = await fetch("http://localhost:5000/api/auth/login/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Email ou mot de passe incorrect.");
      return;
    }

    const storage = form.remember ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("user_id", String(data.user.id));
    storage.setItem("user_email", data.user.email);
    storage.setItem("user_full_name", data.user.name);
    storage.setItem("user_role", data.user.role);
    storage.setItem("user_logged_in", "true");

    navigate("/user/dashboard");
  } catch (err) {
    console.error(err);
    setError("Impossible de contacter le serveur.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100">
      {/* =========================
          BACKGROUND (gradients)
      ========================== */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
      </div>

      {/* =========================
          HEADER
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-200 transition-transform group-hover:scale-110">
              <Sun size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              SolarPlug
            </span>
          </Link>

          {/* Retour */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================== */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* =========================
              LEFT : INFO / MARKETING
          ========================== */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
                Espace Conducteur
              </span>

              <h1 className="text-4xl font-black leading-[1.1] text-slate-900 lg:text-5xl">
                Rechargez avec{" "}
                <span className="text-amber-500">l'énergie du soleil.</span>
              </h1>

              <p className="text-lg text-slate-600">
                Connectez-vous pour accéder au réseau de bornes de recharge
                intelligentes et durables.
              </p>
            </div>

            {/* Avantages */}
            <div className="space-y-5">
              {[
                {
                  icon: <MapPin className="text-amber-500" />,
                  title: "Bornes proches",
                  desc: "Localisation en temps réel.",
                },
                {
                  icon: <Brain className="text-emerald-500" />,
                  title: "IA de recharge",
                  desc: "Optimisation des coûts et du temps.",
                },
                {
                  icon: <BatteryCharging className="text-blue-500" />,
                  title: "Suivi Live",
                  desc: "Consommation et origine de l'énergie.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-2xl border border-slate-200/50 bg-white/50 p-4 shadow-sm transition-colors hover:bg-white"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================
              RIGHT : FORM
          ========================== */}
          <div className="relative">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50 lg:p-10">
              {/* Titre */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Bon retour !
                </h2>
                <p className="text-slate-500">
                  Ravis de vous revoir parmi nous.
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    required
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    type="email"
                    placeholder="nom@exemple.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold text-slate-700">
                    Mot de passe
                  </label>

                  <div className="relative">
                    <input
                      required
                      value={form.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 pr-12 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                    />

                    {/* Afficher / masquer mot de passe */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between px-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) => onChange("remember", e.target.checked)}
                      className="h-4 w-4 rounded-lg border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    Rester connecté
                  </label>

                  <button
                    type="button"
                    className="text-sm font-bold text-amber-600 hover:underline"
                    onClick={() =>
                      alert("Fonction 'Mot de passe oublié' à faire plus tard.")
                    }
                  >
                    Oublié ?
                  </button>
                </div>

                {/* Bouton submit */}
                <button
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter au réseau"
                  )}
                </button>

                {/* Lien signup */}
                <p className="text-center text-sm text-slate-500">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/user/signup"
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}