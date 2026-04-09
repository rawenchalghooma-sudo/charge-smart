import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LogOut,
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  BatteryCharging,
  History,
  ChevronRight,
} from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const userName = localStorage.getItem("user_full_name") || "Utilisateur";
  const userEmail = localStorage.getItem("user_email") || "email@exemple.com";
  const userRole = "Conducteur";
  const memberSince = "2026";
  const totalSessions = "8";
  const totalReservations = "5";
  const totalEnergy = "46.8 kWh";

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[12%] h-[40%] w-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[35%] h-[40%] w-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <div>
              <div className="text-sm font-bold text-slate-900">
                Profil utilisateur
              </div>
              <div className="text-xs text-slate-500">
                Informations conducteur
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                <User size={34} />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                  Mon espace
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                  {userName}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Gérez vos informations personnelles et suivez votre activité.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="text-sm font-semibold text-emerald-700">
                Statut du compte
              </div>
              <div className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
                <ShieldCheck size={18} className="text-emerald-600" />
                Compte actif
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Accès utilisateur disponible
              </div>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Informations personnelles
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Aperçu des données principales du conducteur.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProfileInfoCard
                  icon={<User size={18} />}
                  label="Nom complet"
                  value={userName}
                />
                <ProfileInfoCard
                  icon={<Mail size={18} />}
                  label="Email"
                  value={userEmail}
                />
                <ProfileInfoCard
                  icon={<ShieldCheck size={18} />}
                  label="Rôle"
                  value={userRole}
                />
                <ProfileInfoCard
                  icon={<CalendarDays size={18} />}
                  label="Membre depuis"
                  value={memberSince}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Activité du compte
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Résumé rapide de votre utilisation de la plateforme.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatMiniCard
                  icon={<BatteryCharging size={18} />}
                  label="Sessions"
                  value={totalSessions}
                  tone="emerald"
                />
                <StatMiniCard
                  icon={<CalendarDays size={18} />}
                  label="Réservations"
                  value={totalReservations}
                  tone="blue"
                />
                <StatMiniCard
                  icon={<History size={18} />}
                  label="Énergie"
                  value={totalEnergy}
                  tone="amber"
                />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Accès rapide
              </h2>

              <div className="mt-5 space-y-3">
                <QuickAccessRow
                  to="/user/dashboard"
                  title="Retour au dashboard"
                  subtitle="Revenir à la page principale"
                />
                <QuickAccessRow
                  to="/user/history"
                  title="Voir mon historique"
                  subtitle="Consulter mes sessions et réservations"
                />
                <QuickAccessRow
                  to="/user/profile"
                  title="Mon profil"
                  subtitle="Page actuelle du compte"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-900">
                <User size={22} />
              </div>

              <h3 className="text-lg font-bold">Compte conducteur</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Cette page centralise les informations du conducteur et donne un
                aperçu clair de son activité sur SolarPlug.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Profil</span>
                  <span className="text-sm font-bold text-white">Actif</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Rôle</span>
                  <span className="text-sm font-bold text-emerald-300">
                    Conducteur
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Historique</span>
                  <span className="text-sm font-bold text-amber-300">
                    Disponible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileInfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

function StatMiniCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "emerald" | "blue" | "amber";
}) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ${tones[tone]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-xl font-black text-slate-900">{value}</div>
    </div>
  );
}

function QuickAccessRow({
  to,
  title,
  subtitle,
}: {
  to: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-white"
    >
      <div>
        <div className="text-sm font-bold text-slate-900">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
      </div>

      <ChevronRight size={18} className="text-slate-400" />
    </Link>
  );
}