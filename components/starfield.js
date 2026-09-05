/**
 * Fixed, non-interactive cosmic background. Sits behind all page content.
 */
export function Starfield() {
  return <div aria-hidden className="starfield pointer-events-none fixed inset-0 -z-10" />
}
