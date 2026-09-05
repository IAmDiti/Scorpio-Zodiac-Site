export default {
  slug: 'are-you-a-textbook-scorpio',
  title: 'Are you a textbook Scorpio?',
  description: 'Ten questions against the stereotype. No pressure.',
  category: 'Personality',
  minutes: 4,
  cover: { from: '#3a1030', to: '#1c1140' },
  scoring: 'scale',
  order: 6,

  questions: [
    {
      q: '“I would rather know a painful truth than a comfortable lie.”',
      options: [
        { label: 'Not really.', points: 0 },
        { label: 'Mostly.', points: 2 },
        { label: 'Every single time.', points: 4 },
      ],
    },
    {
      q: '“I can tell when someone is lying to me.”',
      options: [
        { label: 'Not especially.', points: 0 },
        { label: 'Usually.', points: 2 },
        { label: 'Almost always, and it’s exhausting.', points: 4 },
      ],
    },
    {
      q: '“I keep my true feelings to myself until I trust someone completely.”',
      options: [
        { label: 'I’m fairly open.', points: 0 },
        { label: 'It takes a while.', points: 3 },
        { label: 'Completely, and even then, carefully.', points: 4 },
      ],
    },
    {
      q: '“I don’t do things halfway.”',
      options: [
        { label: 'Sometimes I do.', points: 0 },
        { label: 'Rarely.', points: 3 },
        { label: 'All in or not at all. Always.', points: 4 },
      ],
    },
    {
      q: '“I remember how people made me feel for years.”',
      options: [
        { label: 'I let things go.', points: 0 },
        { label: 'The big ones stick.', points: 2 },
        { label: 'All of them. Filed and dated.', points: 4 },
      ],
    },
    {
      q: '“I’m drawn to subjects other people find dark or taboo.”',
      options: [
        { label: 'Not really.', points: 0 },
        { label: 'A bit.', points: 2 },
        { label: 'That’s where all the interesting stuff is.', points: 4 },
      ],
    },
    {
      q: '“People describe me as intense or hard to read.”',
      options: [
        { label: 'Never heard that.', points: 0 },
        { label: 'Occasionally.', points: 3 },
        { label: 'Constantly. I’ve made peace with it.', points: 4 },
      ],
    },
    {
      q: '“My loyalty is total — but it can be lost permanently.”',
      options: [
        { label: 'I’m pretty forgiving.', points: 0 },
        { label: 'There are limits.', points: 2 },
        { label: 'One clean cut and it’s gone forever.', points: 4 },
      ],
    },
    {
      q: '“I’m comfortable being alone with my own thoughts.”',
      options: [
        { label: 'I prefer company.', points: 0 },
        { label: 'Depends on the day.', points: 2 },
        { label: 'It’s where I recharge.', points: 3 },
      ],
    },
    {
      q: '“When I want something, I become quietly relentless about it.”',
      options: [
        { label: 'I go with the flow.', points: 0 },
        { label: 'I’m fairly determined.', points: 2 },
        { label: 'Relentless is the word my friends use.', points: 4 },
      ],
    },
  ],

  bands: [
    { key: 'sun-sign-only', max: 14 },
    { key: 'textbook', max: 30 },
    { key: 'more-scorpio-than-scorpio', max: 999 },
  ],

  results: {
    'sun-sign-only': {
      title: 'Scorpio on paper',
      blurb:
        'Your birthday says Scorpio, but your wiring is softer around the edges — more forgiving, more open, less inclined to keep score. Other placements in your chart (Moon, Rising) are clearly doing some talking. Nothing wrong with a gentle Scorpio.',
      traits: [
        'Scorpio Sun, softer delivery',
        'More forgiving than the stereotype',
        'Probably a lighter Moon or Rising',
      ],
      shareLine: 'Turns out I’m a Scorpio on paper — the gentle edition.',
    },
    textbook: {
      title: 'Textbook Scorpio',
      blurb:
        'You could be the case study. Private, perceptive, loyal to a fault, allergic to shallow — you hit the core Scorpio notes without tipping into caricature. Intense where it counts, normal where it doesn’t.',
      traits: [
        'Hits every core Scorpio note',
        'Deep but functional',
        'Selective, loyal, unfoolable',
      ],
      shareLine: 'Confirmed: I’m a textbook Scorpio.',
    },
    'more-scorpio-than-scorpio': {
      title: 'More Scorpio than Scorpio',
      blurb:
        'The astrologers wrote the descriptions and then you walked in and raised the bar. All-or-nothing, forgets nothing, drawn straight to the shadows, relentless when it matters. There is almost certainly a stack of Scorpio placements behind this.',
      traits: [
        'Off the top of the scale',
        'Almost certainly a Scorpio stellium',
        'A lot, on purpose',
      ],
      shareLine: 'Apparently I’m more Scorpio than Scorpio. Checks out.',
    },
  },
}
