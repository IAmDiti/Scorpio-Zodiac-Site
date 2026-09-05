// Chrome-less group for the quiz flow. The taker is a focused, full-screen
// experience; the result pages add their own slim header/footer.
export default function PlayLayout({ children }) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}
