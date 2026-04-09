import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Shield,
  Building2,
  CircleUserRound,
} from "lucide-react";

type UserRole = "Conducteur" | "Propriétaire" | "Administrateur";
type UserStatus = "Actif" | "Suspendu";

type PlatformUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
};

const users: PlatformUser[] = [
  {
    id: 1,
    name: "Mariem Chamekh",
    email: "mariem@example.com",
    role: "Conducteur",
    status: "Actif",
    joinedAt: "2026-02-10",
  },
  {
    id: 2,
    name: "Ahmed Ben Ali",
    email: "ahmed.owner@example.com",
    role: "Propriétaire",
    status: "Actif",
    joinedAt: "2026-01-22",
  },
  {
    id: 3,
    name: "Admin Central",
    email: "admin@solarplug.com",
    role: "Administrateur",
    status: "Actif",
    joinedAt: "2025-12-01",
  },
  {
    id: 4,
    name: "Sara Trabelsi",
    email: "sara@example.com",
    role: "Conducteur",
    status: "Suspendu",
    joinedAt: "2026-02-28",
  },
];

function getRoleClass(role: UserRole) {
  if (role === "Conducteur") return "bg-amber-50 text-amber-700";
  if (role === "Propriétaire") return "bg-emerald-50 text-emerald-700";
  return "bg-sky-50 text-sky-700";
}

function getStatusClass(status: UserStatus) {
  return status === "Actif"
    ? "bg-emerald-50 text-emerald-600"
    : "bg-rose-50 text-rose-600";
}

function getRoleIcon(role: UserRole) {
  if (role === "Conducteur") return <CircleUserRound size={16} />;
  if (role === "Propriétaire") return <Building2 size={16} />;
  return <Shield size={16} />;
}

function UserCard({ user }: { user: PlatformUser }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                user.role
              )}`}
            >
              {getRoleIcon(user.role)}
              {user.role}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </div>

          <div className="mt-3 space-y-1 text-sm text-slate-500">
            <p>{user.email}</p>
            <p>Inscrit le : {user.joinedAt}</p>
            <p>ID utilisateur : #{user.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Voir profil
          </button>

          {user.status === "Actif" ? (
            <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100">
              <UserX size={16} />
              Suspendre
            </button>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
              <UserCheck size={16} />
              Réactiver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersManagement() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900">
                Gestion des utilisateurs
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
              Comptes de la plateforme
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Supervisez les utilisateurs, propriétaires et administrateurs.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">
            1243 comptes • 18 suspendus
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
                placeholder="Rechercher par nom ou email..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-sky-300 focus:bg-white"
              />
            </div>

            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-300 focus:bg-white">
              <option>Tous les rôles</option>
              <option>Conducteur</option>
              <option>Propriétaire</option>
              <option>Administrateur</option>
            </select>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              Filtrer
            </button>
          </div>
        </section>

        <section className="grid gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </section>
      </main>
    </div>
  );
}