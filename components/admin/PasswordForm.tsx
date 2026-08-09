"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INPUT =
  "rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition w-full";

const MIN_LENGTH = 10;

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const tooShort = password.length > 0 && password.length < MIN_LENGTH;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit =
    password.length >= MIN_LENGTH && password === confirm && !saving;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setErrorMsg("");
    setSaved(false);

    const { error } = await supabase.auth.updateUser({ password });

    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setPassword("");
    setConfirm("");
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 max-w-2xl"
    >
      <h2 className="font-semibold text-navy text-base border-b border-gray-100 pb-3">
        Admin Password
      </h2>

      <p className="text-xs text-muted">
        This login is shared by the board. Change it whenever someone leaves —
        that is the only way to revoke their access.
      </p>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="new-password"
          className="text-xs font-semibold uppercase tracking-widest text-navy"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setSaved(false);
            setErrorMsg("");
          }}
          className={INPUT}
        />
        <span
          className={`text-xs ${tooShort ? "text-red-600" : "text-muted"}`}
        >
          At least {MIN_LENGTH} characters.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirm-password"
          className="text-xs font-semibold uppercase tracking-widest text-navy"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setSaved(false);
            setErrorMsg("");
          }}
          className={INPUT}
        />
        {mismatch && (
          <span className="text-xs text-red-600">
            Passwords don&apos;t match.
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-8 py-3 rounded-full bg-navy text-white font-semibold text-sm hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Updating…" : "Change Password"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            ✓ Password updated
          </span>
        )}
        {errorMsg && (
          <span className="text-sm text-red-600 font-medium">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}
