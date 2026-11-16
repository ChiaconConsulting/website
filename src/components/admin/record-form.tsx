"use client";

/* eslint-disable @next/next/no-img-element */
import { startTransition, useActionState, useState } from "react";
import { deleteRecord, saveRecord, type AdminFormState } from "@/app/admin/actions";
import type { Field } from "@/lib/admin/resources";

const initial: AdminFormState = { message: "" };

export function RecordForm({
  resourceKey,
  id,
  fields,
  values,
  imageUrl,
}: {
  resourceKey: string;
  id: string | null;
  fields: Field[];
  values: Record<string, string | boolean | number>;
  imageUrl?: string;
}) {
  const [state, action, pending] = useActionState(saveRecord.bind(null, resourceKey, id), initial);
  const [confirming, setConfirming] = useState(false);
  const errors = state.errors ?? {};

  return (
    <>
      <form
        action={action}
        // Submit manually so a failed save does not reset the form and lose unsaved edits.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => action(data));
        }}
        className="card mt-6 space-y-6 p-6 sm:p-8"
      >
        {fields.map((f) => {
          const value = values[f.name];
          const inputId = `f-${f.name}`;
          const help = f.help ? <p className="mt-1.5 text-xs leading-relaxed text-slate">{f.help}</p> : null;
          const error = errors[f.name] ? <p className="mt-1.5 text-sm text-red-700">{errors[f.name]}</p> : null;

          if (f.type === "bool") {
            return (
              <label key={f.name} className="flex items-center gap-3 text-sm font-medium text-ink">
                <input type="checkbox" name={f.name} defaultChecked={Boolean(value)} className="h-5 w-5 rounded border-line accent-[#0c4885]" />
                {f.label}
              </label>
            );
          }

          return (
            <div key={f.name}>
              <label className="label" htmlFor={inputId}>
                {f.label}
                {f.required ? <span className="text-red-700" aria-hidden="true"> *</span> : null}
              </label>
              {f.type === "textarea" || f.type === "markdown" || f.type === "list" ? (
                <textarea
                  id={inputId}
                  name={f.name}
                  rows={f.rows ?? (f.type === "list" ? 5 : 6)}
                  defaultValue={String(value ?? "")}
                  required={f.required}
                  className={`field resize-y ${f.type === "markdown" ? "font-mono text-[0.85rem] leading-relaxed" : ""}`}
                />
              ) : f.type === "select" ? (
                <select id={inputId} name={f.name} defaultValue={String(value ?? f.options?.[0] ?? "")} className="field">
                  {f.options?.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "image" ? (
                <div className="space-y-3">
                  {value ? (
                    <div className="flex items-center gap-4">
                      {imageUrl ? <img src={imageUrl} alt="Current logo" className="h-12 w-auto rounded border border-line bg-white p-1.5" /> : <span className="chip">Logo uploaded</span>}
                      <label className="flex items-center gap-2 text-sm text-slate">
                        <input type="checkbox" name={`${f.name}__remove`} className="h-4 w-4 accent-[#0c4885]" /> Remove
                      </label>
                    </div>
                  ) : null}
                  <input id={inputId} name={f.name} type="file" accept="image/png,image/jpeg,image/webp" className="field cursor-pointer !py-2.5 file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white" />
                </div>
              ) : (
                <input
                  id={inputId}
                  name={f.name}
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  defaultValue={String(value ?? (f.type === "number" ? 0 : ""))}
                  required={f.required}
                  className="field"
                />
              )}
              {f.type === "markdown" ? (
                <p className="mt-1.5 text-xs text-slate">
                  Formatting: <code>## Heading</code>, <code>**bold**</code>, <code>- bullet</code>, <code>[link text](https://...)</code>. Leave a blank line between paragraphs.
                </p>
              ) : null}
              {help}
              {error}
            </div>
          );
        })}

        {state.message ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</p> : null}

        <div className="flex items-center gap-3 border-t border-line pt-6">
          <button type="submit" disabled={pending} className="btn-dark disabled:opacity-60">{pending ? "Saving" : "Save"}</button>
          <a href={`/admin/${resourceKey}`} className="btn-outline">Cancel</a>
        </div>
      </form>

      {id ? (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-white px-6 py-4">
          <p className="text-sm text-slate">Delete this item permanently.</p>
          {confirming ? (
            <form action={deleteRecord.bind(null, resourceKey, id)} className="flex items-center gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="btn-outline !py-2">Keep</button>
              <button type="submit" className="btn !py-2 bg-red-700 text-white hover:bg-red-800">Yes, delete</button>
            </form>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="btn !py-2 border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
          )}
        </div>
      ) : null}
    </>
  );
}
