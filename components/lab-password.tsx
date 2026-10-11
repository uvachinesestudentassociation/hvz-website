"use client"

import { FormEvent, useState } from "react"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT } from "@/components/hvz/pixel-styles"

export function LabPassword() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError("")
    const response = await fetch("/api/exec-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, forLab: true }),
    })
    const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (data?.ok) {
      window.location.assign("/lab")
      return
    }
    setPending(false)
    setError(data?.error === "not_configured" ? "The office lock is not set up." : "That code does not open the office.")
  }

  return (
    <main className={`mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 ${PIXEL_TEXT}`}>
      <form
        onSubmit={onSubmit}
        className={`border-4 p-6 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE}`}
      >
        <h1 className="font-mono text-lg font-bold uppercase tracking-wide">Security office</h1>
        <p className="mt-2 font-mono text-sm">Enter the exec preview code to open the lab.</p>
        <label className="mt-4 block font-mono text-xs font-bold uppercase" htmlFor="lab-code">
          Code
        </label>
        <input
          id="lab-code"
          type="password"
          autoComplete="current-password"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="mt-1 w-full border-4 border-current bg-transparent px-3 py-2 font-mono"
          required
        />
        {error ? <p className="mt-3 font-mono text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-4 border-4 border-current px-4 py-2 font-mono text-sm font-bold uppercase"
        >
          {pending ? "Checking" : "Unlock"}
        </button>
      </form>
    </main>
  )
}
