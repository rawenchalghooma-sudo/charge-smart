import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Server,
  Wifi,
  BatteryCharging,
  TriangleAlert,
  Activity,
  Cpu,
  Database,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type SystemStatus = "Opérationnel" | "Attention" | "Critique";

type Incident = {
  id: number;
  title: string;
  source: string;
  time: string;
  status: SystemStatus;
};

const incidents: Incident[] = [
  {
    id: 1,
    title: "Latence élevée sur l’API de réservation",
    source: "Backend API",
    time: "Il y a 12 min",
    status: "Attention",
  },
  {
    id: 2,
    title: "Borne hors ligne détectée à Sousse",
    source: "Station Sousse 03",
    time: "Il y a 24 min",
    status: "Critique",
  },
  {
    id: 3,
    title: "Synchronisation ESP32 rétablie",
    source: "IoT Gateway",
    time: "Il y a 46 min",
    status: "Opérationnel",
  },
];

function getStatusClass(status: SystemStatus) {
  if (status === "Opérationnel") {
    return "bg-emerald-50 text-emerald-600";
  }
  if (status === "Attention") {
    return "bg-amber-50 text-amber-600";
  }
  return "bg-rose-50 text-rose-600";
}

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
};

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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

function IncidentItem({ incident }: { incident: Incident }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{incident.title}</p>
        <p className="mt-1 text-xs text-slate-400">
          {incident.source} • {incident.time}
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
          incident.status
        )}`}
      >
        {incident.status}
      </span>
    </div>
  );
}

export default function SystemMonitoring() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Server size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Monitoring système
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace administrateur
              </p>
            </div>
          </div>

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Retour dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Supervision technique de la plateforme
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Suivez les performances système, les communications et les
              incidents critiques.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Système global stable • 2 alertes ouvertes
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Backend"
            value="99.2%"
            subtitle="Disponibilité des services"
            icon={<Server size={22} />}
            iconClass="bg-sky-50 text-sky-600"
          />

          <MetricCard
            title="API"
            value="87 ms"
            subtitle="Temps moyen de réponse"
            icon={<Database size={22} />}
            iconClass="bg-violet-50 text-violet-600"
          />

          <MetricCard
            title="IoT / ESP32"
            value="94%"
            subtitle="Niveau de communication active"
            icon={<Cpu size={22} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            title="Bornes en ligne"
            value="184 / 186"
            subtitle="Stations joignables actuellement"
            icon={<Wifi size={22} />}
            iconClass="bg-amber-50 text-amber-600"
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Incidents récents
                </h3>
                <span className="text-sm font-bold text-sky-600">
                  Journal technique
                </span>
              </div>

              <div className="space-y-4">
                {incidents.map((incident) => (
                  <IncidentItem key={incident.id} incident={incident} />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                État des services
              </h3>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Authentification
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">
                    Opérationnelle
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Base de données
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">
                    Stable
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-600">
                    <Clock3 size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    API Réservation
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">
                    Latence modérée
                  </p>
                </div>

                <div className="rounded-2xl bg-rose-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600">
                    <TriangleAlert size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Stations hors ligne
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">
                    2 détectées
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400 text-slate-900">
                <Activity size={20} />
              </div>

              <h3 className="text-lg font-bold">Santé générale</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                La plateforme reste globalement stable avec surveillance active
                des stations et services réseau.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Santé globale</span>
                  <span className="text-sm font-bold text-emerald-300">
                    Bonne
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Alertes ouvertes</span>
                  <span className="text-sm font-bold text-amber-300">2</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Niveau critique</span>
                  <span className="text-sm font-bold text-rose-300">Faible</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Indicateurs rapides
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">Stations online</span>
                  <span className="font-bold text-slate-900">98.9%</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">Passerelles IoT</span>
                  <span className="font-bold text-slate-900">Stables</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">État batterie réseau</span>
                  <span className="font-bold text-slate-900">Correct</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Dernière vérification</span>
                  <span className="font-bold text-slate-900">Il y a 2 min</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Infrastructure énergétique
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <BatteryCharging size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Batterie globale réseau
                    </p>
                    <p className="text-xs text-slate-500">Niveau moyen : 76%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Wifi size={18} className="text-sky-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Connectivité stations
                    </p>
                    <p className="text-xs text-slate-500">
                      Synchronisation stable
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <TriangleAlert size={18} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Alertes techniques
                    </p>
                    <p className="text-xs text-slate-500">
                      2 alertes nécessitent un suivi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}