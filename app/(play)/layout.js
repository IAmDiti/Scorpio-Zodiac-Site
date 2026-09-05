// Chrome-less group for the quiz flow. The taker is a focused, full-screen
// experience; the result pages add their own slim header/footer.
export default function PlayLayout({ children }) {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      {children}
    </main>
  )
}
