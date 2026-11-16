"use client";

import { useActionState } from "react";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { submitApplication, submitLead, type FormState } from "@/app/actions";

const initial: FormState = { ok: false, message: "" };

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} className="mt-1.5 text-sm text-red-700">{msg}</p> : null;
}

function Honeypot() {
  return (
    <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Success({ message }: { message: string }) {
  return (
    <div role="status" className="flex items-start gap-4 rounded-2xl border border-brand/30 bg-brand/[0.07] p-6">
      <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
      <div>
        <p className="font-display text-lg font-semibold text-ink">Received</p>
        <p className="mt-1 text-slate">{message}</p>
      </div>
    </div>
  );
}

function Problem({ state }: { state: FormState }) {
  if (state.ok || !state.message) return null;
  return (
    <p role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" /> {state.message}
    </p>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="btn-dark w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? "Sending" : children}
    </button>
  );
}

export function LeadForm({ interests, source = "contact" }: { interests: string[]; source?: string }) {
  const [state, action, pending] = useActionState(submitLead, initial);
  if (state.ok) return <Success message={state.message} />;
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="lead-name">Name</label>
          <input id="lead-name" name="name" defaultValue={v.name} className="field" autoComplete="name" required aria-invalid={!!e.name} aria-describedby="lead-name-err" />
          <Err id="lead-name-err" msg={e.name} />
        </div>
        <div>
          <label className="label" htmlFor="lead-email">Work email</label>
          <input id="lead-email" name="email" defaultValue={v.email} type="email" className="field" autoComplete="email" required aria-invalid={!!e.email} aria-describedby="lead-email-err" />
          <Err id="lead-email-err" msg={e.email} />
        </div>
        <div>
          <label className="label" htmlFor="lead-company">Company</label>
          <input id="lead-company" name="company" defaultValue={v.company} className="field" autoComplete="organization" />
        </div>
        <div>
          <label className="label" htmlFor="lead-phone">Phone <span className="font-normal text-slate">(optional)</span></label>
          <input id="lead-phone" name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="lead-interest">What can we help with?</label>
        <select id="lead-interest" name="interest" className="field" defaultValue={v.interest ?? ""} key={v.interest ?? "none"}>
          <option value="">Select a topic</option>
          {interests.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="lead-message">Tell us about the problem</label>
        <textarea id="lead-message" name="message" defaultValue={v.message} rows={5} className="field resize-y" required aria-invalid={!!e.message} aria-describedby="lead-message-err" placeholder="The process, the systems involved and what is not working today." />
        <Err id="lead-message-err" msg={e.message} />
      </div>
      <Problem state={state} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Submit pending={pending}>Send message</Submit>
        <p className="text-xs text-slate">We use your details only to reply to this enquiry.</p>
      </div>
    </form>
  );
}

export function ApplyForm({ jobId, jobTitle }: { jobId?: string; jobTitle: string }) {
  const [state, action, pending] = useActionState(submitApplication, initial);
  if (state.ok) return <Success message={state.message} />;
  const e = state.errors ?? {};
  const v = state.values ?? {};
  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      {jobId ? <input type="hidden" name="jobId" value={jobId} /> : null}
      <p className="text-sm text-slate">Applying for <span className="font-semibold text-ink">{jobTitle}</span></p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="app-name">Full name</label>
          <input id="app-name" name="name" defaultValue={v.name} className="field" autoComplete="name" required aria-invalid={!!e.name} aria-describedby="app-name-err" />
          <Err id="app-name-err" msg={e.name} />
        </div>
        <div>
          <label className="label" htmlFor="app-email">Email</label>
          <input id="app-email" name="email" defaultValue={v.email} type="email" className="field" autoComplete="email" required aria-invalid={!!e.email} aria-describedby="app-email-err" />
          <Err id="app-email-err" msg={e.email} />
        </div>
        <div>
          <label className="label" htmlFor="app-phone">Phone</label>
          <input id="app-phone" name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" required aria-invalid={!!e.phone} aria-describedby="app-phone-err" />
          <Err id="app-phone-err" msg={e.phone} />
        </div>
        <div>
          <label className="label" htmlFor="app-linkedin">LinkedIn profile <span className="font-normal text-slate">(optional)</span></label>
          <input id="app-linkedin" name="linkedin" defaultValue={v.linkedin} type="url" className="field" placeholder="https://www.linkedin.com/in/" aria-invalid={!!e.linkedin} aria-describedby="app-linkedin-err" />
          <Err id="app-linkedin-err" msg={e.linkedin} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="app-cv">CV <span className="font-normal text-slate">(PDF, DOC or DOCX, up to 5 MB)</span></label>
        <input
          id="app-cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          aria-invalid={!!e.cv}
          aria-describedby="app-cv-err"
          className="field cursor-pointer !py-2.5 file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white"
        />
        <Err id="app-cv-err" msg={e.cv} />
      </div>
      <div>
        <label className="label" htmlFor="app-note">Anything you would like us to know <span className="font-normal text-slate">(optional)</span></label>
        <textarea id="app-note" name="note" defaultValue={v.note} rows={4} className="field resize-y" />
      </div>
      <Problem state={state} />
      <Submit pending={pending}>Submit application</Submit>
    </form>
  );
}
