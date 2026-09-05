/**
 * Simple long-form text wrapper for legal / content pages.
 */
export function Prose({ title, updated, children }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] px-5 py-10 sm:max-w-2xl sm:px-8 sm:py-14">
      <h1 className="text-[28px] text-ink-bright sm:text-[36px]">{title}</h1>
      {updated ? (
        <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.14em] text-ink-4">
          Last updated {updated}
        </p>
      ) : null}
      <div className="prose-body mt-6 flex flex-col gap-4 text-[14.5px] leading-relaxed text-ink-2 sm:mt-8 sm:text-[15.5px]">
        {children}
      </div>
    </div>
  )
}
