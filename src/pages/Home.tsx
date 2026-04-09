import { Link } from "react-router-dom";

function IconBadge({ variant }: { variant: "user" | "owner" | "admin" }) {
  const base = "grid h-12 w-12 place-items-center rounded-xl";
  const map = {
    user: `${base} bg-amber-100 text-amber-700`,
    owner: `${base} bg-emerald-100 text-emerald-700`,
    admin: `${base} bg-blue-100 text-blue-700`,
  };

  const glyph = variant === "user" ? "⚡" : variant === "owner" ? "📊" : "🛡️";
  return <div className={map[variant]}>{glyph}</div>;
}

function RoleCard({
  variant,
  title,
  desc,
}: {
  variant: "user" | "owner" | "admin";
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <IconBadge variant={variant} />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{desc}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#f5f9ff]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_600px_at_30%_0%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(900px_600px_at_70%_10%,rgba(34,197,94,0.10),transparent_55%)]" />

      {/* Navbar */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
              ☀️
            </div>
            <div className="text-sm font-semibold text-slate-900">
              SolarPlug
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Connexion
            </Link>

            <Link
              to="/signup"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Rechargez votre véhicule avec{" "}
            <span className="text-emerald-600">l’énergie solaire</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 md:text-base">
            Trouvez des bornes solaires à proximité, réservez votre créneau et
            contribuez à une mobilité durable.
          </p>
        </div>

        {/* Role Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <RoleCard
            variant="user"
            title="Conducteur"
            desc="Trouvez des bornes, réservez un créneau et suivez vos sessions de charge."
          />

          <RoleCard
            variant="owner"
            title="Propriétaire"
            desc="Gérez les bornes, les réservations, les sessions et le monitoring énergétique."
          />

          <RoleCard
            variant="admin"
            title="Administrateur"
            desc="Supervisez le réseau, les rapports, la sécurité et les accès."
          />
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-200/70" />

        {/* Pourquoi choisir */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Pourquoi choisir SolarPlug ?
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon="♻️"
            title="Éco-responsable"
            desc="Rechargez avec une énergie 100% renouvelable."
          />

          <FeatureCard
            icon="💰"
            title="Économies"
            desc="Réduisez vos coûts par rapport aux stations classiques."
          />

          <FeatureCard
            icon="📍"
            title="Pratique"
            desc="Trouvez des bornes proches avec disponibilité en temps réel."
          />
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-slate-200/70 py-8 text-xs text-slate-500">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span>☀️</span>
              <span className="font-semibold text-slate-700">SolarPlug</span>
              <span>— Réseau de recharge à énergie renouvelable</span>
            </div>

            <div className="flex gap-6">
              <span className="font-semibold text-slate-700">Produit</span>
              <span className="font-semibold text-slate-700">Entreprise</span>
              <span className="font-semibold text-slate-700">Légal</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}