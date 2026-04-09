import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BatteryCharging,
  CalendarDays,
  LayoutDashboard,
  PlugZap,
  Search,
  ShieldCheck,
  Zap,
  LogOut,
  User,
  MapPinned,
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const dashboardData = {
    userName: localStorage.getItem("user_full_name") || "Utilisateur",
    activeSession: {
      status: "Aucune session active",
      subtitle: "Aucune charge en cours pour le moment",
    },
    nextReservation: {
      station: "SolarPlug - Station Centre",
      date: "07/03/2026",
      time: "17:30",
    },
    stats: {
      totalSessions: 8,
      totalEnergy: "46.8 kWh",
      totalSpent: "16.38 DT",
    },
    recommendedStation: {
      id: "1",
      name: "SolarPlug - Station Centre",
      distance: "1.2 km",
      status: "Disponible",
    },
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[12%] -left-[10%] h-[40%] w-[40%] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[12%] h-[40%] w-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[35%] h-[40%] w-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
              <LayoutDashboard size={20} />
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900">
                Espace conducteur
              </div>
              <div className="text-xs text-slate-500">
                Tableau de bord utilisateur
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <ShieldCheck size={14} />
              Dashboard
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Bienvenue
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Bonjour {dashboardData.userName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                Retrouvez ici vos sessions de recharge, vos informations
                personnelles et la borne recommandée la plus utile pour démarrer.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <div className="text-sm font-semibold text-emerald-700">
                Borne recommandée
              </div>
              <div className="mt-1 text-lg font-black text-slate-900">
                {dashboardData.recommendedStation.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {dashboardData.recommendedStation.distance} •{" "}
                {dashboardData.recommendedStation.status}
              </div>
              <Link
                to={`/user/plug/${dashboardData.recommendedStation.id}`}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Voir la borne
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={<BatteryCharging size={18} />}
            title="Session actuelle"
            value={dashboardData.activeSession.status}
            subtitle={dashboardData.activeSession.subtitle}
            tone="slate"
          />

          <SummaryCard
            icon={<CalendarDays size={18} />}
            title="Prochaine réservation"
            value={dashboardData.nextReservation.station}
            subtitle={`${dashboardData.nextReservation.date} • ${dashboardData.nextReservation.time}`}
            tone="blue"
          />

          <SummaryCard
            icon={<MapPinned size={18} />}
            title="Borne proche"
            value={dashboardData.recommendedStation.distance}
            subtitle={dashboardData.recommendedStation.name}
            tone="amber"
          />

          <SummaryCard
            icon={<Zap size={18} />}
            title="Énergie totale"
            value={dashboardData.stats.totalEnergy}
            subtitle={`Dépense totale : ${dashboardData.stats.totalSpent}`}
            tone="emerald"
          />
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">Accès rapide</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ouvrez directement les pages les plus utiles de votre espace.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <QuickLinkCard
              to={`/user/plug/${dashboardData.recommendedStation.id}`}
              icon={<Search size={20} />}
              title="Voir une borne"
              description="Consulter les informations détaillées d’une borne avant réservation."
            />

            <QuickLinkCard
              to={`/user/session/${dashboardData.recommendedStation.id}`}
              icon={<MapPinned size={20} />}
              title="Localisation & charge"
              description="Suivre la charge et afficher les bornes proches avec GPS."
            />

            <QuickLinkCard
              to="/user/profile"
              icon={<User size={20} />}
              title="Mon profil"
              description="Consulter vos informations personnelles."
            />

            <QuickLinkCard
              to="/"
              icon={<PlugZap size={20} />}
              title="Retour accueil"
              description="Revenir vers la page principale de l’application."
            />
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">
              Parcours utilisateur
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <SimpleFlowRow step="1" label="Voir une borne" />
              <SimpleFlowRow step="2" label="Localisation & charge" />
              <SimpleFlowRow step="3" label="Consulter mon profil" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">
              Informations utiles
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-600">
              Ce dashboard sert de point d’entrée principal pour le conducteur.
              Il donne une vue rapide sur les actions importantes sans répéter
              tous les détails déjà affichés dans les autres pages.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  tone: "slate" | "blue" | "amber" | "emerald";
}) {
  const tones = {
    slate: {
      box: "bg-white border-slate-200",
      icon: "bg-slate-100 text-slate-700",
    },
    blue: {
      box: "bg-white border-slate-200",
      icon: "bg-blue-100 text-blue-700",
    },
    amber: {
      box: "bg-white border-slate-200",
      icon: "bg-amber-100 text-amber-700",
    },
    emerald: {
      box: "bg-white border-slate-200",
      icon: "bg-emerald-100 text-emerald-700",
    },
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${tones[tone].box}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-900">{title}</div>
        <div
          className={`grid h-10 w-10 place-items-center rounded-2xl ${tones[tone].icon}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 text-xl font-black text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
    </div>
  );
}

function QuickLinkCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-700 shadow-sm">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700"
        />
      </div>

      <div className="mt-4 text-base font-black text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </div>
    </Link>
  );
}

function SimpleFlowRow({
  step,
  label,
}: {
  step: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {step}
      </div>
      <span className="font-medium text-slate-700">{label}</span>
    </div>
  );
}