import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Navigation,
  Loader2,
  LogOut,
  CircleCheck,
  CircleX,
  PlugZap,
  Bolt,
} from "lucide-react";

type Station = {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  power_kw: number;
  status: "Disponible" | "Occupée";
  energy_source?: string;
  station_battery?: number;
};

function toRad(x: number) {
  return (x * Math.PI) / 180;
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos(toRad(a.lat)) *
    Math.cos(toRad(b.lat)) *
    Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

export default function ChargingSession() {
  const navigate = useNavigate();

  const [stations, setStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [stationsError, setStationsError] = useState<string | null>(null);

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    async function fetchStations() {
      try {
        setStationsLoading(true);
        setStationsError(null);

        const res = await fetch("http://localhost:5000/api/stations");
        const data = await res.json();

        if (!res.ok) {
          setStationsError(data.message || "Impossible de charger les stations.");
          setStations([]);
          return;
        }

        setStations(data);
      } catch (err) {
        console.error(err);
        setStationsError("Impossible de contacter le serveur.");
        setStations([]);
      } finally {
        setStationsLoading(false);
      }
    }

    fetchStations();
  }, []);

  const nearbyStations = useMemo(() => {
    if (!userPos) return [];

    return stations
      .map((station) => ({
        ...station,
        distance: distanceKm(userPos, { lat: station.lat, lng: station.lng }),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [stations, userPos]);

  const nearestAvailableStation = useMemo(() => {
    return nearbyStations.find((station) => station.status === "Disponible") ?? null;
  }, [nearbyStations]);

  function requestGps() {
    setGpsError(null);

    if (!("geolocation" in navigator)) {
      setGpsError("Votre navigateur ne supporte pas la géolocalisation.");
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);

        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Permission GPS refusée.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("Position indisponible.");
        } else if (err.code === err.TIMEOUT) {
          setGpsError("Timeout GPS. Réessaie.");
        } else {
          setGpsError("Impossible de récupérer votre position.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
              <div className="text-sm font-bold text-slate-900">Stations proches</div>
              <div className="text-xs text-slate-500">
                GPS → station → détails → choix de borne
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <ShieldCheck size={14} />
              Localisation des stations
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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-black text-slate-900">
                Trouver la station la plus proche
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Active le GPS pour afficher les stations les plus proches puis consulter leurs détails.
              </div>
            </div>

            <button
              type="button"
              onClick={requestGps}
              disabled={gpsLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-70"
            >
              <Navigation size={16} />
              {gpsLoading ? "Localisation..." : "Activer GPS"}
            </button>
          </div>

          {gpsError && (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              {gpsError}
            </div>
          )}

          {stationsError && (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              {stationsError}
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Zone GPS</span>
              </div>

              {!userPos ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-center">
                  <div>
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-600">
                      <Navigation size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Active le GPS pour détecter ta position
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Ensuite on affiche les stations proches.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-[260px] rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Position détectée
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        <MapPin size={16} className="text-blue-600" />
                        {userPos.lat.toFixed(5)}, {userPos.lng.toFixed(5)}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                      <div className="relative h-36 w-full max-w-sm rounded-3xl border border-white/70 bg-white/70 shadow-inner">
                        <div className="absolute left-[18%] top-[25%] h-3 w-3 rounded-full bg-slate-400" />
                        <div className="absolute left-[58%] top-[30%] h-3 w-3 rounded-full bg-slate-400" />
                        <div className="absolute left-[72%] top-[58%] h-3 w-3 rounded-full bg-slate-400" />

                        <div className="absolute left-[48%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="absolute -inset-3 animate-ping rounded-full bg-blue-300/50" />
                            <div className="relative grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg">
                              <Navigation size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-xs text-slate-500">
                      Carte visuelle simulée. Plus tard tu peux intégrer une vraie map.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-900">Votre position</div>

                {!userPos ? (
                  <div className="mt-3 text-sm text-slate-500">Position non détectée.</div>
                ) : (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Latitude</span>
                      <span className="font-bold text-slate-900">
                        {userPos.lat.toFixed(5)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Longitude</span>
                      <span className="font-bold text-slate-900">
                        {userPos.lng.toFixed(5)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="text-sm font-bold text-emerald-900">
                  Station recommandée
                </div>

                {!userPos ? (
                  <div className="mt-3 text-sm text-emerald-800">
                    Active le GPS pour obtenir une recommandation.
                  </div>
                ) : !nearestAvailableStation ? (
                  <div className="mt-3 text-sm font-semibold text-amber-800">
                    Aucune station disponible proche.
                  </div>
                ) : (
                  <>
                    <div className="mt-3 text-lg font-black text-slate-900">
                      {nearestAvailableStation.name}
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <InfoLine
                        label="Distance"
                        value={`${nearestAvailableStation.distance.toFixed(2)} km`}
                      />
                      <InfoLine
                        label="Puissance"
                        value={`${nearestAvailableStation.power_kw} kW`}
                      />
                      <InfoLine
                        label="Statut"
                        value={nearestAvailableStation.status}
                      />
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/user/plug/${nearestAvailableStation.id}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 text-sm font-bold text-slate-900">
              Stations proches
            </div>

            {stationsLoading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement des stations...
                </div>
              </div>
            ) : !userPos ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                Active le GPS pour afficher les stations proches.
              </div>
            ) : nearbyStations.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                Aucune station trouvée.
              </div>
            ) : (
              <div className="grid gap-3">
                {nearbyStations.map((station) => (
                  <div
                    key={station.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{station.name}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {station.location} • {station.distance.toFixed(2)} km
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          <Bolt size={14} />
                          {station.power_kw} kW
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                            station.status === "Disponible"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {station.status === "Disponible" ? (
                            <CircleCheck size={14} />
                          ) : (
                            <CircleX size={14} />
                          )}
                          {station.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Link
                        to={`/user/plug/${station.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-slate-900">Logique de navigation</div>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <PlugZap size={18} />
            </div>
          </div>

          <div className="mt-4 text-sm leading-relaxed text-slate-600">
            Cette page sert uniquement à localiser les stations proches via GPS.
            Ensuite l’utilisateur clique sur <span className="font-bold">Voir détails</span>,
            arrive dans <span className="font-bold">PlugDetails</span>, consulte les bornes
            disponibles, puis choisit la borne à réserver.
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}