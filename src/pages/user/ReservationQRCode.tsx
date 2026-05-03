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
} from "lucide-react";

export default function ReservationQRCode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const state = location.state as any;

  const reservation = state?.reservation;
  const station = state?.station;
  const selectedChargingPoint = state?.selectedChargingPoint;

  // =============================================
  // QR FORMAT : R{id}_{urgency}
  // Exemple : R18_85  → id=18, urgency=85
  // Ce code est scanné par la caméra ESP32-S3
  // L'IA embarquée extrait urgency directement
  // =============================================
  const qrCodeId = reservation?.qrCodeId || `R${id}_5`;

  // Parser le QR pour afficher les détails
  const qrParts = qrCodeId.match(/^R(\d+)_(\d+)$/);
  const reservationIdFromQr = qrParts ? qrParts[1] : String(id);
  const urgencyFromQr       = qrParts ? parseInt(qrParts[2]) : 5;

  // Couleur et label selon le score d'urgence
  const getUrgencyStyle = (score: number) => {
    if (score >= 85) return { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    label: "CRITIQUE",  dot: "bg-red-500"    };
    if (score >= 65) return { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", label: "HAUTE",     dot: "bg-orange-500" };
    if (score >= 40) return { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", label: "MOYENNE",   dot: "bg-yellow-500" };
    if (score >= 20) return { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",   label: "FAIBLE",    dot: "bg-blue-500"   };
    return               { color: "text-slate-700",  bg: "bg-slate-50",  border: "border-slate-200",  label: "TRÈS FAIBLE", dot: "bg-slate-400" };
  };

  const urgencyStyle = getUrgencyStyle(urgencyFromQr);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("reservation-qr") as HTMLCanvasElement;
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
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900">
      {/* ── Header ── */}
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
              <div className="text-sm font-bold text-slate-900">
                QR Code réservation
              </div>
              <div className="text-xs text-slate-500">Réservation #{id}</div>
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

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* ── Colonne gauche : QR ── */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-700">
              <QrCode size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Réservation confirmée
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Présentez ce QR code à la borne. La caméra ESP32-S3 lira
              automatiquement votre ID et le score d'urgence pour l'IA.
            </p>

            {/* QR Code */}
            <div className="mt-8 flex justify-center rounded-3xl border border-slate-200 bg-white p-6">
              <QRCodeCanvas
                id="reservation-qr"
                value={qrCodeId}
                size={300}
                level="M"
                includeMargin={true}
              />
            </div>

            {/* Badge QR décodé */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
              <p className="text-xs font-semibold text-emerald-700">
                Contenu du QR (lu par ESP32-S3)
              </p>
              <p className="mt-1 break-all text-xl font-black text-slate-900">
                {qrCodeId}
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                <span>
                  🔢 ID réservation :{" "}
                  <strong className="text-slate-900">#{reservationIdFromQr}</strong>
                </span>
                <span>
                  ⚡ Urgency :{" "}
                  <strong className="text-slate-900">{urgencyFromQr} / 100</strong>
                </span>
              </div>
            </div>

            {/* Badge urgence visuel */}
            <div
              className={`mt-3 rounded-2xl border px-4 py-3 text-left ${urgencyStyle.bg} ${urgencyStyle.border}`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${urgencyStyle.dot}`} />
                <p className={`text-xs font-bold ${urgencyStyle.color}`}>
                  Niveau d'urgence IA : {urgencyStyle.label}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Ce score est transmis directement à l'IA embarquée (logique floue)
                pour décider la puissance et la source de recharge.
              </p>
            </div>

            <button
              onClick={downloadQRCode}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Download size={16} />
              Télécharger QR code
            </button>
          </div>

          {/* ── Colonne droite : Détails ── */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <h2 className="text-xl font-black text-slate-900">
                Détails de la réservation
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              <InfoRow label="Code QR"              value={qrCodeId} />
              <InfoRow label="Numéro réservation"   value={`#${reservationIdFromQr}`} />
              <InfoRow
                label="Score d'urgence (IA)"
                value={`${urgencyFromQr} / 100 — ${urgencyStyle.label}`}
                highlight={urgencyFromQr >= 65}
              />
              <InfoRow label="Station"              value={station?.name || "Station"} />
              <InfoRow label="Borne"                value={selectedChargingPoint?.label || "—"} />
              <InfoRow
                label="Connecteur"
                value={selectedChargingPoint?.connectorType || "—"}
              />
              <InfoRow
                label="Puissance"
                value={`${selectedChargingPoint?.powerKw || station?.power_kw || 0} kW`}
              />
              <InfoRow label="Type voiture"         value={state?.vehicleType || "—"} />
              <InfoRow label="Date"                 value={state?.date || "—"} />
              <InfoRow label="Heure"                value={state?.time || "—"} />
              <InfoRow label="Durée"                value={`${state?.durationMin || 0} minutes`} />
              <InfoRow
                label="Énergie estimée"
                value={`${Number(state?.estimatedKwh || 0).toFixed(1)} kWh`}
              />
              <InfoRow
                label="Coût estimé"
                value={`${Number(state?.estimatedCost || 0).toFixed(2)} DT`}
              />
            </div>

            {/* Info ESP32 */}
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <Zap size={16} className="mt-0.5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-700">
                    Flux IA embarquée (ESP32-S3)
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Scan QR → extrait <strong>id={reservationIdFromQr}</strong> et{" "}
                    <strong>urgency={urgencyFromQr}</strong> → POST /predict →
                    logique floue → décision recharge
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/user/history"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <History size={16} />
                Voir historique
              </Link>

              <Link
                to="/user/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Retour dashboard
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ── InfoRow ──
function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span
        className={`break-all text-right text-sm font-black ${
          highlight ? "text-orange-700" : "text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}