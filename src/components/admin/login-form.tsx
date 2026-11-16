"use client";

import { useActionState } from "react";
import { changePassword, login, type AdminFormState } from "@/app/admin/actions";

const initial: AdminFormState = { message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className="field" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="btn-dark w-full disabled:opacity-60">
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  const ok = state.message === "Password updated.";
  return (
    <form action={action} className="max-w-md space-y-4" key={ok ? "done" : "form"}>
      <div>
        <label className="label" htmlFor="current">Current password</label>
        <input id="current" name="current" type="password" autoComplete="current-password" required className="field" />
      </div>
      <div>
        <label className="label" htmlFor="next">New password</label>
        <input id="next" name="next" type="password" autoComplete="new-password" required minLength={12} className="field" />
        <p className="mt-1 text-xs text-slate">At least 12 characters.</p>
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className="field" />
      </div>
      {state.message ? (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${ok ? "bg-brand/10 text-brand-600" : "bg-red-50 text-red-800"}`}>{state.message}</p>
      ) : null}
      <button type="submit" disabled={pending} className="btn-dark disabled:opacity-60">Update password</button>
    </form>
  );
}
