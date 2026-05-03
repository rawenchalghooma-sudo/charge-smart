import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sun,
  BatteryCharging,
  Zap,
  Gauge,
  BarChart3,
  Leaf,
  Cpu,
} from "lucide-react";

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

type SourceRowProps = {
  label: string;
  value: string;
  percent: string;
  barClass: string;
};

function SourceRow({ label, value, percent, barClass }: SourceRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          {value} • {percent}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barClass}`} />
      </div>
    </div>
  );
}

type DecisionCardProps = {
  mode: "ECO" | "BOOST" | "WAIT";
  desc: string;
  className: string;
};

function DecisionCard({ mode, desc, className }: DecisionCardProps) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Décision EMS
      </p>
      <h4 className="mt-2 text-2xl font-black text-slate-900">{mode}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  );
}

export default function EnergyMonitoring() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Cpu size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Monitoring énergie
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                EMS • Solaire • Batterie • Réseau
              </p>
            </div>
          </div>

          <Link
            to="/owner/dashboard"
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
              Supervision énergétique intelligente
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Visualisez la production solaire, la batterie, la part réseau et
              les décisions prises par l’EMS.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            EMS actif • Optimisation en temps réel
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Production solaire"
            value="324 kWh"
            subtitle="Production estimée aujourd’hui"
            icon={<Sun size={22} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <MetricCard
            title="Batterie globale"
            value="78%"
            subtitle="Niveau moyen du stockage"
            icon={<BatteryCharging size={22} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            title="Consommation instantanée"
            value="96 kW"
            subtitle="Demande réseau actuelle"
            icon={<Gauge size={22} />}
            iconClass="bg-sky-50 text-sky-600"
          />

          <MetricCard
            title="Énergie réseau"
            value="18%"
            subtitle="Part utilisée actuellement"
            icon={<Zap size={22} />}
            iconClass="bg-violet-50 text-violet-600"
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Répartition des sources énergétiques
                </h3>
                <span className="text-sm font-bold text-emerald-600">
                  Mise à jour live
                </span>
              </div>

              <div className="space-y-5">
                <SourceRow
                  label="Solaire"
                  value="52 kW"
                  percent="54%"
                  barClass="w-[54%] bg-amber-400"
                />
                <SourceRow
                  label="Batterie"
                  value="27 kW"
                  percent="28%"
                  barClass="w-[28%] bg-emerald-500"
                />
                <SourceRow
                  label="Réseau"
                  value="17 kW"
                  percent="18%"
                  barClass="w-[18%] bg-sky-500"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Historique énergétique simplifié
              </h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      08:00 – 10:00
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Mode ECO
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Production solaire dominante, réseau faiblement sollicité.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      10:00 – 13:00
                    </span>
                    <span className="text-xs font-bold text-amber-600">
                      Mode BOOST
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Forte demande, utilisation combinée solaire + batterie.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">
                      13:00 – 15:00
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      Mode WAIT
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Pic de charge détecté, temporisation recommandée sur
                    certaines sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Décisions intelligentes
              </h3>

              <div className="mt-5 space-y-4">
                <DecisionCard
                  mode="ECO"
                  desc="Privilégie l’énergie solaire et réduit la part réseau."
                  className="bg-emerald-50"
                />
                <DecisionCard
                  mode="BOOST"
                  desc="Accélère la charge avec batterie + solaire lors de forte demande."
                  className="bg-amber-50"
                />
                <DecisionCard
                  mode="WAIT"
                  desc="Reporte certaines charges pour protéger le système."
                  className="bg-slate-100"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-900">
                <Leaf size={20} />
              </div>

              <h3 className="text-lg font-bold">Recommandation système</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Le système recommande de maintenir le mode ECO tant que la
                production solaire couvre la majorité de la demande.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">
                    Contribution solaire
                  </span>
                  <span className="text-sm font-bold text-amber-300">54%</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Batterie</span>
                  <span className="text-sm font-bold text-emerald-300">28%</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="text-sm text-slate-300">Réseau</span>
                  <span className="text-sm font-bold text-sky-300">18%</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                KPI énergétiques
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">Rendement solaire</span>
                  <span className="font-bold text-slate-900">Excellent</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                  <span className="text-slate-500">Charge batterie</span>
                  <span className="font-bold text-slate-900">Stable</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Dépendance réseau</span>
                  <span className="font-bold text-slate-900">Faible</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}