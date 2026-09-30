import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiMapPin,
  FiPackage,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";

import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import api, { getErrorMessage } from "../../lib/api.js";

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { notify } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    description: "",
    quantity: "",
    deliveryLocation: "",
    deadline: "",
    category: "",
    budget: "",
    currency: "INR",
  });

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.productName.trim()) {
      notify("Please enter a product or service name.", "error");
      return;
    }

    if (!form.description.trim()) {
      notify("Please provide a description.", "error");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      notify("Please enter a valid quantity.", "error");
      return;
    }

    if (!form.deliveryLocation.trim()) {
      notify("Please enter the delivery location.", "error");
      return;
    }

    if (!form.deadline) {
      notify("Please select a deadline.", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("/rfqs", {
        ...form,
        quantity: Number(form.quantity),
        budget: form.budget ? Number(form.budget) : undefined,
      });

      notify("RFQ published successfully.", "success");

      navigate("/rfqs", {
        replace: true,
      });
    } catch (error) {
      notify(
        getErrorMessage(error, "Failed to create RFQ"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/rfqs")}
          className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          <FiArrowLeft size={17} />
          Back to RFQs
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
              <FiFileText size={14} />
              Buyer Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Create RFQ
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Publish your procurement requirement and invite qualified
              suppliers to submit competitive quotations.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <FiCheckCircle size={15} />
            Ready to publish
          </div>
        </div>

        {/* Main Card */}
        <Card className="!overflow-hidden !rounded-2xl !border !border-slate-200 !bg-white !shadow-sm">

          {/* Card Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FiPackage size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Requirement details
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Provide accurate information so suppliers can submit relevant
                  quotations.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={submit}
            className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Product */}
              <div className="md:col-span-2">
                <Input
                  label="Product / service name"
                  value={form.productName}
                  onChange={(e) =>
                    update("productName", e.target.value)
                  }
                  placeholder="e.g. Industrial safety equipment"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </span>

                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      update("description", e.target.value)
                    }
                    placeholder="Describe your requirements, specifications, quality standards, packaging requirements, etc."
                    required
                    className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <span className="mt-1.5 block text-xs text-slate-400">
                    Include specifications that suppliers need to prepare an
                    accurate quotation.
                  </span>
                </label>
              </div>

              {/* Quantity */}
              <div>
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    update("quantity", e.target.value)
                  }
                  placeholder="100"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Input
                  label="Delivery location"
                  value={form.deliveryLocation}
                  onChange={(e) =>
                    update("deliveryLocation", e.target.value)
                  }
                  placeholder="Hyderabad, Telangana"
                  required
                />
              </div>

              {/* Deadline */}
              <div>
                <Input
                  label="Quotation deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    update("deadline", e.target.value)
                  }
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Input
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    update("category", e.target.value)
                  }
                  placeholder="Electronics, Industrial, IT..."
                />
              </div>

              {/* Budget */}
              <div>
                <Input
                  label="Budget"
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={(e) =>
                    update("budget", e.target.value)
                  }
                  placeholder="Optional"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Currency
                  </span>

                  <select
                    value={form.currency}
                    onChange={(e) =>
                      update("currency", e.target.value)
                    }
                    className="block h-[46px] w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="INR">INR — Indian Rupee</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-blue-600" size={17} />

                <h3 className="text-sm font-bold text-slate-800">
                  RFQ publishing checklist
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Clear product requirement
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Required quantity
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Delivery location
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Supplier deadline
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Category information
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Optional budget
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/rfqs")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                loading={loading}
                className="w-full sm:min-w-[170px] sm:w-auto"
              >
                Publish RFQ
              </Button>
            </div>
          </form>
        </Card>

        {/* Bottom information */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoItem
            icon={<FiPackage />}
            title="Structured RFQ"
            text="Keep requirements clear and measurable."
          />

          <InfoItem
            icon={<FiMapPin />}
            title="Delivery"
            text="Tell suppliers where the order is required."
          />

          <InfoItem
            icon={<FiDollarSign />}
            title="Commercial"
            text="Add a budget when you want to guide quotations."
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </span>

        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}