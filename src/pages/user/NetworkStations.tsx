import { useMemo, useState } from "react";
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
  power_kw: number;
  energy_source: string;
  station_battery: number;
  status: StationStatus;
};

type Governorate = {
  name: string;
  stations: Station[];
};

function getStatusClass(status: StationStatus) {
  if (status === "Disponible") return "bg-emerald-50 text-emerald-600";
  if (status === "Occupée") return "bg-amber-50 text-amber-600";
  return "bg-rose-50 text-rose-600";
}

const TUNISIA_NETWORK: Governorate[] = [
  {
    name: "Tunis",
    stations: [
      { id: 1, name: "SolarPlug Tunis Centre", location: "Centre-ville, Tunis", power_kw: 22, energy_source: "Solaire", station_battery: 85, status: "Disponible" },
      { id: 2, name: "SolarPlug Lac 1", location: "Lac 1, Tunis", power_kw: 50, energy_source: "Solaire + Batterie", station_battery: 72, status: "Occupée" },
    ],
  },
  {
    name: "Ariana",
    stations: [
      { id: 3, name: "SolarPlug Ariana Ville", location: "Ariana Ville", power_kw: 22, energy_source: "Solaire", station_battery: 78, status: "Disponible" },
      { id: 4, name: "SolarPlug Ennasr", location: "Ennasr, Ariana", power_kw: 43, energy_source: "Solaire + Réseau", station_battery: 66, status: "Disponible" },
    ],
  },
  {
    name: "Ben Arous",
    stations: [
      { id: 5, name: "SolarPlug Ben Arous", location: "Ben Arous Centre", power_kw: 22, energy_source: "Solaire", station_battery: 81, status: "Disponible" },
      { id: 6, name: "SolarPlug Rades", location: "Radès", power_kw: 50, energy_source: "Solaire + Batterie", station_battery: 69, status: "Occupée" },
    ],
  },
  {
    name: "Manouba",
    stations: [
      { id: 7, name: "SolarPlug Manouba", location: "Manouba Centre", power_kw: 22, energy_source: "Solaire", station_battery: 74, status: "Disponible" },
      { id: 8, name: "SolarPlug Douar Hicher", location: "Douar Hicher, Manouba", power_kw: 22, energy_source: "Solaire", station_battery: 58, status: "Hors ligne" },
    ],
  },
  {
    name: "Nabeul",
    stations: [
      { id: 9, name: "SolarPlug Nabeul", location: "Nabeul Centre", power_kw: 22, energy_source: "Solaire", station_battery: 88, status: "Disponible" },
      { id: 10, name: "SolarPlug Hammamet", location: "Hammamet", power_kw: 50, energy_source: "Solaire + Batterie", station_battery: 76, status: "Disponible" },
      { id: 11, name: "SolarPlug Dar Chaabane", location: "Dar Chaabane, Nabeul", power_kw: 22, energy_source: "Solaire", station_battery: 61, status: "Occupée" },
    ],
  },
  {
    name: "Bizerte",
    stations: [
      { id: 12, name: "SolarPlug Bizerte", location: "Bizerte Centre", power_kw: 22, energy_source: "Solaire", station_battery: 82, status: "Disponible" },
      { id: 13, name: "SolarPlug Menzel Bourguiba", location: "Menzel Bourguiba", power_kw: 43, energy_source: "Solaire + Réseau", station_battery: 67, status: "Disponible" },
    ],
  },
  {
    name: "Béja",
    stations: [
      { id: 14, name: "SolarPlug Béja", location: "Béja Centre", power_kw: 22, energy_source: "Solaire", station_battery: 70, status: "Disponible" },
      { id: 15, name: "SolarPlug Testour", location: "Testour, Béja", power_kw: 22, energy_source: "Solaire", station_battery: 59, status: "Occupée" },
    ],
  },
  {
    name: "Jendouba",
    stations: [
      { id: 16, name: "SolarPlug Jendouba", location: "Jendouba Centre", power_kw: 22, energy_source: "Solaire", station_battery: 73, status: "Disponible" },
      { id: 17, name: "SolarPlug Tabarka", location: "Tabarka", power_kw: 43, energy_source: "Solaire + Batterie", station_battery: 65, status: "Disponible" },
    ],
  },
  {
    name: "Kef",
    stations: [
      { id: 18, name: "SolarPlug Kef", location: "Le Kef Centre", power_kw: 22, energy_source: "Solaire", station_battery: 64, status: "Disponible" },
      { id: 19, name: "SolarPlug Dahmani", location: "Dahmani, Kef", power_kw: 22, energy_source: "Solaire", station_battery: 53, status: "Hors ligne" },
    ],
  },
  {
    name: "Siliana",
    stations: [
      { id: 20, name: "SolarPlug Siliana", location: "Siliana Centre", power_kw: 22, energy_source: "Solaire", station_battery: 71, status: "Disponible" },
      { id: 21, name: "SolarPlug Makthar", location: "Makthar, Siliana", power_kw: 22, energy_source: "Solaire", station_battery: 62, status: "Occupée" },
    ],
  },
  {
    name: "Sousse",
    stations: [
      { id: 22, name: "SolarPlug Sousse Centre", location: "Sousse Centre", power_kw: 22, energy_source: "Solaire", station_battery: 91, status: "Disponible" },
      { id: 23, name: "SolarPlug Kantaoui", location: "Port El Kantaoui, Sousse", power_kw: 50, energy_source: "Solaire + Batterie", station_battery: 79, status: "Disponible" },
      { id: 24, name: "SolarPlug Msaken", location: "Msaken, Sousse", power_kw: 43, energy_source: "Solaire + Réseau", station_battery: 68, status: "Occupée" },
    ],
  },
  {
    name: "Monastir",
    stations: [
      { id: 25, name: "SolarPlug Monastir", location: "Monastir Centre", power_kw: 22, energy_source: "Solaire", station_battery: 84, status: "Disponible" },
      { id: 26, name: "SolarPlug Ksar Hellal", location: "Ksar Hellal, Monastir", power_kw: 43, energy_source: "Solaire + Batterie", station_battery: 70, status: "Disponible" },
    ],
  },
  {
    name: "Mahdia",
    stations: [
      { id: 27, name: "SolarPlug Mahdia", location: "Corniche Mahdia", power_kw: 22, energy_source: "Solaire", station_battery: 86, status: "Disponible" },
      { id: 28, name: "SolarPlug Chebba", location: "Chebba, Mahdia", power_kw: 22, energy_source: "Solaire", station_battery: 60, status: "Occupée" },
    ],
  },
  {
    name: "Sfax",
    stations: [
      { id: 29, name: "SolarPlug Sfax Centre", location: "Centre-ville, Sfax", power_kw: 43, energy_source: "Solaire + Batterie", station_battery: 83, status: "Disponible" },
      { id: 30, name: "SolarPlug Route Tunis", location: "Route de Tunis, Sfax", power_kw: 50, energy_source: "Solaire + Réseau", station_battery: 75, status: "Disponible" },
      { id: 31, name: "SolarPlug Sakiet Ezzit", location: "Sakiet Ezzit, Sfax", power_kw: 22, energy_source: "Solaire", station_battery: 63, status: "Occupée" },
    ],
  },
  {
    name: "Kairouan",
    stations: [
      { id: 32, name: "SolarPlug Kairouan", location: "Kairouan Centre", power_kw: 22, energy_source: "Solaire", station_battery: 80, status: "Disponible" },
      { id: 33, name: "SolarPlug Hajeb El Ayoun", location: "Hajeb El Ayoun, Kairouan", power_kw: 22, energy_source: "Solaire", station_battery: 57, status: "Hors ligne" },
    ],
  },
  {
    name: "Kasserine",
    stations: [
      { id: 34, name: "SolarPlug Kasserine", location: "Kasserine Centre", power_kw: 22, energy_source: "Solaire", station_battery: 69, status: "Disponible" },
      { id: 35, name: "SolarPlug Sbeitla", location: "Sbeitla, Kasserine", power_kw: 22, energy_source: "Solaire", station_battery: 55, status: "Occupée" },
    ],
  },
  {
    name: "Sidi Bouzid",
    stations: [
      { id: 36, name: "SolarPlug Sidi Bouzid", location: "Sidi Bouzid Centre", power_kw: 22, energy_source: "Solaire", station_battery: 77, status: "Disponible" },
      { id: 37, name: "SolarPlug Regueb", location: "Regueb, Sidi Bouzid", power_kw: 22, energy_source: "Solaire", station_battery: 61, status: "Disponible" },
    ],
  },
  {
    name: "Gabès",
    stations: [
      { id: 38, name: "SolarPlug Gabès Centre", location: "Centre-ville, Gabès", power_kw: 22, energy_source: "Solaire", station_battery: 89, status: "Disponible" },
      { id: 39, name: "SolarPlug Métouia", location: "Métouia, Gabès", power_kw: 43, energy_source: "Solaire + Batterie", station_battery: 72, status: "Disponible" },
    ],
  },
  {
    name: "Médenine",
    stations: [
      { id: 40, name: "SolarPlug Médenine", location: "Médenine Centre", power_kw: 22, energy_source: "Solaire", station_battery: 87, status: "Disponible" },
      { id: 41, name: "SolarPlug Djerba", location: "Djerba, Médenine", power_kw: 50, energy_source: "Solaire + Batterie", station_battery: 79, status: "Occupée" },
      { id: 42, name: "SolarPlug Zarzis", location: "Zarzis, Médenine", power_kw: 43, energy_source: "Solaire + Réseau", station_battery: 68, status: "Disponible" },
    ],
  },
  {
    name: "Tataouine",
    stations: [
      { id: 43, name: "SolarPlug Tataouine", location: "Tataouine Centre", power_kw: 22, energy_source: "Solaire", station_battery: 92, status: "Disponible" },
      { id: 44, name: "SolarPlug Ghomrassen", location: "Ghomrassen, Tataouine", power_kw: 22, energy_source: "Solaire", station_battery: 73, status: "Disponible" },
    ],
  },
  {
    name: "Gafsa",
    stations: [
      { id: 45, name: "SolarPlug Gafsa", location: "Gafsa Centre", power_kw: 22, energy_source: "Solaire", station_battery: 81, status: "Disponible" },
      { id: 46, name: "SolarPlug Métlaoui", location: "Métlaoui, Gafsa", power_kw: 22, energy_source: "Solaire", station_battery: 62, status: "Occupée" },
    ],
  },
  {
    name: "Tozeur",
    stations: [
      { id: 47, name: "SolarPlug Tozeur", location: "Tozeur Centre", power_kw: 22, energy_source: "Solaire", station_battery: 94, status: "Disponible" },
      { id: 48, name: "SolarPlug Nefta", location: "Nefta, Tozeur", power_kw: 22, energy_source: "Solaire", station_battery: 78, status: "Disponible" },
    ],
  },
  {
    name: "Kébili",
    stations: [
      { id: 49, name: "SolarPlug Kébili", location: "Kébili Centre", power_kw: 22, energy_source: "Solaire", station_battery: 90, status: "Disponible" },
      { id: 50, name: "SolarPlug Douz", location: "Douz, Kébili", power_kw: 43, energy_source: "Solaire + Batterie", station_battery: 76, status: "Disponible" },
    ],
  },
  {
    name: "Zaghouan",
    stations: [
      { id: 51, name: "SolarPlug Zaghouan", location: "Zaghouan Centre", power_kw: 22, energy_source: "Solaire", station_battery: 74, status: "Disponible" },
      { id: 52, name: "SolarPlug El Fahs", location: "El Fahs, Zaghouan", power_kw: 22, energy_source: "Solaire", station_battery: 59, status: "Occupée" },
    ],
  },
];

function StationCard({ station }: { station: Station }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{station.name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(station.status)}`}>
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const currentGovernorate = useMemo(() => {
    return TUNISIA_NETWORK.find((item) => item.name === selectedGovernorate) || TUNISIA_NETWORK[0];
  }, [selectedGovernorate]);

  const filteredStations = useMemo(() => {
    return currentGovernorate.stations.filter((station) => {
      return (
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.status.toLowerCase().includes(searchTerm.toLowerCase())
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
              Cliquez sur un gouvernorat pour afficher 2 à 3 stations SolarPlug disponibles.
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
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
            {TUNISIA_NETWORK.map((governorate) => {
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

          {filteredStations.length > 0 ? (
            filteredStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Aucune station trouvée
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Essaie de modifier la recherche.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}