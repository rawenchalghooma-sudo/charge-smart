import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Zap,
} from "lucide-react";

type Role = "user" | "owner" | "admin";

export default function Signup() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<"signup" | "success">("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as Role,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: Role) => {
    setForm({ ...form, role });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Erreur lors de la création du compte");
      return;
    }

    // succès → page success
    setCurrentPage("success");

  } catch (error) {
    console.error(error);
    alert("Impossible de contacter le serveur");
  }
}
  const handleSuccessRedirect = () => {
    if (form.role === "user") {
      navigate("/user/login");
    } else if (form.role === "owner") {
      navigate("/owner/login");
    } else {
      navigate("/admin/login");
    }
  };

  if (currentPage === "success") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-[3rem] border border-emerald-50 bg-white p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>

          <h2 className="mb-4 text-3xl font-bold text-slate-900">
            Bienvenue à bord !
          </h2>

          <p className="mb-8 leading-relaxed text-slate-500">
            Votre compte SolarPlug a été créé avec succès. Préparez-vous à une
            nouvelle expérience de recharge.
          </p>

          <button
            onClick={handleSuccessRedirect}
            className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
          >
            Continuer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      {/* Cercles décoratifs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-emerald-100/30 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-blue-100/20 blur-[80px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[3rem] border border-white bg-white/70 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:flex-row">
        {/* Section gauche */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 to-green-500 p-12 text-white lg:w-2/5">
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 rotate-3">
                <Zap size={22} className="fill-white text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tight">
                SolarPlug
              </span>
            </div>

            <h1 className="mb-8 text-4xl font-bold leading-[1.15]">
              L'énergie de demain, <br />
              <span className="text-white/90">entre vos mains.</span>
            </h1>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <p className="text-sm leading-relaxed text-emerald-50">
                  <span className="block font-bold text-white">
                    Sécurité Totale
                  </span>
                  Vos données et transactions sont protégées par chiffrement.
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
                <p className="text-sm leading-relaxed text-emerald-50">
                  <span className="block font-bold text-white">Simplicité</span>
                  Une seule interface pour tous vos besoins de mobilité.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
            Sustainable Technology © 2024
          </div>
        </div>

        {/* Section droite */}
        <div className="flex-1 p-8 lg:p-16">
          <div className="mx-auto max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
                Inscription
              </h2>
              <p className="font-medium text-slate-400">
                Rejoignez-nous en quelques secondes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Nom complet
                </label>
                <div className="group relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-emerald-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full rounded-[1.25rem] border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-emerald-200 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  E-mail professionnel
                </label>
                <div className="group relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-emerald-500"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jean@entreprise.fr"
                    className="w-full rounded-[1.25rem] border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-emerald-200 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Mot de passe
                </label>
                <div className="group relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-emerald-500"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-[1.25rem] border border-slate-100 bg-slate-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-emerald-200 focus:bg-white focus:ring-[6px] focus:ring-emerald-500/5"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="ml-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Type d'accès
                </label>

                <div className="flex rounded-2xl border border-slate-100 bg-slate-100/50 p-1">
                  {(["user", "owner", "admin"] as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-tighter transition-all ${
                        form.role === role
                          ? "border border-slate-100 bg-white text-slate-900 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {role === "user"
                        ? "Conducteur"
                        : role === "owner"
                        ? "Propriétaire"
                        : "Admin"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-slate-900 py-4 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Créer mon compte
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-semibold text-slate-400">
                Déjà utilisateur ?{" "}
                <Link
                  to="/login"
                  className="font-black text-emerald-600 underline-offset-4 hover:underline"
                >
                  Se connecter
                </Link>
              </p>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-slate-500"
              >
                <ChevronLeft size={14} />
                Retour au portail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}