import React from "react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="page w-full max-w-5xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="min-w-0">
          <span className="eyebrow">ACCOUNT</span>

          <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
            Profile
          </h1>

          <p className="muted mt-1 text-sm sm:text-base">
            Your marketplace account information.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Profile Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-4 sm:p-6 border-b">
          {/* Avatar */}
          <div
            className="
              flex-shrink-0
              w-16 h-16
              sm:w-20 sm:h-20
              rounded-2xl
              flex items-center justify-center
              text-xl sm:text-2xl
              font-bold
              bg-slate-900
              text-white
              shadow-md
            "
          >
            {initial}
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold break-words">
              {user?.name || "User"}
            </h2>

            <p className="text-sm sm:text-base text-gray-500 mt-1 break-all">
              {user?.email || "—"}
            </p>

            <div className="mt-3">
              <Badge tone="success">
                {user?.role || "USER"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Account information
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Basic information associated with your marketplace account.
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Name */}
            <ProfileItem
              label="Name"
              value={user?.name || "—"}
            />

            {/* Email */}
            <ProfileItem
              label="Email"
              value={user?.email || "—"}
              breakAll
            />

            {/* Role */}
            <ProfileItem
              label="Role"
              value={user?.role || "—"}
            />

            {/* Verification */}
            <div className="rounded-xl border bg-gray-50/70 p-4 min-w-0">
              <span className="block text-xs sm:text-sm text-gray-500 mb-2">
                Verification
              </span>

              <Badge tone="success">
                {user?.isEmailVerified === false
                  ? "Not verified"
                  : "Verified"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="rounded-xl border p-4 bg-gray-50/50">
            <div className="flex flex-col xs:flex-row gap-3 xs:items-center">
              <div
                className="
                  w-10 h-10
                  rounded-full
                  flex items-center justify-center
                  bg-green-100
                  text-green-600
                  font-bold
                  flex-shrink-0
                "
              >
                ✓
              </div>

              <div className="min-w-0">
                <strong className="block text-sm sm:text-base">
                  Account active
                </strong>

                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Your {user?.role?.toLowerCase() || "user"} workspace is
                  currently active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* Reusable profile field */
function ProfileItem({ label, value, breakAll = false }) {
  return (
    <div className="rounded-xl border bg-gray-50/70 p-4 min-w-0">
      <span className="block text-xs sm:text-sm text-gray-500 mb-1">
        {label}
      </span>

      <strong
        className={`block text-sm sm:text-base ${
          breakAll ? "break-all" : "break-words"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}