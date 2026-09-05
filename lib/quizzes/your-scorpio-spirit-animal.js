export default {
  slug: 'your-scorpio-spirit-animal',
  title: 'Your Scorpio spirit animal',
  description: 'Wolf, Serpent, Raven or Phoenix — which one moves like you?',
  category: 'Just fun',
  minutes: 2,
  cover: { from: '#241338', to: '#10243a' },
  scoring: 'tally',
  order: 5,

  questions: [
    {
      q: 'Your ideal role in a group is —',
      options: [
        { label: 'The one who protects the pack.', scores: { wolf: 2 } },
        {
          label: 'The one who sees the shift before it happens.',
          scores: { serpent: 2, raven: 1 },
        },
        { label: 'The one who says the true, unsayable thing.', scores: { raven: 2 } },
        { label: 'The one who’s survived the most and stayed kind.', scores: { phoenix: 2 } },
      ],
    },
    {
      q: 'You deal with a threat by —',
      options: [
        { label: 'Standing between it and the people you love.', scores: { wolf: 2 } },
        { label: 'Going still and waiting for the exact moment.', scores: { serpent: 2 } },
        { label: 'Naming it out loud so it loses its power.', scores: { raven: 2 } },
        { label: 'Letting it burn what it burns, then rebuilding.', scores: { phoenix: 2 } },
      ],
    },
    {
      q: 'People come to you for —',
      options: [
        { label: 'Loyalty they can’t find anywhere else.', scores: { wolf: 2 } },
        { label: 'Advice that’s a little too accurate.', scores: { serpent: 2, raven: 1 } },
        { label: 'The truth, delivered without a cushion.', scores: { raven: 2 } },
        { label: 'Proof that you can come back from anything.', scores: { phoenix: 2 } },
      ],
    },
    {
      q: 'Your relationship with change is —',
      options: [
        { label: 'I resist it until it threatens my people, then I move.', scores: { wolf: 2 } },
        { label: 'I shed old skins on schedule.', scores: { serpent: 2 } },
        { label: 'I see it coming and tell everyone.', scores: { raven: 2 } },
        { label: 'I’ve been reborn enough times to trust it.', scores: { phoenix: 2 } },
      ],
    },
    {
      q: 'Your energy at a funeral, a wedding, a crisis —',
      options: [
        { label: 'Guarding the door, watching the room.', scores: { wolf: 2 } },
        { label: 'Calm, quiet, unnervingly composed.', scores: { serpent: 2 } },
        { label: 'The one person telling the truth about it.', scores: { raven: 2 } },
        { label: 'Holding the people who are falling apart.', scores: { phoenix: 2 } },
      ],
    },
    {
      q: 'The word that fits you best is —',
      options: [
        { label: 'Devoted.', scores: { wolf: 2 } },
        { label: 'Patient.', scores: { serpent: 2 } },
        { label: 'Unflinching.', scores: { raven: 2 } },
        { label: 'Unkillable.', scores: { phoenix: 2 } },
      ],
    },
  ],

  results: {
    wolf: {
      title: 'The Wolf',
      blurb:
        'You run in a small pack and you’d die for it. Fierce, watchful, loyal past all reason — you read danger early and you never, ever leave your people to face it alone. Cross one of them and you’ll meet the other side of that devotion.',
      traits: [
        'Loyal to the death',
        'Always watching the perimeter',
        'Small circle, total commitment',
      ],
      shareLine: 'My Scorpio spirit animal is the Wolf — I protect my pack.',
    },
    serpent: {
      title: 'The Serpent',
      blurb:
        'Still, patient, and always one move ahead. You wait while everyone else reacts, you shed what no longer fits without ceremony, and when you finally move it’s decisive. People mistake your calm for passivity exactly once.',
      traits: ['Endlessly patient', 'Sheds the old without drama', 'Strikes once, precisely'],
      shareLine: 'My Scorpio spirit animal is the Serpent — patient, then decisive.',
    },
    raven: {
      title: 'The Raven',
      blurb:
        'You see what’s coming and you say it out loud, even when nobody wants to hear it. Clever, unsentimental, drawn to the shadow subjects other people avoid. Your honesty is a gift wrapped in something a little sharp.',
      traits: ['Sees the shift early', 'Says the unsayable', 'Comfortable in the dark'],
      shareLine: 'My Scorpio spirit animal is the Raven — I’ll tell you the truth.',
    },
    phoenix: {
      title: 'The Phoenix',
      blurb:
        'You’ve burned down and rebuilt more times than anyone knows, and each version is stronger. Loss doesn’t frighten you the way it frightens other people — you’ve been to the ashes and you know the way back.',
      traits: ['Rebuilds from nothing', 'Unafraid of endings', 'Steadiest in a catastrophe'],
      shareLine: 'My Scorpio spirit animal is the Phoenix — I’ve done this before.',
    },
  },
}
