import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  PlugZap,
  Car,
} from "lucide-react";

type StationType = {
  id: number | string;
  name: string;
  location: string;
  power_kw?: number;
  status?: string;
  lat?: number;
  lng?: number;
  energy_source?: string;
  station_battery?: number;
};

type ChargingPoint = {
  id: string;
  label: string;
  connectorType: string;
  powerKw: number;
  status: "Disponible" | "Occupée";
};

type ReservationLocationState = {
  selectedChargingPoint?: ChargingPoint;
  stationName?: string;
};

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

function buildDateTimeISO(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("user_token") ||
    sessionStorage.getItem("user_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("jwt")
  );
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const state = (location.state as ReservationLocationState) || {};
  const selectedChargingPoint = state.selectedChargingPoint || null;

  const [station, setStation] = useState<StationType | null>(null);
  const [stationLoading, setStationLoading] = useState(true);

  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string>("10:00");
  const [durationMin, setDurationMin] = useState<number>(30);
  const [vehicleType, setVehicleType] = useState<string>("Citadine");
  const [note, setNote] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endTime = useMemo(
    () => addMinutesToTime(time, durationMin),
    [time, durationMin]
  );

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setStationLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/stations/${id}`);

        if (!response.ok) {
          throw new Error(`Erreur API station : ${response.status}`);
        }

        const data = await response.json();
        setStation(data);
      } catch (err: any) {
        console.error("Erreur chargement station :", err);
        setStation(null);
        setError(err.message || "Impossible de charger les détails de la station.");
      } finally {
        setStationLoading(false);
      }
    };

    if (id) {
      fetchStation();
    } else {
      setStationLoading(false);
      setError("Identifiant de station manquant.");
    }
  }, [id]);

  const selectedPower = selectedChargingPoint?.powerKw ?? station?.power_kw ?? 22;

  const estimatedKwh = useMemo(() => {
    const hours = durationMin / 60;
    return selectedPower * hours;
  }, [durationMin, selectedPower]);

  const estimatedCost = useMemo(() => {
    return Number((estimatedKwh * 0.35).toFixed(2));
  }, [estimatedKwh]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  async function confirmReservation(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const token = getAuthToken();

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      navigate("/user/login");
      return;
    }

    if (!station) {
      setError("Station introuvable.");
      return;
    }

    if (!selectedChargingPoint) {
      setError("Veuillez d’abord choisir une borne depuis la page des détails.");
      return;
    }

    if (station.status !== "Disponible") {
      setError("Cette station est actuellement occupée. Choisissez une autre station.");
      return;
    }

    if (selectedChargingPoint.status !== "Disponible") {
      setError("Cette borne n’est plus disponible.");
      return;
    }

    if (!date || !time) {
      setError("Veuillez choisir une date et une heure.");
      return;
    }

    if (!vehicleType.trim()) {
      setError("Veuillez sélectionner un type de voiture.");
      return;
    }

    try {
      setLoading(true);

      const reservationDateISO = new Date(`${date}T00:00:00`).toISOString();
      const startTimeISO = buildDateTimeISO(date, time);
      const endTimeISO = buildDateTimeISO(date, endTime);

      const payload = {
        stationId: station.id,
        reservationDate: reservationDateISO,
        startTime: startTimeISO,
        endTime: endTimeISO,
        estimatedKwh,
        estimatedCost,
        vehicleType,
      };

      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : {};

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de la réservation.");
      }

      navigate(`/user/reservation-qr/${data.reservation.id}`, {
        state: {
          reservation: data.reservation,
          station,
          selectedChargingPoint,
          vehicleType,
          date,
          time,
          durationMin,
          estimatedKwh,
          estimatedCost,
        },
      });
    } catch (err: any) {
      console.error("Erreur réservation :", err);
      setError(err.message || "Une erreur est survenue. Réessayez.");
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
              to={id ? `/user/plug/${id}` : "/user/dashboard"}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour détails station
            </Link>

            <div>
              <div className="text-sm font-bold text-slate-900">Réserver un créneau</div>
              <div className="text-xs text-slate-500">
                Station : <span className="font-semibold">{station?.name || id || "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold bg-white border-slate-200 text-slate-700">
              <CheckCircle2 size={14} />
              Confirmation de réservation
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
                  Choisissez votre créneau pour la borne sélectionnée. Un QR code sera généré après confirmation.
                </p>
              </div>

              {error && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              {!selectedChargingPoint && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  <AlertTriangle size={18} />
                  Aucune borne n’a été sélectionnée. Retourne à la page de détails de la station pour choisir une borne.
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
                    <label className="ml-1 text-sm font-bold text-slate-700">Type de voiture</label>
                    <div className="relative">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-10 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      >
                        <option value="Citadine">Citadine</option>
                        <option value="Berline">Berline</option>
                        <option value="SUV">SUV</option>
                        <option value="Utilitaire">Utilitaire</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
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
                  <p className="text-xs text-slate-500">
                    Ce champ est gardé pour l’interface. On pourra l’ajouter au backend plus tard.
                  </p>
                </div>

                <button
                  disabled={
                    loading ||
                    stationLoading ||
                    !station ||
                    !selectedChargingPoint ||
                    station.status !== "Disponible"
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? "Confirmation..." : "Confirmer et générer QR code"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Résumé de votre choix</div>
                  <div className="mt-1 text-xs text-slate-500">Station + borne sélectionnée</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Zap size={18} />
                </div>
              </div>

              {stationLoading ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  Chargement des détails de la station...
                </div>
              ) : !station ? (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  Station introuvable.
                </div>
              ) : (
                <>
                  <div className="mt-4 text-sm font-black text-slate-900">{station.name}</div>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    {station.location}
                  </div>

                  <div className="mt-4 grid gap-3">
                    <InfoRow label="Station" value={station.name} />
                    <InfoRow
                      label="Statut station"
                      value={station.status ?? "Disponible"}
                      valueClass={station.status === "Disponible" ? "text-emerald-700" : "text-rose-700"}
                    />
                    <InfoRow label="Puissance station" value={`${station.power_kw ?? 22} kW`} />
                  </div>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Borne sélectionnée</div>
                  <div className="mt-1 text-xs text-slate-500">Choisie dans PlugDetails</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                  <PlugZap size={18} />
                </div>
              </div>

              {!selectedChargingPoint ? (
                <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                  Aucune borne reçue. Retournez à la page des détails pour choisir une borne.
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  <InfoRow label="Nom borne" value={selectedChargingPoint.label} />
                  <InfoRow label="Connecteur" value={selectedChargingPoint.connectorType} />
                  <InfoRow label="Puissance borne" value={`${selectedChargingPoint.powerKw} kW`} />
                  <InfoRow
                    label="Statut"
                    value={selectedChargingPoint.status}
                    valueClass={
                      selectedChargingPoint.status === "Disponible"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }
                  />
                  <InfoRow label="Type de voiture" value={vehicleType} />
                  <InfoRow label="Énergie estimée" value={`${estimatedKwh.toFixed(1)} kWh`} />
                  <InfoRow label="Coût estimé" value={`${estimatedCost.toFixed(2)} DT`} />
                </div>
              )}
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