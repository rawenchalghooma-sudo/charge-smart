import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  BatteryCharging,
  Activity,
  AlertTriangle,
  BarChart3,
  Server,
  Zap,
} from "lucide-react";

/* Carte statistique */
type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
};

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black text-slate-900">{value}</h3>

          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* HEADER */}
      <header className="sticky top-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Server size={20} />
            </div>

            <div>
              <h1 className="text-sm font-black text-slate-900">
                SolarPlug Admin
              </h1>

              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Supervision plateforme
              </p>
            </div>
          </div>

          <Link
            to="/admin/login"
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Déconnexion
          </Link>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8">

        {/* TITRE */}
        <section className="mb-8">

          <h2 className="text-3xl font-black text-slate-900">
            Dashboard Administrateur
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Vue globale de la plateforme SolarPlug.
          </p>

        </section>

        {/* STATS */}
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Utilisateurs"
            value="1243"
            subtitle="Comptes enregistrés"
            icon={<Users size={22} />}
            color="bg-sky-50 text-sky-600"
          />

          <StatCard
            title="Propriétaires"
            value="42"
            subtitle="Stations partenaires"
            icon={<Building2 size={22} />}
            color="bg-indigo-50 text-indigo-600"
          />

          <StatCard
            title="Stations"
            value="186"
            subtitle="Bornes actives"
            icon={<BatteryCharging size={22} />}
            color="bg-emerald-50 text-emerald-600"
          />

          <StatCard
            title="Sessions actives"
            value="27"
            subtitle="Charges en cours"
            icon={<Activity size={22} />}
            color="bg-violet-50 text-violet-600"
          />

        </section>

        {/* ACTIONS ADMIN */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">

          <Link
            to="/admin/users"
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md"
          >
            <Users className="mb-4 text-sky-600" />

            <h3 className="text-lg font-bold text-slate-900">
              Gestion utilisateurs
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Voir, modifier ou suspendre les comptes utilisateurs.
            </p>
          </Link>

          <Link
            to="/admin/system"
            className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md"
          >
            <BarChart3 className="mb-4 text-emerald-600" />

            <h3 className="text-lg font-bold text-slate-900">
              Monitoring système
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Surveiller les performances et l’état du réseau.
            </p>
          </Link>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <AlertTriangle className="mb-4 text-amber-500" />

            <h3 className="text-lg font-bold text-slate-900">
              Alertes système
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              3 anomalies détectées sur certaines stations.
            </p>

          </div>

        </section>

        {/* ENERGIE */}
        <section className="mt-10 rounded-3xl bg-slate-900 p-6 text-white">

          <div className="flex items-center gap-3 mb-4">
            <Zap />
            <h3 className="text-lg font-bold">
              Production énergétique globale
            </h3>
          </div>

          <p className="text-sm text-slate-300">
            Production solaire totale aujourd’hui : 2.4 MWh
          </p>

        </section>

      </main>

    </div>
  );
}