export default {
  slug: 'scorpio-love-language',
  title: 'Your Scorpio love language',
  description: 'How you actually show you care — and what you need back.',
  category: 'Love',
  minutes: 3,
  cover: { from: '#1c1140', to: '#3a1030' },
  scoring: 'tally',
  order: 2,

  questions: [
    {
      q: 'A partner has a hard week. You —',
      options: [
        { label: 'Sit with them at 2am until they actually talk.', scores: { depth: 2 } },
        { label: 'Quietly handle three things off their list.', scores: { proof: 2 } },
        { label: 'Cancel everything and just be there.', scores: { presence: 2 } },
        { label: 'Go after whatever caused it.', scores: { protection: 2 } },
      ],
    },
    {
      q: 'You feel most loved when someone —',
      options: [
        { label: 'Tells you the thing they’ve never told anyone.', scores: { depth: 2 } },
        { label: 'Remembers the small, specific stuff.', scores: { proof: 2 } },
        { label: 'Chooses you, out loud, in front of people.', scores: { protection: 2 } },
        { label: 'Just wants to be in the same room, no agenda.', scores: { presence: 2 } },
      ],
    },
    {
      q: 'Your idea of a perfect date is —',
      options: [
        { label: 'A long walk and a conversation that goes somewhere real.', scores: { depth: 2 } },
        { label: 'Them cooking the meal you mentioned wanting once.', scores: { proof: 2 } },
        { label: 'Nothing planned. Whole day, no phones.', scores: { presence: 2 } },
        {
          label: 'Somewhere new where it’s clearly you two against the world.',
          scores: { protection: 2 },
        },
      ],
    },
    {
      q: 'When you’re upset with someone you love, you —',
      options: [
        { label: 'Need to understand exactly why before you can move on.', scores: { depth: 2 } },
        { label: 'Withdraw the effort until they notice.', scores: { proof: 1, protection: 1 } },
        { label: 'Want them close even while you’re angry.', scores: { presence: 2 } },
        { label: 'Get very calm and very clear about the line.', scores: { protection: 2 } },
      ],
    },
    {
      q: 'The fastest way to lose you is —',
      options: [
        { label: 'Keeping things surface-level forever.', scores: { depth: 2 } },
        { label: 'Never reciprocating the effort you put in.', scores: { proof: 2 } },
        { label: 'Being unreachable when it counts.', scores: { presence: 2 } },
        { label: 'Making you doubt whose side they’re on.', scores: { protection: 2 } },
      ],
    },
    {
      q: 'You’d describe your loyalty as —',
      options: [
        {
          label: 'Total, once someone lets me all the way in.',
          scores: { depth: 2, protection: 1 },
        },
        { label: 'Shown, not announced.', scores: { proof: 2 } },
        { label: 'A standing offer to always show up.', scores: { presence: 2 } },
        { label: 'A shield. I will stand between you and it.', scores: { protection: 2 } },
      ],
    },
  ],

  results: {
    depth: {
      title: 'Radical honesty',
      blurb:
        'You love by going where other people won’t — the real fear, the real history, the thing under the thing. Small talk with someone you love feels like starvation. Give them a map to your depth, not just a locked door.',
      traits: [
        'Craves total transparency',
        '2am conversations are sacred',
        'Bored by anything shallow',
      ],
      shareLine: 'My Scorpio love language is radical honesty — tell me the real thing.',
    },
    proof: {
      title: 'Show, don’t tell',
      blurb:
        'Anyone can say it. You watch what people do — the remembered detail, the quiet favour, the effort that matches yours. Words are cheap to you, and you withdraw fast when the actions stop.',
      traits: [
        'Keeps a mental ledger of effort',
        'Remembers everything',
        'Distrusts easy declarations',
      ],
      shareLine: 'My Scorpio love language is show, don’t tell.',
    },
    presence: {
      title: 'Just be here',
      blurb:
        'Your love is a room you keep for one person. No performance, no plan — the point is that they’re in it. Distance when it matters is the one thing you can’t forgive.',
      traits: [
        'Needs undivided attention',
        'Hates being managed from a distance',
        'Devoted in the ordinary hours',
      ],
      shareLine: 'My Scorpio love language is just be here — no phones, no agenda.',
    },
    protection: {
      title: 'You and me against it',
      blurb:
        'You love like an alliance. Choose you publicly, stand on your side in the room, and you have a person who will go to war for them. Make them doubt whose team you’re on and it’s over.',
      traits: ['Fiercely protective', 'Loyalty is non-negotiable', 'Needs to feel chosen out loud'],
      shareLine: 'My Scorpio love language is you and me against the world.',
    },
  },
}
