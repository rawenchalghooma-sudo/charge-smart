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
} from "lucide-react";

export default function ReservationQRCode() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const state = location.state as any;

  const reservation = state?.reservation;
  const station = state?.station;
  const selectedChargingPoint = state?.selectedChargingPoint;

  const qrCodeId =
    reservation?.qrCodeId || `SP-USER-${reservation?.userId || "UNKNOWN"}-RES-${id}`;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/user/login");
  };

  const qrData = JSON.stringify({
    qrCodeId,
    userId: reservation?.userId,
    reservationId: id,
    stationId: reservation?.stationId,
    stationName: station?.name,
    borne: selectedChargingPoint?.label,
    connector: selectedChargingPoint?.connectorType,
    powerKw: selectedChargingPoint?.powerKw,
    vehicleType: state?.vehicleType,
    date: state?.date,
    time: state?.time,
    durationMin: state?.durationMin,
    estimatedKwh: state?.estimatedKwh,
    estimatedCost: state?.estimatedCost,
    status: reservation?.status,
  });

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
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-700">
              <QrCode size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Réservation confirmée
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Présentez ce QR code à la borne pour identifier votre réservation.
            </p>

            <div className="mt-8 flex justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <QRCodeCanvas
                id="reservation-qr"
                value={qrData}
                size={220}
                level="H"
                includeMargin
              />
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold text-emerald-700">
                ID QR spécifique
              </p>
              <p className="mt-1 break-all text-sm font-black text-slate-900">
                {qrCodeId}
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

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <h2 className="text-xl font-black text-slate-900">
                Détails de la réservation
              </h2>
            </div>

            <div className="mt-6 grid gap-3">
              <InfoRow label="ID QR" value={qrCodeId} />
              <InfoRow label="Numéro réservation" value={`#${id}`} />
              <InfoRow label="Station" value={station?.name || "Station"} />
              <InfoRow label="Borne" value={selectedChargingPoint?.label || "—"} />
              <InfoRow
                label="Connecteur"
                value={selectedChargingPoint?.connectorType || "—"}
              />
              <InfoRow
                label="Puissance"
                value={`${selectedChargingPoint?.powerKw || station?.power_kw || 0} kW`}
              />
              <InfoRow label="Type voiture" value={state?.vehicleType || "—"} />
              <InfoRow label="Date" value={state?.date || "—"} />
              <InfoRow label="Heure" value={state?.time || "—"} />
              <InfoRow label="Durée" value={`${state?.durationMin || 0} minutes`} />
              <InfoRow
                label="Énergie estimée"
                value={`${Number(state?.estimatedKwh || 0).toFixed(1)} kWh`}
              />
              <InfoRow
                label="Coût estimé"
                value={`${Number(state?.estimatedCost || 0).toFixed(2)} DT`}
              />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="break-all text-right text-sm font-black text-slate-900">
        {value}
      </span>
    </div>
  );
}