import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageCircle, FiEye, FiX } from "react-icons/fi";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Quotations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rfqMap, setRfqMap] = useState({});

  const openChat = async (quotation) => {
    const participantId =
      user?.role === "BUYER"
        ? quotation.supplierId
        : rfqMap[quotation.rfqId]?.buyerId;

    if (!participantId) {
      notify("The other participant could not be identified.", "error");
      return;
    }

    try {
      const { data } = await api.post("/chat/conversations", {
        participantIds: [Number(participantId)],
        rfqId: Number(quotation.rfqId),
      });

      navigate(`/chat?conversation=${data.data.id}`);
    } catch (error) {
      notify(getErrorMessage(error, "Unable to start conversation"), "error");
    }
  };

  const loadSupplier = async () => {
    const { data } = await api.get("/quotations/my");
    const quotations = data.quotations || [];

    setRows(quotations);

    const entries = await Promise.all(
      quotations.map(async (q) => {
        try {
          const response = await api.get(`/rfqs/${q.rfqId}`);
          return [q.rfqId, response.data.rfq];
        } catch {
          return [q.rfqId, null];
        }
      })
    );

    setRfqMap(Object.fromEntries(entries));
  };

  const loadBuyer = async () => {
    const { data } = await api.get("/rfqs/my");
    const rfqs = data.rfqs || [];

    const quoteSets = await Promise.all(
      rfqs.map(async (rfq) => {
        try {
          const response = await api.get(`/quotations/rfq/${rfq.id}`);

          return (response.data.quotations || []).map((q) => ({
            ...q,
            rfq,
          }));
        } catch {
          return [];
        }
      })
    );

    setRows(quoteSets.flat());
  };

  const load = async () => {
    setLoading(true);

    try {
      await (
        user?.role === "SUPPLIER"
          ? loadSupplier()
          : loadBuyer()
      );
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to load quotations"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.role]);

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? rows
        : rows.filter((r) => r.status === filter),
    [rows, filter]
  );

  const getRfqName = (q) =>
    q.rfq?.productName ||
    rfqMap[q.rfqId]?.productName ||
    `RFQ-${q.rfqId}`;

  const getCurrency = (q) =>
    q.rfq?.currency ||
    rfqMap[q.rfqId]?.currency ||
    "INR";

  const getBadgeTone = (status) => {
    if (status === "ACCEPTED") return "success";
    if (status === "NEGOTIATION") return "warning";
    return "neutral";
  };

  return (
    <div className="page w-full max-w-full overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">

        <div className="min-w-0">
          <span className="eyebrow">COMMERCIAL</span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
            {user?.role === "SUPPLIER"
              ? "My Quotations"
              : "RFQ Quotations"}
          </h1>

          <p className="muted mt-1 text-sm sm:text-base">
            Live quotation records from the backend.
          </p>
        </div>

        <div className="shrink-0">
          <Badge tone="success">
            {user?.role === "SUPPLIER" ? "SUPPLIER" : "BUYER"}
          </Badge>
        </div>
      </div>

      <Card>

        {/* FILTERS */}
        <div className="w-full overflow-x-auto pb-3 mb-4">
          <div className="flex min-w-max gap-2">
            {[
              "ALL",
              "SUBMITTED",
              "NEGOTIATION",
              "ACCEPTED",
              "REJECTED",
              "WITHDRAWN",
            ].map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setFilter(x)}
                className={`
                  whitespace-nowrap
                  rounded-lg
                  px-3 py-2
                  text-xs sm:text-sm
                  font-medium
                  transition-all
                  border
                  ${
                    filter === x
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr>
                <th>RFQ</th>
                <th>
                  {user?.role === "SUPPLIER"
                    ? "Buyer / RFQ"
                    : "Supplier"}
                </th>
                <th>Price</th>
                <th>Delivery</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Loading quotations…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id}>

                    <td>
                      <strong>{getRfqName(q)}</strong>
                      <small>RFQ-{q.rfqId}</small>
                    </td>

                    <td>
                      {user?.role === "SUPPLIER"
                        ? rfqMap[q.rfqId]?.buyerId || "Buyer"
                        : `Supplier #${q.supplierId}`}
                    </td>

                    <td className="font-semibold">
                      {getCurrency(q)} {q.price}
                    </td>

                    <td>{q.estimatedDeliveryTime}</td>

                    <td>
                      <Badge tone={getBadgeTone(q.status)}>
                        {q.status}
                      </Badge>
                    </td>

                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setSelected(q)}
                        >
                          <FiEye />
                          View
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => openChat(q)}
                        >
                          <FiMessageCircle />
                          Chat
                        </Button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE + TABLET CARDS */}
        <div className="lg:hidden space-y-3">

          {loading ? (
            <div className="py-10 text-center text-slate-500">
              Loading quotations…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              No quotations found.
            </div>
          ) : (
            filtered.map((q) => (
              <div
                key={q.id}
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white
                  p-4
                  shadow-sm
                  hover:shadow-md
                  transition-shadow
                "
              >

                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">
                      RFQ-{q.rfqId}
                    </p>

                    <h3 className="mt-1 font-semibold text-slate-900 break-words">
                      {getRfqName(q)}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    <Badge tone={getBadgeTone(q.status)}>
                      {q.status}
                    </Badge>
                  </div>

                </div>

                {/* INFORMATION */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-5">

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      {user?.role === "SUPPLIER"
                        ? "Buyer"
                        : "Supplier"}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800 truncate">
                      {user?.role === "SUPPLIER"
                        ? rfqMap[q.rfqId]?.buyerId || "Buyer"
                        : `Supplier #${q.supplierId}`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {getCurrency(q)} {q.price}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">
                      Estimated delivery
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {q.estimatedDeliveryTime}
                    </p>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() => setSelected(q)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-lg
                      border border-slate-200
                      px-3 py-2.5
                      text-sm font-medium
                      text-slate-700
                      hover:bg-slate-50
                      transition
                    "
                  >
                    <FiEye />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => openChat(q)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-lg
                      bg-slate-900
                      px-3 py-2.5
                      text-sm font-medium
                      text-white
                      hover:bg-slate-800
                      transition
                    "
                  >
                    <FiMessageCircle />
                    Chat
                  </button>

                </div>

              </div>
            ))
          )}

        </div>
      </Card>

      {/* MODAL */}
      {selected && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50
            p-3 sm:p-5
          "
          onClick={() => setSelected(null)}
        >
          <div
            className="
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
              p-5 sm:p-6
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 mb-6">

              <div className="min-w-0">
                <span className="eyebrow">
                  QUOTATION-{selected.id}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  Quotation details
                </h2>
              </div>

              <button
                type="button"
                className="
                  shrink-0
                  flex items-center justify-center
                  h-9 w-9
                  rounded-lg
                  hover:bg-slate-100
                  text-slate-500
                "
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>

            </div>

            {/* DETAILS */}
            <div className="space-y-4">

              <Detail
                label="RFQ"
                value={getRfqName(selected)}
              />

              <Detail
                label="Supplier"
                value={selected.supplierId}
              />

              <Detail
                label="Price"
                value={`${getCurrency(selected)} ${selected.price}`}
              />

              <Detail
                label="Estimated delivery"
                value={selected.estimatedDeliveryTime}
              />

              <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-400">
                  Status
                </span>

                <div>
                  <Badge tone={getBadgeTone(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>
              </div>

              <Detail
                label="Message"
                value={selected.message || "No message"}
              />

            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="
                mt-6
                w-full
                rounded-lg
                bg-slate-900
                px-4 py-3
                text-sm font-semibold
                text-white
                hover:bg-slate-800
                transition
              "
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-sm sm:text-base font-semibold text-slate-800 break-words">
        {value}
      </span>
    </div>
  );
}