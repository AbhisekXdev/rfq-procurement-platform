import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiMessageCircle,
  FiArrowLeft,
  FiSend,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiTag,
  FiUser,
} from "react-icons/fi";

import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import api, { getErrorMessage } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function RFQDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(null);

  const [form, setForm] = useState({
    price: "",
    estimatedDeliveryTime: "",
    message: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get(`/rfqs/${id}`);
      setRfq(data.rfq);

      if (user?.role === "BUYER") {
        const quoteRes = await api.get(`/quotations/rfq/${id}`);
        setQuotations(quoteRes.data.quotations || []);
      }
    } catch (error) {
      notify(getErrorMessage(error, "Failed to load RFQ"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id, user?.role]);

  const submitQuote = async (event) => {
    event.preventDefault();

    setQuoteLoading(true);

    try {
      await api.post(`/quotations/rfq/${id}`, {
        ...form,
        price: Number(form.price),
      });

      notify("Quotation submitted successfully.", "success");

      setForm({
        price: "",
        estimatedDeliveryTime: "",
        message: "",
      });

      await load();
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to submit quotation"),
        "error"
      );
    } finally {
      setQuoteLoading(false);
    }
  };

  const openChat = async (participantId, rfqId = id) => {
    if (!participantId) {
      notify(
        "The other participant could not be identified.",
        "error"
      );
      return;
    }

    setChatLoading(Number(participantId));

    try {
      const { data } = await api.post("/chat/conversations", {
        participantIds: [Number(participantId)],
        rfqId: Number(rfqId),
      });

      const conversationId = data?.data?.id;

      if (!conversationId) {
        throw new Error("Conversation was not created");
      }

      navigate(`/chat?conversation=${conversationId}`);
    } catch (error) {
      notify(
        getErrorMessage(error, "Unable to start conversation"),
        "error"
      );
    } finally {
      setChatLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
        <Card>
          <div className="flex items-center justify-center py-10 text-sm sm:text-base text-gray-500">
            Loading RFQ…
          </div>
        </Card>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
        <Card>
          <div className="text-center py-10">
            <h2 className="text-lg sm:text-xl font-semibold">
              RFQ not found
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              The requested RFQ could not be found.
            </p>

            <Link
              to="/rfqs"
              className="btn btn-primary inline-flex mt-5"
            >
              <FiArrowLeft />
              Back to RFQs
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6 pb-8">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mb-5 sm:mb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0 flex-1">
            <span className="eyebrow">
              RFQ-{rfq.id}
            </span>

            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
              {rfq.productName}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed max-w-3xl break-words">
              {rfq.description}
            </p>
          </div>

          <div className="flex-shrink-0 self-start">
            <Badge
              tone={rfq.status === "OPEN" ? "success" : "neutral"}
            >
              {rfq.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">

        {/* =======================================================
            REQUIREMENT
        ======================================================= */}
        <div
          className={
            user?.role === "SUPPLIER" && rfq.status === "OPEN"
              ? "lg:col-span-7"
              : "lg:col-span-12"
          }
        >
          <Card title="Requirement">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

              <DetailItem
                icon={<FiPackage />}
                label="Quantity"
                value={Number(rfq.quantity).toLocaleString()}
              />

              <DetailItem
                icon={<FiMapPin />}
                label="Delivery"
                value={rfq.deliveryLocation}
              />

              <DetailItem
                icon={<FiCalendar />}
                label="Deadline"
                value={
                  rfq.deadline
                    ? new Date(rfq.deadline).toLocaleDateString()
                    : "—"
                }
              />

              <DetailItem
                icon={<FiDollarSign />}
                label="Budget"
                value={
                  rfq.budget
                    ? `${rfq.currency || "INR"} ${rfq.budget}`
                    : "Not specified"
                }
              />

              <DetailItem
                icon={<FiTag />}
                label="Category"
                value={rfq.category || "—"}
              />
            </div>
          </Card>
        </div>

        {/* =======================================================
            SUPPLIER QUOTATION
        ======================================================= */}
        {user?.role === "SUPPLIER" &&
          rfq.status === "OPEN" && (
            <div className="lg:col-span-5">
              <Card title="Submit quotation">
                <form
                  onSubmit={submitQuote}
                  className="flex flex-col gap-4"
                >
                  <Input
                    label="Price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                    required
                  />

                  <Input
                    label="Estimated delivery time"
                    value={form.estimatedDeliveryTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estimatedDeliveryTime: e.target.value,
                      })
                    }
                    placeholder="e.g. 15 days"
                    required
                  />

                  <label className="field">
                    <span>Message</span>

                    <textarea
                      rows="5"
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value,
                        })
                      }
                      placeholder="Add additional information for the buyer..."
                      className="w-full resize-y"
                    />
                  </label>

                  <Button
                    type="submit"
                    loading={quoteLoading}
                    className="w-full sm:w-auto"
                  >
                    <FiSend />
                    Submit quotation
                  </Button>
                </form>
              </Card>
            </div>
          )}

        {/* =======================================================
            SUPPLIER BUYER CHAT
        ======================================================= */}
        {user?.role === "SUPPLIER" && (
          <div className="lg:col-span-5">
            <Card title="Buyer">
              <div className="flex flex-col gap-4">

                <div className="flex items-center gap-3 rounded-xl border bg-gray-50/70 p-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                    <FiUser />
                  </div>

                  <div className="min-w-0">
                    <span className="block text-xs sm:text-sm text-gray-500">
                      Buyer ID
                    </span>

                    <strong className="block text-sm sm:text-base break-all">
                      {rfq.buyerId}
                    </strong>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => openChat(rfq.buyerId)}
                  loading={
                    chatLoading === Number(rfq.buyerId)
                  }
                >
                  <FiMessageCircle />
                  Chat with buyer
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* =========================================================
          BUYER QUOTATIONS
      ========================================================= */}
      {user?.role === "BUYER" && (
        <div className="mt-5 sm:mt-6">
          <Card title={`Quotations (${quotations.length})`}>

            {quotations.length === 0 ? (
              <div className="py-8 sm:py-10 text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <FiMessageCircle />
                </div>

                <p className="font-medium text-sm sm:text-base">
                  No quotations submitted yet.
                </p>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Supplier quotations will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop / Tablet table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead>
                      <tr>
                        <th>Supplier</th>
                        <th>Price</th>
                        <th>Delivery</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Chat</th>
                      </tr>
                    </thead>

                    <tbody>
                      {quotations.map((q) => (
                        <tr key={q.id}>
                          <td>
                            <strong>
                              {q.supplier?.name ||
                                `Supplier #${q.supplierId}`}
                            </strong>

                            <small>
                              {q.supplier?.email || ""}
                            </small>
                          </td>

                          <td>
                            {rfq.currency || "INR"} {q.price}
                          </td>

                          <td>
                            {q.estimatedDeliveryTime}
                          </td>

                          <td className="max-w-xs">
                            <span className="break-words">
                              {q.message || "—"}
                            </span>
                          </td>

                          <td>
                            <Badge
                              tone={
                                q.status === "ACCEPTED"
                                  ? "success"
                                  : "neutral"
                              }
                            >
                              {q.status}
                            </Badge>
                          </td>

                          <td>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                openChat(q.supplierId)
                              }
                              loading={
                                chatLoading ===
                                Number(q.supplierId)
                              }
                            >
                              <FiMessageCircle />
                              Chat
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile quotation cards */}
                <div className="md:hidden space-y-3">
                  {quotations.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-xl border p-4 bg-white shadow-sm"
                    >
                      {/* Supplier */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                            <FiUser />
                          </div>

                          <div className="min-w-0">
                            <strong className="block text-sm break-words">
                              {q.supplier?.name ||
                                `Supplier #${q.supplierId}`}
                            </strong>

                            {q.supplier?.email && (
                              <small className="block text-xs text-gray-500 break-all mt-0.5">
                                {q.supplier.email}
                              </small>
                            )}
                          </div>
                        </div>

                        <Badge
                          tone={
                            q.status === "ACCEPTED"
                              ? "success"
                              : "neutral"
                          }
                        >
                          {q.status}
                        </Badge>
                      </div>

                      {/* Quote information */}
                      <div className="grid grid-cols-2 gap-3 mt-4">

                        <div className="rounded-lg bg-gray-50 p-3">
                          <span className="block text-xs text-gray-500">
                            Price
                          </span>

                          <strong className="block mt-1 text-sm">
                            {rfq.currency || "INR"} {q.price}
                          </strong>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                          <span className="block text-xs text-gray-500">
                            Delivery
                          </span>

                          <strong className="block mt-1 text-sm break-words">
                            {q.estimatedDeliveryTime || "—"}
                          </strong>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <span className="block text-xs text-gray-500 mb-1">
                          Message
                        </span>

                        <p className="text-sm break-words leading-relaxed">
                          {q.message || "—"}
                        </p>
                      </div>

                      {/* Chat */}
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() =>
                          openChat(q.supplierId)
                        }
                        loading={
                          chatLoading ===
                          Number(q.supplierId)
                        }
                      >
                        <FiMessageCircle />
                        Chat with supplier
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* =========================================================
          BACK BUTTON
      ========================================================= */}
      <div className="mt-5 sm:mt-6">
        <Link
          className="btn btn-secondary inline-flex w-full sm:w-auto justify-center"
          to="/rfqs"
        >
          <FiArrowLeft />
          Back to RFQs
        </Link>
      </div>
    </div>
  );
}

/* ===============================================================
   RESPONSIVE DETAIL ITEM
=============================================================== */

function DetailItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border bg-gray-50/70 p-4 min-w-0">
      <div className="flex items-start gap-3">

        <div className="w-9 h-9 rounded-lg bg-white border flex items-center justify-center text-gray-600 flex-shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <span className="block text-xs sm:text-sm text-gray-500">
            {label}
          </span>

          <strong className="block mt-1 text-sm sm:text-base break-words">
            {value}
          </strong>
        </div>
      </div>
    </div>
  );
}