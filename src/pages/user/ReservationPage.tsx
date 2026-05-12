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
  BatteryCharging,
  Percent,
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

type CarModel = {
  name: string;
  batteryKwh: number;
};

const carModels: CarModel[] = [
  { name: "Renault Zoe", batteryKwh: 52 },
  { name: "Peugeot e-208", batteryKwh: 50 },
  { name: "Dacia Spring", batteryKwh: 27 },
  { name: "Tesla Model 3", batteryKwh: 60 },
  { name: "Nissan Leaf", batteryKwh: 40 },
  { name: "Hyundai Kona Electric", batteryKwh: 64 },
  { name: "Autre", batteryKwh: 0 },
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

function buildDateTimeISO(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}

function calculateMinimumChargeTime(
  batteryKwh: number,
  targetPercent: number,
  chargerPowerKw: number
) {
  const energyNeeded = batteryKwh * (targetPercent / 100);
  const timeHours = energyNeeded / chargerPowerKw;
  return Math.ceil(timeHours * 60);
}

function calculateUrgencyPreview(selectedDuration: number, minimumDuration: number) {
  if (selectedDuration <= minimumDuration) return 100;
  if (selectedDuration <= minimumDuration + 15) return 80;
  if (selectedDuration <= minimumDuration + 30) return 60;
  if (selectedDuration <= minimumDuration + 60) return 40;
  return 10;
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
  const [durationError, setDurationError] = useState<string>("");

  const [selectedCarName, setSelectedCarName] = useState<string>("Renault Zoe");
  const [customCarName, setCustomCarName] = useState<string>("");
  const [customBatteryKwh, setCustomBatteryKwh] = useState<number>(40);

  const [targetPercent, setTargetPercent] = useState<number>(30);
  const [targetPercentError, setTargetPercentError] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCar = useMemo(() => {
    if (selectedCarName === "Autre") {
      return {
        name: customCarName.trim() || "Voiture personnalisée",
        batteryKwh: customBatteryKwh || 40,
      };
    }

    return carModels.find((car) => car.name === selectedCarName) || carModels[0];
  }, [selectedCarName, customCarName, customBatteryKwh]);

  const selectedPower = selectedChargingPoint?.powerKw ?? station?.power_kw ?? 22;

  const minimumDuration = useMemo(() => {
    return calculateMinimumChargeTime(
      selectedCar.batteryKwh,
      targetPercent || 0,
      selectedPower
    );
  }, [selectedCar.batteryKwh, targetPercent, selectedPower]);

  const urgencyPreview = useMemo(() => {
    return calculateUrgencyPreview(durationMin || 0, minimumDuration);
  }, [durationMin, minimumDuration]);

  const isDurationValid = durationMin >= 10 && durationMin <= 120;
  const isTargetPercentValid = targetPercent >= 10 && targetPercent <= 100;
  const isCustomCarValid =
    selectedCarName !== "Autre" ||
    (customCarName.trim().length > 1 &&
      customBatteryKwh >= 10 &&
      customBatteryKwh <= 150);

  const endTime = useMemo(
    () => addMinutesToTime(time, durationMin || 0),
    [time, durationMin]
  );

  const estimatedKwh = useMemo(() => {
    const energyNeeded = selectedCar.batteryKwh * ((targetPercent || 0) / 100);
    return Number(energyNeeded.toFixed(2));
  }, [selectedCar.batteryKwh, targetPercent]);

  const AVERAGE_PRICE_PER_KWH = 0.45;

  const estimatedCost = useMemo(() => {
    return Number((estimatedKwh * AVERAGE_PRICE_PER_KWH).toFixed(2));
  }, [estimatedKwh]);

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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const handleDurationChange = (value: number) => {
    setDurationMin(value);

    if (!value || value <= 0) {
      setDurationError("Veuillez saisir une durée valide.");
    } else if (value < 10) {
      setDurationError("La durée minimale est 10 minutes.");
    } else if (value > 120) {
      setDurationError("La durée maximale est 2 heures.");
    } else {
      setDurationError("");
    }
  };

  const handleTargetPercentChange = (value: number) => {
    setTargetPercent(value);

    if (!value || value <= 0) {
      setTargetPercentError("Veuillez saisir un pourcentage valide.");
    } else if (value < 10) {
      setTargetPercentError("Le pourcentage minimum est 10%.");
    } else if (value > 100) {
      setTargetPercentError("Le pourcentage maximum est 100%.");
    } else {
      setTargetPercentError("");
    }
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

    if (!isDurationValid) {
      setDurationError("La durée doit être entre 10 minutes et 2 heures.");
      setError("La durée doit être entre 10 minutes et 2 heures.");
      return;
    }

    if (!isTargetPercentValid) {
      setTargetPercentError("Le pourcentage doit être entre 10% et 100%.");
      setError("Le pourcentage doit être entre 10% et 100%.");
      return;
    }

    if (!isCustomCarValid) {
      setError(
        "Veuillez saisir le nom de votre voiture et une capacité batterie entre 10 et 150 kWh."
      );
      return;
    }

    try {
      setLoading(true);

      const reservationDateISO = new Date(`${date}T00:00:00`).toISOString();
      const startTimeISO = buildDateTimeISO(date, time);
      const endTimeISO = buildDateTimeISO(date, endTime);

      const payload = {
        stationId: station.id,
        chargingPointId: selectedChargingPoint.id,

        reservationDate: reservationDateISO,
        startTime: startTimeISO,
        endTime: endTimeISO,

        durationMin,
        vehicleType: selectedCar.name,
        batteryKwh: selectedCar.batteryKwh,
        targetPercent,
        chargerPowerKw: selectedPower,

        minimumDuration,
        urgencyPreview,

        estimatedKwh,
        estimatedCost,
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
          vehicleType: selectedCar.name,
          batteryKwh: selectedCar.batteryKwh,
          targetPercent,
          chargerPowerKw: selectedPower,
          minimumDuration,
          urgencyPreview,
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
              <div className="text-sm font-bold text-slate-900">
                Réserver un créneau
              </div>
              <div className="text-xs text-slate-500">
                Station :{" "}
                <span className="font-semibold">{station?.name || id || "—"}</span>
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
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-xl font-black text-slate-900">
                Détails de réservation
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Choisissez la voiture, le pourcentage souhaité et la durée.
              </p>

              {error && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={confirmReservation} className="mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputDate date={date} setDate={setDate} />
                  <InputTime time={time} setTime={setTime} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">
                      Modèle de voiture
                    </label>
                    <div className="relative">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={selectedCarName}
                        onChange={(e) => setSelectedCarName(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-10 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      >
                        {carModels.map((car) => (
                          <option key={car.name} value={car.name}>
                            {car.name}
                            {car.batteryKwh > 0 ? ` — ${car.batteryKwh} kWh` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">
                      Pourcentage souhaité
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        min={10}
                        max={100}
                        value={targetPercent}
                        onChange={(e) =>
                          handleTargetPercentChange(Number(e.target.value))
                        }
                        placeholder="Exemple : 30"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                    {targetPercentError && (
                      <p className="text-xs font-bold text-rose-600">
                        {targetPercentError}
                      </p>
                    )}
                  </div>
                </div>

                {selectedCarName === "Autre" && (
                  <div className="grid gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-bold text-slate-700">
                        Nom de votre voiture
                      </label>
                      <input
                        value={customCarName}
                        onChange={(e) => setCustomCarName(e.target.value)}
                        type="text"
                        placeholder="Ex: Volkswagen ID.4"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-bold text-slate-700">
                        Capacité batterie en kWh
                      </label>
                      <input
                        value={customBatteryKwh}
                        onChange={(e) => setCustomBatteryKwh(Number(e.target.value))}
                        type="number"
                        min={10}
                        max={150}
                        placeholder="Ex: 58"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold text-slate-700">
                      Durée de charge
                    </label>
                    <div className="relative">
                      <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="number"
                        min={10}
                        max={120}
                        value={durationMin}
                        onChange={(e) =>
                          handleDurationChange(Number(e.target.value))
                        }
                        placeholder="Exemple : 45"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                    {durationError ? (
                      <p className="text-xs font-bold text-rose-600">
                        {durationError}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Fin estimée : <b>{endTime}</b>
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-black text-emerald-800">
                      <BatteryCharging size={18} />
                      Estimation intelligente
                    </div>

                    <div className="mt-3 space-y-2 text-xs font-semibold text-emerald-900">
                      <div>Batterie : <b>{selectedCar.batteryKwh} kWh</b></div>
                      <div>Énergie nécessaire : <b>{estimatedKwh.toFixed(1)} kWh</b></div>
                      <div>Temps minimum : <b>{minimumDuration} min</b></div>
                      <div>Urgency : <b>{urgencyPreview}/100</b></div>
                      <div>Coût estimé provisoire : <b>{estimatedCost.toFixed(2)} DT</b></div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={
                    loading ||
                    stationLoading ||
                    !station ||
                    !selectedChargingPoint ||
                    station.status !== "Disponible" ||
                    !isDurationValid ||
                    !isTargetPercentValid ||
                    !isCustomCarValid
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Confirmation..." : "Confirmer et générer QR code"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <SummaryCard
              station={station}
              stationLoading={stationLoading}
              selectedCar={selectedCar}
              targetPercent={targetPercent}
              durationMin={durationMin}
              endTime={endTime}
            />

            <BorneCard
              selectedChargingPoint={selectedChargingPoint}
              estimatedKwh={estimatedKwh}
              estimatedCost={estimatedCost}
              minimumDuration={minimumDuration}
              urgencyPreview={urgencyPreview}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function InputDate({ date, setDate }: any) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-sm font-bold text-slate-700">Date</label>
      <div className="relative">
        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
        />
      </div>
    </div>
  );
}

function InputTime({ time, setTime }: any) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-sm font-bold text-slate-700">Heure</label>
      <div className="relative">
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
        />
      </div>
    </div>
  );
}

function SummaryCard({ station, stationLoading, selectedCar, targetPercent, durationMin, endTime }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-bold text-slate-900">Résumé de votre choix</div>

      {stationLoading ? (
        <div className="mt-4 text-sm text-slate-500">Chargement...</div>
      ) : !station ? (
        <div className="mt-4 text-sm text-rose-600">Station introuvable.</div>
      ) : (
        <div className="mt-4 grid gap-3">
          <InfoRow label="Station" value={station.name} />
          <InfoRow label="Puissance station" value={`${station.power_kw ?? 22} kW`} />
          <InfoRow label="Voiture" value={selectedCar.name} />
          <InfoRow label="Batterie" value={`${selectedCar.batteryKwh} kWh`} />
          <InfoRow label="Pourcentage" value={`${targetPercent}%`} />
          <InfoRow label="Durée choisie" value={`${durationMin} min`} />
          <InfoRow label="Fin estimée" value={endTime} />
        </div>
      )}
    </div>
  );
}

function BorneCard({ selectedChargingPoint, estimatedKwh, estimatedCost, minimumDuration, urgencyPreview }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-bold text-slate-900">Borne sélectionnée</div>

      {!selectedChargingPoint ? (
        <div className="mt-4 text-sm text-amber-700">
          Aucune borne reçue. Retournez à la page des détails.
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          <InfoRow label="Nom borne" value={selectedChargingPoint.label} />
          <InfoRow label="Connecteur" value={selectedChargingPoint.connectorType} />
          <InfoRow label="Puissance borne" value={`${selectedChargingPoint.powerKw} kW`} />
          <InfoRow label="Statut" value={selectedChargingPoint.status} />
          <InfoRow label="Énergie nécessaire" value={`${estimatedKwh.toFixed(1)} kWh`} />
          <InfoRow label="Coût estimé provisoire" value={`${estimatedCost.toFixed(2)} DT`} />
          <InfoRow label="Temps minimum" value={`${minimumDuration} min`} />
          <InfoRow label="Urgency estimée" value={`${urgencyPreview}/100`} />
        </div>
      )}
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