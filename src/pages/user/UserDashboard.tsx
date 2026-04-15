import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LayoutDashboard,
  Search,
  ShieldCheck,
  LogOut,
  User,
  MapPinned,
  History,
  Navigation,
  PlugZap,
  BatteryCharging,
  Zap,
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
    recommendedStation: {
      id: "1",
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
        <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 shadow-sm md:px-12 md:py-12">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
              Bienvenue
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Bonjour{" "}
              <span className="text-emerald-500">
                {dashboardData.userName}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-500 md:text-xl">
              Retrouvez ici vos fonctionnalités de recharge, localisez les
              bornes et gérez vos réservations simplement.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StepVisualCard
            icon={<Navigation size={28} />}
            step="Étape 1"
            title="Localiser"
            description="Activez le GPS pour trouver rapidement les stations proches."
            tone="blue"
          />

          <StepVisualCard
            icon={<MapPinned size={28} />}
            step="Étape 2"
            title="Voir détails"
            description="Consultez les informations de la station et ses bornes disponibles."
            tone="emerald"
          />

          <StepVisualCard
            icon={<PlugZap size={28} />}
            step="Étape 3"
            title="Choisir borne"
            description="Sélectionnez la borne adaptée selon vos critères."
            tone="amber"
          />

          <StepVisualCard
            icon={<BatteryCharging size={28} />}
            step="Étape 4"
            title="Réserver"
            description="Choisissez votre créneau et confirmez la réservation."
            tone="slate"
          />
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">Accès rapide</h2>
            <p className="mt-1 text-sm text-slate-500">
              Accédez rapidement aux pages principales du parcours conducteur.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            <QuickLinkCard
              to="/user/session/nearby"
              icon={<Search size={20} />}
              title="Stations proches"
              description="Activer le GPS et afficher les stations proches."
            />

            <QuickLinkCard
              to="/user/network-stations"
              icon={<Zap size={20} />}
              title="Réseau des bornes"
              description="Explorer toutes les bornes enregistrées dans différentes villes."
            />

            <QuickLinkCard
              to={`/user/plug/${dashboardData.recommendedStation.id}`}
              icon={<MapPinned size={20} />}
              title="Voir détails station"
              description="Consulter la station et les bornes disponibles."
            />

            <QuickLinkCard
              to="/user/history"
              icon={<History size={20} />}
              title="Historique"
              description="Retrouver vos réservations et votre historique."
            />

            <QuickLinkCard
              to="/user/profile"
              icon={<User size={20} />}
              title="Mon profil"
              description="Consulter et mettre à jour vos informations personnelles."
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BatteryCharging size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Conseils du jour
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quelques rappels utiles avant de réserver et recharger.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <AdviceRow text="Réservez 15 min à l'avance pour garantir la disponibilité." />
              <AdviceRow text="Utilisez les bornes AC pour préserver la santé de votre batterie la nuit." />
              <AdviceRow text="Vérifiez le type de connecteur (Type 2 ou CCS) avant de partir." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StepVisualCard({
  icon,
  step,
  title,
  description,
  tone,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const tones = {
    blue: "from-blue-50 to-white border-blue-100 text-blue-700",
    emerald: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
    amber: "from-amber-50 to-white border-amber-100 text-amber-700",
    slate: "from-slate-50 to-white border-slate-200 text-slate-700",
  };

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br p-6 shadow-sm ${tones[tone]}`}
    >
      <div className="flex items-start justify-between">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm">
          {icon}
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
          {step}
        </span>
      </div>

      <div className="mt-5 text-lg font-black text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600">
        {description}
      </div>
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

function AdviceRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
        <ShieldCheck size={16} />
      </div>

      <p className="pt-1 text-base font-medium leading-relaxed text-slate-700">
        {text}
      </p>
    </div>
  );
}