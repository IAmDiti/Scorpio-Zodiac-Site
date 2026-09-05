/** Renders a JSON-LD <script> for structured data. */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // Data is built from our own constants, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
