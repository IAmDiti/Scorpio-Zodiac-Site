// House style for AI-generated copy on the site.
//
// The owner does not want em dashes, en dashes, or a hyphen fenced by spaces
// (the "word — word" pattern) anywhere in reader-facing text. The prompts ask
// the model to avoid them; this is the safety net that catches the stragglers
// before a row is stored.

export function tidyProse(s) {
  return String(s ?? '')
    .replace(/\s*[—–]\s*/g, ', ') // em / en dash, with or without surrounding space
    .replace(/(\w)\s*-\s+(\w)/g, '$1, $2') // hyphen used as a dash: "a slow start - then focus"
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/,\s*([,.;:])/g, '$1') // clean up a comma that now sits next to other punctuation
    .trim()
}

/** Like tidyProse, but also strips trailing sentence punctuation (for headlines). */
export function tidyHeadline(s) {
  return tidyProse(s).replace(/[.,!?;:]+$/, '')
}
