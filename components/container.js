// One responsive content column used across the site.
//   narrow — auth / focused flows
//   prose  — reading pages (horoscope, a single report, legal)
//   wide   — landing + grid pages (home, catalogs, results)

const WIDTHS = {
  narrow: 'max-w-[26rem]',
  prose: 'max-w-[26rem] sm:max-w-2xl',
  wide: 'max-w-[26rem] sm:max-w-3xl lg:max-w-5xl',
}

export function Container({ size = 'wide', as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`mx-auto w-full px-5 sm:px-8 ${WIDTHS[size]} ${className}`}>{children}</Tag>
  )
}
