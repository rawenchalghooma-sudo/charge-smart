import { Link } from "react-router-dom";

function LoginCard({
  title,
  desc,
  to,
  icon,
  color,
}: {
  title: string;
  desc: string;
  to: string;
  icon: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`grid h-12 w-12 place-items-center rounded-xl text-xl ${color}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 transition group-hover:gap-3">
        Se connecter <span>→</span>
      </div>
    </Link>
  );
}

export default function LoginSelector() {
  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
              ☀️
            </div>
            <span className="text-sm font-semibold text-slate-900">
              SolarPlug
            </span>
          </Link>

          <Link
            to="/signup"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Connexion
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Choisissez votre espace de connexion
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500 md:text-base">
            Sélectionnez le profil correspondant pour accéder à votre interface :
            conducteur, propriétaire ou administrateur.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <LoginCard
            title="Conducteur"
            desc="Accédez à vos réservations, vos sessions de charge et à la recherche de bornes disponibles."
            to="/user/login"
            icon="⚡"
            color="bg-amber-100 text-amber-700"
          />

          <LoginCard
            title="Propriétaire"
            desc="Gérez vos bornes, vos réservations, vos sessions et le suivi énergétique de votre réseau."
            to="/owner/login"
            icon="📊"
            color="bg-emerald-100 text-emerald-700"
          />

          <LoginCard
            title="Administrateur"
            desc="Supervisez l’ensemble du système, les accès, les rapports et la sécurité de la plateforme."
            to="/admin/login"
            icon="🛡️"
            color="bg-blue-100 text-blue-700"
          />
        </div>

        {/* Bottom links */}
        <div className="mt-10 text-center text-sm text-slate-500">
          Vous n’avez pas encore de compte ?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-600 hover:underline"
          >
            Créer un compte
          </Link>
        </div>
      </main>
    </div>
  );
}