import { Link, useNavigate } from "react-router-dom";
import {
  BatteryCharging,
  BarChart3,
  CalendarDays,
  Activity,
  Wrench,
  CheckCircle2,
  Clock3,
  Zap,
  Sun,
  MapPin,
  LogOut,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

type QuickActionProps = {
  title: string;
  desc: string;
  to: string;
};

function QuickAction({ title, desc, to }: QuickActionProps) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
      <div className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-600">
        Ouvrir →
      </div>
    </Link>
  );
}

type ActivityItemProps = {
  title: string;
  time: string;
  status: string;
};

function ActivityItem({ title, time, status }: ActivityItemProps) {
  const statusClass =
    status === "Confirmée"
      ? "bg-emerald-50 text-emerald-600"
      : status === "En cours"
      ? "bg-amber-50 text-amber-600"
      : "bg-slate-100 text-slate-600";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{time}</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
      >
        {status}
      </span>
    </div>
  );
}

type StationRowProps = {
  name: string;
  location: string;
  status: "Disponible" | "Occupée" | "Maintenance";
  power: string;
};

function StationRow({ name, location, status, power }: StationRowProps) {
  const statusClass =
    status === "Disponible"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Occupée"
      ? "bg-amber-50 text-amber-600"
      : "bg-rose-50 text-rose-600";

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 p-4 md:grid-cols-4 md:items-center">
      <div>
        <p className="text-sm font-bold text-slate-900">{name}</p>
        <p className="mt-1 text-xs text-slate-400">{location}</p>
      </div>

      <div className="text-sm font-semibold text-slate-600">{power}</div>

      <div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="text-sm font-semibold text-emerald-600">
        Voir détails
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-sm font-black text-slate-900">
              Dashboard propriétaire
            </h1>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">
              Vue d’ensemble • SolarPlug
            </p>
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

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Vue globale du réseau
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Suivez vos bornes, vos réservations et votre énergie en un seul coup
              d’œil.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            EMS actif • Mode intelligent activé
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Bornes totales"
            value="18"
            subtitle="12 disponibles, 4 occupées, 2 maintenance"
            icon={<BatteryCharging size={22} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Réservations aujourd’hui"
            value="26"
            subtitle="7 en attente de confirmation"
            icon={<CalendarDays size={22} />}
            iconClass="bg-sky-50 text-sky-600"
          />

          <StatCard
            title="Énergie solaire"
            value="324 kWh"
            subtitle="Production estimée aujourd’hui"
            icon={<Sun size={22} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            title="Sessions actives"
            value="9"
            subtitle="Charge en cours sur le réseau"
            icon={<Activity size={22} />}
            iconClass="bg-violet-50 text-violet-600"
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  État global des bornes
                </h3>
                <Link
                  to="/owner/stations"
                  className="text-sm font-bold text-emerald-600 hover:underline"
                >
                  Gérer les bornes
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Disponibles
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">12</p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600">
                    <Clock3 size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Occupées
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">4</p>
                </div>

                <div className="rounded-2xl bg-rose-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600">
                    <Wrench size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Maintenance
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">2</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Aperçu des stations
                </h3>
                <Link
                  to="/owner/stations"
                  className="text-sm font-bold text-emerald-600 hover:underline"
                >
                  Voir tout
                </Link>
              </div>

              <div className="space-y-4">
                <StationRow
                  name="Solar Station Tunis 01"
                  location="Tunis Centre"
                  status="Disponible"
                  power="22 kW"
                />
                <StationRow
                  name="Solar Station Sfax 02"
                  location="Route de l’Aéroport"
                  status="Occupée"
                  power="50 kW"
                />
                <StationRow
                  name="Solar Station Sousse 03"
                  location="Zone Touristique"
                  status="Maintenance"
                  power="22 kW"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Accès rapide</h3>

              <div className="mt-5 space-y-4">
                <QuickAction
                  title="Gestion des bornes"
                  desc="Voir, modifier et superviser toutes les stations."
                  to="/owner/stations"
                />
                <QuickAction
                  title="Réservations"
                  desc="Consulter les créneaux du jour et les confirmations."
                  to="/owner/reservations"
                />
                <QuickAction
                  title="Sessions de charge"
                  desc="Suivre les sessions réelles de recharge des utilisateurs."
                  to="/owner/sessions"
                />
                <QuickAction
                  title="Monitoring énergie"
                  desc="Suivre la production solaire, batterie et EMS."
                  to="/owner/energy"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Activité récente
              </h3>

              <div className="mt-5 space-y-4">
                <ActivityItem
                  title="Réservation confirmée — Station Tunis 01"
                  time="Il y a 15 minutes"
                  status="Confirmée"
                />
                <ActivityItem
                  title="Session démarrée — Station Sfax 02"
                  time="Il y a 32 minutes"
                  status="En cours"
                />
                <ActivityItem
                  title="Alerte maintenance — Station Sousse 03"
                  time="Il y a 1 heure"
                  status="Alerte"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-900">
                <Zap size={20} />
              </div>

              <h3 className="text-lg font-bold">Bloc énergétique</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Production solaire en hausse, batterie globale stable et
                consommation maîtrisée.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">
                    Batterie globale
                  </span>
                  <span className="text-sm font-bold text-white">78%</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Mode EMS</span>
                  <span className="text-sm font-bold text-emerald-300">ECO</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">
                    Source dominante
                  </span>
                  <span className="text-sm font-bold text-amber-300">
                    Solaire
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-emerald-600">
              <MapPin size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Couverture du réseau
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              18 stations réparties sur plusieurs zones avec suivi centralisé.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-amber-600">
              <Sun size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Rendement solaire
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              La production solaire couvre une grande partie de la demande
              actuelle.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 text-sky-600">
              <BarChart3 size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Pilotage intelligent
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Décisions EMS et exploitation des bornes visualisées dans un seul
              espace.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}