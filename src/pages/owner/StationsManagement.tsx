import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  BatteryCharging,
  Zap,
  Wrench,
  Power,
  Eye,
  SlidersHorizontal,
  BarChart3,
  LogOut,
} from "lucide-react";

type StationStatus = "Disponible" | "Occupée" | "Maintenance";

type Station = {
  id: number;
  name: string;
  location: string;
  power_kw: number | string;
  energy_source: string;
  station_battery: number | string;
  status: StationStatus;
};

function getStatusClass(status: StationStatus) {
  if (status === "Disponible") {
    return "bg-emerald-50 text-emerald-600";
  }
  if (status === "Occupée") {
    return "bg-amber-50 text-amber-600";
  }
  return "bg-rose-50 text-rose-600";
}

function StationCard({ station }: { station: Station }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={15} />
            <span>{station.location}</span>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
            station.status
          )}`}
        >
          {station.status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Puissance
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {station.power_kw} kW
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <BatteryCharging size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Batterie
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {station.station_battery}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          <BarChart3 size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Source énergie
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {station.energy_source}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/owner/station/${station.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Eye size={16} />
          Voir détails
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
        >
          <Wrench size={16} />
          Maintenance
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100"
        >
          <Power size={16} />
          Désactiver
        </button>
      </div>
    </div>
  );
}

export default function StationsManagement() {
  const navigate = useNavigate();

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/stations");

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des stations");
        }

        const data = await response.json();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les stations.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "Tous les statuts" || station.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stations, searchTerm, statusFilter]);

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
                Gestion des bornes
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace propriétaire
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/owner/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Retour dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/owner/stations/new")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus size={16} />
              Ajouter une borne
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
              Supervision des stations
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Consultez, recherchez et gérez les bornes de recharge de votre
              réseau.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
            {filteredStations.length} station
            {filteredStations.length > 1 ? "s" : ""} affichée
            {filteredStations.length > 1 ? "s" : ""}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une borne par nom ou emplacement..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            >
              <option>Tous les statuts</option>
              <option>Disponible</option>
              <option>Occupée</option>
              <option>Maintenance</option>
            </select>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal size={16} />
              Filtres avancés
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Chargement des stations...
            </h3>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-rose-600">{error}</h3>
          </div>
        ) : (
          <section className="grid gap-6">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <StationCard key={station.id} station={station} />
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Aucune borne trouvée
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Essaie de modifier le texte de recherche ou le filtre sélectionné.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}