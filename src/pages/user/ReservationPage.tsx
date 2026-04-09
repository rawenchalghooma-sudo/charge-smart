import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Timer,
  MapPin,
  Zap,
  CheckCircle2,
  AlertTriangle,
  LogOut,
} from "lucide-react";

/**
 * ReservationPage.tsx (Conducteur)
 * - Choix date / heure / durée
 * - Résumé borne (depuis :id)
 * - Confirmation (sans paiement)
 * - Redirection vers /user/session/:id
 */

const MOCK_STATIONS = [
  {
    id: "1",
    name: "SolarPlug - Station Centre",
    address: "Centre-ville",
    powerKw: 22,
    status: "Disponible" as const,
  },
  {
    id: "2",
    name: "SolarPlug - Station Sfax Sud",
    address: "Sfax Sud",
    powerKw: 50,
    status: "Disponible" as const,
  },
  {
    id: "3",
    name: "SolarPlug - Station Route Tunis",
    address: "Route Tunis",
    powerKw: 11,
    status: "Occupée" as const,
  },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addMinutesToTime(timeHHMM: string, minutes: number) {
  const [h, m] = timeHHMM.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor((total % (24 * 60)) / 60);
  const nm = total % 60;
  return `${pad2(nh)}:${pad2(nm)}`;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const station = useMemo(() => {
    const stationId = String(id ?? "");
    return MOCK_STATIONS.find((s) => s.id === stationId) ?? null;
  }, [id]);

  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string>("10:00");
  const [durationMin, setDurationMin] = useState<number>(30);
  const [note, setNote] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endTime = useMemo(() => addMinutesToTime(time, durationMin), [time, durationMin]);

  const estimatedKwh = useMemo(() => {
    const power = station?.powerKw ?? 22;
    const hours = durationMin / 60;
    return power * hours;
  }, [durationMin, station]);

  const estimatedCost = useMemo(() => {
    return (estimatedKwh * 0.35).toFixed(2);
  }, [estimatedKwh]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  async function confirmReservation(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!station) {
      setError("Borne introuvable.");
      return;
    }
    if (station.status !== "Disponible") {
      setError("Cette borne est actuellement occupée. Choisissez une autre borne.");
      return;
    }
    if (!date || !time) {
      setError("Veuillez choisir une date et une heure.");
      return;
    }

    try {
      setLoading(true);

      const reservation = {
        stationId: station.id,
        stationName: station.name,
        address: station.address,
        powerKw: station.powerKw,
        date,
        timeStart: time,
        timeEnd: endTime,
        durationMin,
        note,
        createdAt: new Date().toISOString(),
      };

      const key = "user_reservations";
      const old = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(key, JSON.stringify([reservation, ...old]));

      navigate(`/user/session/${station.id}`);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

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
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <div>
              <div className="text-sm font-bold text-slate-900">Réserver un créneau</div>
              <div className="text-xs text-slate-500">
                Borne : <span className="font-semibold">{id ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold bg-white border-slate-200 text-slate-700">
              <CheckCircle2 size={14} />
              Sans paiement (PFE)
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
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h1 className="text-xl font-black text-slate-900">Détails de réservation</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Choisissez votre créneau. La confirmation démarre ensuite la session (simulation).
                </p>
              </div>

              {error && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={confirmReservation} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">Heure</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">Durée</label>
                    <div className="relative">
                      <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={durationMin}
                        onChange={(e) => setDurationMin(Number(e.target.value))}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-10 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 heure</option>
                        <option value={90}>1h30</option>
                        <option value={120}>2 heures</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-500">
                      Fin estimée : <span className="font-semibold text-slate-700">{endTime}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">Note (optionnel)</label>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      type="text"
                      placeholder="Ex: voiture urgente, besoin 80%..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                <button
                  disabled={loading || !station || station.status !== "Disponible"}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? "Confirmation..." : "Confirmer la réservation"}
                </button>

                <p className="text-center text-xs text-slate-500">
                  ✅ Cette étape est sans paiement. Plus tard on branche le backend (créneaux réels + validation).
                </p>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Borne sélectionnée</div>
                  <div className="mt-1 text-xs text-slate-500">Données simulées (PFE)</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Zap size={18} />
                </div>
              </div>

              {!station ? (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  Borne introuvable. Teste une URL comme :
                  <div className="mt-1 font-black">/user/reserve/1</div>
                </div>
              ) : (
                <>
                  <div className="mt-4 text-sm font-black text-slate-900">{station.name}</div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    {station.address}
                  </div>

                  <div className="mt-4 grid gap-3">
                    <InfoRow label="Puissance" value={`${station.powerKw} kW`} />
                    <InfoRow
                      label="Statut"
                      value={station.status}
                      valueClass={station.status === "Disponible" ? "text-emerald-700" : "text-rose-700"}
                    />
                    <InfoRow label="Énergie estimée" value={`${estimatedKwh.toFixed(1)} kWh`} />
                    <InfoRow label="Coût estimé" value={`${estimatedCost} DT`} />
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    Après confirmation → redirection vers :
                    <div className="mt-1 font-semibold text-slate-800">/user/session/{station.id}</div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Backend (plus tard)</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                <li>Vérification des créneaux disponibles</li>
                <li>Blocage du créneau (anti double réservation)</li>
                <li>Création d’une session liée à la réservation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueClass = "text-slate-900",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className={`text-sm font-black ${valueClass}`}>{value}</span>
    </div>
  );
}