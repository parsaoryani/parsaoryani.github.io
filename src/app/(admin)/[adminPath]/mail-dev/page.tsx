import { getDevMailLog } from "@/lib/email"

export const dynamic = "force-dynamic"

export default async function DevMailPage() {
  const entries = await getDevMailLog()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Mail Dev Log</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6 font-mono">
        Emails captured locally when <code>RESEND_API_KEY</code> is not set.
        {entries.length > 0 && <span> Showing last {entries.length}.</span>}
      </p>

      {entries.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--border)]">
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No captured emails yet.</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            Submit the contact form on the public site — emails will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <div key={entry.timestamp || i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-base)]">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${entry.type === "notification" ? "bg-cyan/10 text-cyan" : "bg-emerald/10 text-emerald"}`}>
                  {entry.type}
                </span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">→ {entry.to}</span>
                <span className="text-[10px] font-mono text-[var(--text-tertiary)] ml-auto">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="px-4 py-3 space-y-1">
                <p className="text-sm"><span className="text-[var(--text-secondary)]">From:</span> {entry.name} &lt;{entry.email}&gt;</p>
                {entry.subject && <p className="text-sm"><span className="text-[var(--text-secondary)]">Subject:</span> {entry.subject}</p>}
                {entry.body && (
                  <div className="mt-2 p-3 rounded-lg bg-[var(--bg-base)] text-sm text-[var(--text-secondary)] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {entry.body}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
