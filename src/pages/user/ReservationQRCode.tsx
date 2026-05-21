import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  History,
  LogOut,
  QrCode,
  Zap,
  BatteryCharging,
  Car,
  MapPin,
  Clock,
  AlertTriangle,
  Hourglass,
  XCircle,
} from "lucide-react";

export default function ReservationQRCode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const state = location.state as any;

  const reservation = state?.reservation;
  const station = state?.station;
  const selectedChargingPoint = state?.selectedChargingPoint;

  const reservationStatus = reservation?.status || "pending";

  const minimumDuration = state?.minimumDuration || 0;
  const targetPercent = state?.targetPercent || 0;
  const batteryKwh = state?.batteryKwh || 0;
  const urgencyPreview = state?.urgencyPreview || 0;

  const qrCodeId =
    reservation?.qrCodeId ||
    reservation?.qr_code_id ||
    `ID:${id}|URGENCY:${urgencyPreview}`;

  const qrParts = qrCodeId.match(/ID:(\d+)\|URGENCY:(\d+)/);
  const reservationIdFromQr = qrParts ? qrParts[1] : String(id);
  const urgencyFromQr = qrParts ? parseInt(qrParts[2]) : urgencyPreview;

  const getUrgencyStyle = (score: number) => {
    if (score >= 85) {
      return {
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        label: "CRITIQUE",
        dot: "bg-red-500",
      };
    }

    if (score >= 65) {
      return {
        color: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
        label: "HAUTE",
        dot: "bg-orange-500",
      };
    }

    if (score >= 40) {
      return {
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        label: "MOYENNE",
        dot: "bg-yellow-500",
      };
    }

    if (score >= 20) {
      return {
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        label: "FAIBLE",
        dot: "bg-blue-500",
      };
    }

    return {
      color: "text-slate-700",
      bg: "bg-slate-50",
      border: "border-slate-200",
      label: "TRÈS FAIBLE",
      dot: "bg-slate-400",
    };
  };

  const getStatusConfig = () => {
    if (reservationStatus === "confirmed") {
      return {
        label: "Réservation acceptée",
        title: "Votre QR code est prêt",
        message: "Présentez ce QR code à la borne pour démarrer la recharge.",
        badge: "bg-emerald-100 text-emerald-700",
        icon: <CheckCircle2 size={14} />,
        bigIcon: <CheckCircle2 size={24} />,
        box: "border-emerald-100 bg-emerald-50 text-emerald-800",
      };
    }

    if (reservationStatus === "rejected") {
      return {
        label: "Réservation refusée",
        title: "Réservation refusée",
        message: "Le propriétaire a refusé cette réservation.",
        badge: "bg-red-100 text-red-700",
        icon: <XCircle size={14} />,
        bigIcon: <XCircle size={24} />,
        box: "border-red-100 bg-red-50 text-red-800",
      };
    }

    return {
      label: "En attente confirmation propriétaire",
      title: "Réservation envoyée au propriétaire",
      message:
        "Votre demande a été envoyée au propriétaire. Veuillez attendre la confirmation.",
      badge: "bg-yellow-100 text-yellow-700",
      icon: <Hourglass size={14} />,
      bigIcon: <Hourglass size={24} />,
      box: "border-yellow-100 bg-yellow-50 text-yellow-800",
    };
  };

  const urgencyStyle = getUrgencyStyle(Number(urgencyFromQr || 0));
  const statusConfig = getStatusConfig();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById(
      "reservation-qr"
    ) as HTMLCanvasElement;

    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${qrCodeId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Retour dashboard
            </Link>

            <div>
              <div className="text-base font-black text-slate-900">
                Ticket de recharge
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Réservation #{reservationIdFromQr}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[32px] border border-emerald-100 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${statusConfig.badge}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                {statusConfig.title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
                {statusConfig.message}
              </p>
            </div>

            <div
              className={`rounded-3xl border px-5 py-4 ${urgencyStyle.bg} ${urgencyStyle.border}`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${urgencyStyle.dot}`} />
                <div>
                  <p
                    className={`text-xs font-black uppercase ${urgencyStyle.color}`}
                  >
                    Urgency score
                  </p>
                  <p className={`text-2xl font-black ${urgencyStyle.color}`}>
                    {urgencyFromQr}/100 — {urgencyStyle.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {reservationStatus === "pending" && (
          <div className="mb-8 rounded-3xl border border-yellow-100 bg-yellow-50 p-5 text-yellow-800">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} />
              <div>
                <p className="font-black">Votre réservation est en attente.</p>
                <p className="mt-1 text-sm">
                  Le propriétaire doit encore accepter ou refuser cette demande.
                  Le QR code sera disponible uniquement après confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {reservationStatus === "rejected" && (
          <div className="mb-8 rounded-3xl border border-red-100 bg-red-50 p-5 text-red-800">
            <div className="flex items-start gap-3">
              <XCircle size={20} />
              <div>
                <p className="font-black">Réservation refusée.</p>
                <p className="mt-1 text-sm">
                  Le QR code n’est pas disponible. Vous pouvez choisir une autre
                  station ou créer une nouvelle réservation.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[36px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            {reservationStatus !== "confirmed" ? (
              <div className="py-10">
                <div
                  className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${
                    reservationStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {reservationStatus === "rejected" ? (
                    <XCircle size={40} />
                  ) : (
                    <Hourglass size={40} />
                  )}
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900">
                  QR code non disponible
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm font-medium text-slate-500">
                  {reservationStatus === "pending"
                    ? "Le QR code sera généré uniquement après confirmation du propriétaire."
                    : "Cette réservation a été refusée, donc aucun QR code ne peut être généré."}
                </p>

                <div
                  className={`mt-6 rounded-3xl border p-5 text-left ${
                    reservationStatus === "rejected"
                      ? "border-red-100 bg-red-50 text-red-800"
                      : "border-yellow-100 bg-yellow-50 text-yellow-800"
                  }`}
                >
                  <p className="font-black">Statut actuel :</p>

                  <p className="mt-2 text-sm">
                    {reservationStatus === "pending"
                      ? "Votre réservation est en attente de confirmation."
                      : "Votre réservation a été refusée."}
                  </p>
                </div>

                <Link
                  to="/user/history"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800"
                >
                  <History size={16} />
                  Voir historique
                </Link>
              </div>
            ) : (
              <>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-sm">
                  <QrCode size={30} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-900">
                  QR code de réservation
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500">
                  Code unique lié à cette réservation confirmée.
                </p>

                <div className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-5 shadow-inner">
                  <div className="rounded-[24px] bg-white p-5 shadow-sm">
                    <QRCodeCanvas
                      id="reservation-qr"
                      value={qrCodeId}
                      size={280}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-left">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                    Contenu du QR
                  </p>

                  <p className="mt-2 break-all rounded-2xl bg-white px-4 py-3 text-lg font-black text-slate-900">
                    {qrCodeId}
                  </p>

                  <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-3 py-2">
                      ID :{" "}
                      <span className="text-slate-900">
                        #{reservationIdFromQr}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white px-3 py-2">
                      Urgency :{" "}
                      <span className="text-slate-900">
                        {urgencyFromQr}/100
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={downloadQRCode}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800"
                >
                  <Download size={16} />
                  Télécharger QR code
                </button>
              </>
            )}
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${statusConfig.box}`}
              >
                {statusConfig.bigIcon}
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Détails de la réservation
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Informations enregistrées pour la vérification.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard label="Statut" value={statusConfig.label} highlight />

              {reservationStatus === "confirmed" && (
                <InfoCard
                  icon={<QrCode size={18} />}
                  label="Code QR"
                  value={qrCodeId}
                />
              )}

              <InfoCard
                label="Numéro réservation"
                value={`#${reservationIdFromQr}`}
              />

              <InfoCard
                icon={<Zap size={18} />}
                label="Score d'urgence"
                value={`${urgencyFromQr} / 100 — ${urgencyStyle.label}`}
                highlight
              />

              <InfoCard
                icon={<MapPin size={18} />}
                label="Station"
                value={station?.name || "Station"}
              />

              <InfoCard
                label="Borne"
                value={selectedChargingPoint?.label || "Borne principale"}
              />

              <InfoCard
                label="Connecteur"
                value={selectedChargingPoint?.connectorType || "Type 2"}
              />

              <InfoCard
                icon={<Zap size={18} />}
                label="Puissance"
                value={`${
                  selectedChargingPoint?.powerKw ||
                  station?.power_kw ||
                  station?.powerKw ||
                  0
                } kW`}
              />

              <InfoCard
                icon={<Car size={18} />}
                label="Voiture"
                value={state?.vehicleType || "—"}
              />

              <InfoCard
                icon={<BatteryCharging size={18} />}
                label="Batterie"
                value={`${batteryKwh} kWh`}
              />

              <InfoCard label="Recharge souhaitée" value={`${targetPercent}%`} />

              <InfoCard
                label="Temps minimum estimé"
                value={`${minimumDuration} minutes`}
              />

              <InfoCard
                icon={<Clock size={18} />}
                label="Durée choisie"
                value={`${state?.durationMin || 0} minutes`}
              />

              <InfoCard label="Date" value={state?.date || "—"} />
              <InfoCard label="Heure" value={state?.time || "—"} />

              <InfoCard
                label="Énergie estimée"
                value={`${Number(state?.estimatedKwh || 0).toFixed(1)} kWh`}
              />

              <InfoCard
                label="Coût estimé"
                value={`${Number(state?.estimatedCost || 0).toFixed(2)} DT`}
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/user/history"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-emerald-700"
              >
                <History size={16} />
                Voir historique
              </Link>

              <Link
                to="/user/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Retour dashboard
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 ${
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}

        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 break-all text-sm font-black ${
          highlight ? "text-orange-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}