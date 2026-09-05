'use client'

import { useFormStatus } from 'react-dom'
import { signInWithGoogle } from '@/app/(auth)/actions'
import { IconGoogle } from '@/components/icons'

function Button() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full bg-white font-ui text-[13.5px] font-bold text-[#1a1a1a] transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <IconGoogle className="h-[17px] w-[17px]" />
      {pending ? 'Connecting…' : 'Continue with Google'}
    </button>
  )
}

export function OAuthButton({ next }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next || '/account'} />
      <Button />
    </form>
  )
}
