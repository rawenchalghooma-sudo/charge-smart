import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  User,
  ArrowLeft,
  LogOut,
} from "lucide-react";

type ReservationStatus = "Confirmée" | "En attente" | "Annulée" | "Terminée";

type Reservation = {
  id: number;
  userName: string;
  station: string;
  date: string;
  time: string;
  duration: string;
  status: ReservationStatus;
};

const reservations: Reservation[] = [
  {
    id: 1,
    userName: "Mariem Chamekh",
    station: "Solar Station Tunis 01",
    date: "2026-03-11",
    time: "09:00",
    duration: "45 min",
    status: "Confirmée",
  },
  {
    id: 2,
    userName: "Ahmed Ben Ali",
    station: "Solar Station Sfax 02",
    date: "2026-03-11",
    time: "10:30",
    duration: "30 min",
    status: "En attente",
  },
  {
    id: 3,
    userName: "Sara Trabelsi",
    station: "Solar Station Sousse 03",
    date: "2026-03-11",
    time: "14:00",
    duration: "60 min",
    status: "Annulée",
  },
  {
    id: 4,
    userName: "Youssef Gharbi",
    station: "Solar Station Nabeul 04",
    date: "2026-03-11",
    time: "16:00",
    duration: "40 min",
    status: "Terminée",
  },
];

function getStatusClass(status: ReservationStatus) {
  if (status === "Confirmée") return "bg-emerald-50 text-emerald-600";
  if (status === "En attente") return "bg-amber-50 text-amber-600";
  if (status === "Annulée") return "bg-rose-50 text-rose-600";
  return "bg-slate-100 text-slate-600";
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {reservation.userName}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                reservation.status
              )}`}
            >
              {reservation.status}
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} />
              <span>{reservation.station}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>{reservation.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              <span>{reservation.time}</span>
            </div>

            <div className="flex items-center gap-2">
              <User size={15} />
              <span>Durée : {reservation.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
            <CheckCircle2 size={16} />
            Confirmer
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">
            <XCircle size={16} />
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservationsManagement() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/owner/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CalendarDays size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Gestion des réservations
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">
                Espace propriétaire
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

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

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Intro */}
        <section className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Réservations des utilisateurs
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Consultez, filtrez et gérez les créneaux de réservation des bornes.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            26 réservations aujourd’hui
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher par utilisateur ou borne..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />
            </div>

            <input
              type="date"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </section>

        {/* Reservation list */}
        <section className="grid gap-6">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </section>
      </main>
    </div>
  );
}