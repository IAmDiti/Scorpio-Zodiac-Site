export default {
  slug: 'what-kind-of-scorpio-are-you',
  title: 'What kind of Scorpio are you?',
  description: 'Mystic, Detective, Phoenix or Sting? Six questions decide.',
  category: 'Personality',
  minutes: 2,
  cover: { from: '#3a1030', to: '#221338' },
  image: '/quiz/what-kind-of-scorpio-are-you.svg',
  scoring: 'tally',
  order: 1,

  questions: [
    {
      q: 'Someone betrays your trust. Your first real move is —',
      options: [
        { label: 'Cut them off cleanly. No speech, no closure.', scores: { sting: 2, phoenix: 1 } },
        {
          label: 'Watch. Learn exactly who they are. Decide later.',
          scores: { detective: 2, mystic: 1 },
        },
        { label: 'Feel it all the way down, then rebuild without them.', scores: { phoenix: 2 } },
        { label: 'Say nothing and let them wonder.', scores: { mystic: 2, sting: 1 } },
      ],
    },
    {
      q: 'At a party where you know no one, you —',
      options: [
        { label: 'Find the one interesting person and go deep.', scores: { mystic: 2 } },
        { label: 'Read the room for ten minutes before you move.', scores: { detective: 2 } },
        { label: 'Leave. You came, you saw, you’re done.', scores: { sting: 2 } },
        { label: 'End up somewhere unexpected by 1am.', scores: { phoenix: 2, mystic: 1 } },
      ],
    },
    {
      q: 'Your friends would say your superpower is —',
      options: [
        { label: 'Knowing what people aren’t saying.', scores: { detective: 2, mystic: 1 } },
        { label: 'Coming back from things that should have ended you.', scores: { phoenix: 2 } },
        { label: 'Making people feel truly seen.', scores: { mystic: 2 } },
        { label: 'A perfectly timed, devastating one-liner.', scores: { sting: 2 } },
      ],
    },
    {
      q: 'How do you handle your own feelings?',
      options: [
        {
          label: 'Process them alone, thoroughly, then move on.',
          scores: { phoenix: 2, detective: 1 },
        },
        { label: 'Keep them behind glass. Very few get to look.', scores: { mystic: 2 } },
        { label: 'Track them like evidence. Patterns matter.', scores: { detective: 2 } },
        { label: 'Convert them into resolve.', scores: { sting: 2, phoenix: 1 } },
      ],
    },
    {
      q: 'Pick the compliment that would actually land —',
      options: [
        { label: '“You always know before anyone tells you.”', scores: { detective: 2 } },
        { label: '“You’re the strongest person I know.”', scores: { phoenix: 2 } },
        { label: '“There’s so much more to you than people realise.”', scores: { mystic: 2 } },
        { label: '“Nobody messes with you twice.”', scores: { sting: 2 } },
      ],
    },
    {
      q: 'Your relationship with secrets is —',
      options: [
        { label: 'I keep everyone’s. Vault. Forever.', scores: { mystic: 2, detective: 1 } },
        { label: 'I’ll find out yours eventually.', scores: { detective: 2 } },
        { label: 'Mine kept me alive once. I don’t apologise for them.', scores: { phoenix: 2 } },
        { label: 'I use what I know, carefully.', scores: { sting: 2 } },
      ],
    },
  ],

  results: {
    mystic: {
      title: 'The Mystic Scorpio',
      blurb:
        'You lead with instinct, not evidence. People tell you things they have never said out loud because some part of them knows you already sensed it. Your gift is depth; your work is not disappearing into it.',
      traits: ['Reads energy before words', 'Private by design', 'Draws out other people’s truths'],
      matches: 'Pisces, Cancer, Capricorn',
      shareLine: 'I’m the Mystic Scorpio — I knew before you told me.',
    },
    detective: {
      title: 'The Detective Scorpio',
      blurb:
        'You notice the thing that doesn’t add up and you cannot let it go. Trust, for you, is a conclusion you reach after the evidence — which is exactly why the people who earn it never lose it.',
      traits: ['Pattern-obsessed', 'Impossible to lie to', 'Loyal once convinced'],
      matches: 'Virgo, Capricorn, Cancer',
      shareLine: 'I’m the Detective Scorpio — I already checked.',
    },
    phoenix: {
      title: 'The Phoenix Scorpio',
      blurb:
        'You have been through the version of things that ends people, and you’re still here — different, sharper, and strangely grateful. Reinvention isn’t a phase for you, it’s a reflex.',
      traits: ['Rebuilds from ashes', 'Unshockable', 'Powerful in a crisis'],
      matches: 'Pisces, Taurus, Cancer',
      shareLine: 'I’m the Phoenix Scorpio — burn it down, I’ll be fine.',
    },
    sting: {
      title: 'The Sting Scorpio',
      blurb:
        'You are the reason people choose their words carefully. Boundaries aren’t a conversation for you, they’re a fact. Cross one and you’ll find out how quiet a Scorpio can get.',
      traits: ['Zero tolerance for games', 'Precise and unbothered', 'Fiercely self-protective'],
      matches: 'Capricorn, Virgo, Pisces',
      shareLine: 'I’m the Sting Scorpio — you get one warning.',
    },
  },
}
