import { SIGNS } from '@/lib/astro/zodiac'
import { fieldClass } from '@/components/auth-fields'

export function SignSelect({ id = 'partner_sign', name = 'partner_sign', defaultValue = '' }) {
  return (
    <select id={id} name={name} defaultValue={defaultValue} className={fieldClass}>
      <option value="">Not sure / prefer not to say</option>
      {SIGNS.map((s) => (
        <option key={s.key} value={s.key}>
          {s.name}
        </option>
      ))}
    </select>
  )
}
