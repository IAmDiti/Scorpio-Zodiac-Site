export default {
  slug: 'how-intense-is-your-scorpio-energy',
  title: 'How intense is your Scorpio energy?',
  description: 'Still waters, or a volcano with a calendar? Find out.',
  category: 'Personality',
  minutes: 2,
  cover: { from: '#3a1030', to: '#10243a' },
  image: '/quiz/how-intense-is-your-scorpio-energy.svg',
  scoring: 'scale',
  order: 4,

  questions: [
    {
      q: 'Someone asks what you’re thinking. You usually —',
      options: [
        { label: 'Tell them, roughly.', points: 0 },
        { label: 'Give an edited version.', points: 2 },
        { label: 'Say “nothing” and mean the opposite.', points: 3 },
      ],
    },
    {
      q: 'A friend wrongs you. Six months later you —',
      options: [
        { label: 'Genuinely can’t remember the details.', points: 0 },
        { label: 'Remember, but you’re past it.', points: 2 },
        { label: 'Could recite it. With timestamps.', points: 4 },
      ],
    },
    {
      q: 'Your reaction to being told “you’re intense” —',
      options: [
        { label: 'Fair, I’ll dial it back.', points: 0 },
        { label: 'A small, private thrill.', points: 3 },
        { label: '“You have no idea.”', points: 4 },
      ],
    },
    {
      q: 'When you want something, you —',
      options: [
        { label: 'Hope it works out.', points: 0 },
        { label: 'Make a quiet, patient plan.', points: 2 },
        { label: 'Become slightly frightening about it.', points: 4 },
      ],
    },
    {
      q: 'How many people know the real you?',
      options: [
        { label: 'Most people I’m close to.', points: 0 },
        { label: 'Two or three.', points: 2 },
        { label: 'One. Maybe.', points: 4 },
      ],
    },
    {
      q: 'Your feelings, on a normal Tuesday, are —',
      options: [
        { label: 'Pretty level.', points: 0 },
        { label: 'Running deeper than my face shows.', points: 3 },
        { label: 'A whole weather system I’m managing alone.', points: 4 },
      ],
    },
    {
      q: 'Loyalty, to you, is —',
      options: [
        { label: 'Important, like to most people.', points: 1 },
        { label: 'Close to sacred.', points: 3 },
        { label: 'The entire basis of whether you exist to me.', points: 4 },
      ],
    },
  ],

  bands: [
    { key: 'still-waters', max: 7 },
    { key: 'deep-current', max: 17 },
    { key: 'volcanic', max: 999 },
  ],

  results: {
    'still-waters': {
      title: 'Still waters',
      blurb:
        'You’ve got the Scorpio depth without the drama — you feel things fully but you don’t make everyone else carry them. People trust you with the heavy stuff precisely because you stay calm. The most quietly powerful kind of Scorpio.',
      traits: ['Deep but regulated', 'Safe to confide in', 'Underestimated on purpose'],
      shareLine: 'My Scorpio energy runs still and deep — no drama, all depth.',
    },
    'deep-current': {
      title: 'Deep current',
      blurb:
        'Textbook Scorpio. Composed on the surface, a strong pull underneath. You keep most of yourself back, remember more than you let on, and go all-in on the few people who make the cut. Intense in the way people find magnetic.',
      traits: ['Composed exterior, strong undertow', 'Selective and loyal', 'Long memory'],
      shareLine: 'My Scorpio energy is a deep current — calm on top, pulling underneath.',
    },
    volcanic: {
      title: 'Volcanic',
      blurb:
        'Maximum Scorpio. You feel everything at full volume, forget nothing, and want things with an intensity that scares people (a little bit on purpose). It’s a lot to carry. The work of your life is aiming it, not muting it.',
      traits: ['Everything at full volume', 'Forgets nothing', 'All-or-nothing, always'],
      shareLine: 'My Scorpio energy is volcanic — I did warn you.',
    },
  },
}
