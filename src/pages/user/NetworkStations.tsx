import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BatteryCharging,
  BarChart3,
  LogOut,
  MapPin,
  Search,
  Zap,
  Eye,
  Building2,
} from "lucide-react";

type StationStatus = "Disponible" | "Occupée" | "Hors ligne";

type Station = {
  id: number;
  name: string;
  location: string;
  address?: string;
  city?: string;
  power_kw: number;
  energy_source: string;
  station_battery: number;
  status: StationStatus;
};

type Governorate = {
  name: string;
  stations: Station[];
};

const GOVERNORATE_NAMES = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
  "Zaghouan",
];

function getStatusClass(status: StationStatus) {
  if (status === "Disponible") return "bg-emerald-50 text-emerald-600";
  if (status === "Occupée") return "bg-amber-50 text-amber-600";
  return "bg-rose-50 text-rose-600";
}

function StationCard({ station }: { station: Station }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                station.status
              )}`}
            >
              {station.status}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} />
              <span>{station.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} />
              <span>{station.power_kw} kW</span>
            </div>
            <div className="flex items-center gap-2">
              <BatteryCharging size={15} />
              <span>{station.station_battery}% batterie</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 size={15} />
              <span>{station.energy_source}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/user/plug/${station.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Eye size={16} />
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NetworkStations() {
  const navigate = useNavigate();

  const [selectedGovernorate, setSelectedGovernorate] = useState("Tunis");
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/stations");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur lors du chargement des bornes.");
        }

        setStations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les bornes depuis le serveur.");
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const tunisiaNetwork = useMemo<Governorate[]>(() => {
    return GOVERNORATE_NAMES.map((name) => ({
      name,
      stations: stations.filter((station) => {
        const stationCity = (station.city || "").trim().toLowerCase();
        return stationCity === name.trim().toLowerCase();
      }),
    }));
  }, [stations]);

  const currentGovernorate = useMemo(() => {
    return (
      tunisiaNetwork.find((item) => item.name === selectedGovernorate) ||
      tunisiaNetwork[0]
    );
  }, [selectedGovernorate, tunisiaNetwork]);

  const filteredStations = useMemo(() => {
    return currentGovernorate.stations.filter((station) => {
      const q = searchTerm.toLowerCase();
      return (
        station.name.toLowerCase().includes(q) ||
        station.location.toLowerCase().includes(q) ||
        station.status.toLowerCase().includes(q) ||
        (station.city || "").toLowerCase().includes(q)
      );
    });
  }, [currentGovernorate, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Zap size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Réseau SolarPlug Tunisie
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                24 gouvernorats • Stations EV solaires
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Sélectionnez un gouvernorat
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Cliquez sur un gouvernorat pour afficher les stations SolarPlug disponibles.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
            {filteredStations.length} station{filteredStations.length > 1 ? "s" : ""} affichée
            {filteredStations.length > 1 ? "s" : ""}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une station dans le gouvernorat sélectionné..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
              Gouvernorat sélectionné :{" "}
              <span className="text-emerald-700">{selectedGovernorate}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {tunisiaNetwork.map((governorate) => {
              const isSelected = governorate.name === selectedGovernorate;

              return (
                <button
                  key={governorate.name}
                  type="button"
                  onClick={() => {
                    setSelectedGovernorate(governorate.name);
                    setSearchTerm("");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-500/10"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span className="text-sm font-black">{governorate.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {governorate.stations.length} stations
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">
              Stations à {selectedGovernorate}
            </h3>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              {filteredStations.length} résultat{filteredStations.length > 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Chargement...</h3>
              <p className="mt-2 text-sm text-slate-500">
                Récupération des bornes depuis le serveur.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold text-rose-700">Erreur</h3>
              <p className="mt-2 text-sm text-rose-600">{error}</p>
            </div>
          ) : filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Aucune station trouvée
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Aucune borne n’est disponible pour ce gouvernorat ou cette recherche.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}