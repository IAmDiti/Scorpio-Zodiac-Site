export default {
  slug: 'which-sign-is-your-soulmate',
  title: 'Which sign is your soulmate?',
  description: 'Eight questions to find the sign that actually gets you.',
  category: 'Love',
  minutes: 3,
  cover: { from: '#10243a', to: '#1c1338' },
  image: '/quiz/which-sign-is-your-soulmate.svg',
  scoring: 'tally',
  order: 3,

  questions: [
    {
      q: 'The trait you most need in a partner is —',
      options: [
        {
          label: 'Emotional courage — they don’t flinch from feeling.',
          scores: { pisces: 2, cancer: 1 },
        },
        {
          label: 'Steadiness — they don’t move when things get loud.',
          scores: { taurus: 2, capricorn: 1 },
        },
        { label: 'A sharp, curious mind that keeps up with yours.', scores: { virgo: 2 } },
        { label: 'Devotion — they’re all in or not at all.', scores: { cancer: 2, pisces: 1 } },
      ],
    },
    {
      q: 'Your worst relationship habit is —',
      options: [
        { label: 'Testing people instead of trusting them.', scores: { capricorn: 2, virgo: 1 } },
        { label: 'Going quiet instead of saying what’s wrong.', scores: { cancer: 2 } },
        { label: 'Wanting to merge completely, fast.', scores: { pisces: 2 } },
        { label: 'Holding a grudge past its expiry date.', scores: { taurus: 2 } },
      ],
    },
    {
      q: 'On a Friday night you’d rather —',
      options: [
        { label: 'One person, one long conversation, no crowd.', scores: { pisces: 2, cancer: 1 } },
        { label: 'Cook something slow at home together.', scores: { taurus: 2, cancer: 1 } },
        { label: 'Go somewhere with a plan and a reservation.', scores: { capricorn: 2 } },
        { label: 'Take on a project together, weirdly.', scores: { virgo: 2 } },
      ],
    },
    {
      q: 'You feel safest with someone who —',
      options: [
        { label: 'Feels everything with you and doesn’t judge it.', scores: { pisces: 2 } },
        { label: 'Has clearly decided you’re it.', scores: { taurus: 2, cancer: 1 } },
        { label: 'Is building something and wants you in it.', scores: { capricorn: 2 } },
        { label: 'Notices when you’re off before you say so.', scores: { cancer: 2, virgo: 1 } },
      ],
    },
    {
      q: 'A dealbreaker for you is —',
      options: [
        { label: 'Emotional avoidance.', scores: { pisces: 2, cancer: 1 } },
        { label: 'Flakiness and broken plans.', scores: { capricorn: 2, taurus: 1 } },
        { label: 'Carelessness with your trust.', scores: { virgo: 2, capricorn: 1 } },
        { label: 'Making you feel like an option.', scores: { cancer: 2, taurus: 1 } },
      ],
    },
    {
      q: 'You want a love that feels —',
      options: [
        { label: 'Like being finally, completely understood.', scores: { pisces: 2 } },
        { label: 'Like home. Unglamorous and unshakeable.', scores: { taurus: 2, cancer: 1 } },
        { label: 'Like a serious, mutual project.', scores: { capricorn: 2 } },
        { label: 'Like someone chose to really see the work.', scores: { virgo: 2 } },
      ],
    },
    {
      q: 'When they’re hurting, you want them to —',
      options: [
        { label: 'Let you all the way in, no armour.', scores: { pisces: 2, cancer: 1 } },
        { label: 'Let you take care of the practical stuff.', scores: { virgo: 2, capricorn: 1 } },
        { label: 'Stay. Even in silence.', scores: { cancer: 2, taurus: 1 } },
        { label: 'Tell you who to be angry at.', scores: { taurus: 1, capricorn: 1 } },
      ],
    },
    {
      q: 'Ten years in, the dream is —',
      options: [
        { label: 'Still the person you can say anything to.', scores: { pisces: 2, cancer: 1 } },
        { label: 'A quiet life you built on purpose.', scores: { taurus: 2, capricorn: 1 } },
        { label: 'A partnership that everyone slightly envies.', scores: { capricorn: 2 } },
        { label: 'Someone who still notices the small things.', scores: { virgo: 2, cancer: 1 } },
      ],
    },
  ],

  results: {
    pisces: {
      title: 'Pisces',
      blurb:
        'The classic Scorpio soulmate. Two water signs who speak in undercurrents — Pisces meets your intensity with softness instead of resistance, and finally you don’t have to translate yourself. The risk is losing the edges between you.',
      traits: [
        'Matches your emotional depth',
        'Never makes you feel “too much”',
        'Dissolves your defences',
      ],
      shareLine: 'My soulmate sign is Pisces — deep water, no translation needed.',
    },
    cancer: {
      title: 'Cancer',
      blurb:
        'Cancer builds the safe home your Scorpio heart has been scanning for. Same loyalty, same long memory, same all-in love — but Cancer leads with tenderness where you lead with intensity. You protect each other on instinct.',
      traits: ['Fiercely loyal, like you', 'Leads with warmth', 'Gets your silences'],
      shareLine: 'My soulmate sign is Cancer — same loyalty, softer landing.',
    },
    taurus: {
      title: 'Taurus',
      blurb:
        'Your opposite sign, and the magnetism is real. Taurus is the immovable object to your unstoppable force: steady when you spiral, sensual, and completely unbothered by your storms. Two fixed signs, so pick your battles.',
      traits: ['Steady when you’re not', 'Deeply sensual', 'Won’t be intimidated'],
      shareLine: 'My soulmate sign is Taurus — my opposite, my anchor.',
    },
    capricorn: {
      title: 'Capricorn',
      blurb:
        'A power couple in the making. Capricorn earns your trust the slow, evidence-based way you respect, then locks in for life. You bring the depth, they bring the plan, and neither of you does anything halfway.',
      traits: ['Trust built on proof', 'Ambitious and committed', 'Unshakeable once in'],
      shareLine: 'My soulmate sign is Capricorn — built slow, built to last.',
    },
    virgo: {
      title: 'Virgo',
      blurb:
        'Underrated for Scorpio. Virgo pays the kind of close, specific attention that makes you feel truly known, and they’re unfazed by the parts of you other people call intense. Quiet devotion, sharp minds, no games.',
      traits: [
        'Notices everything about you',
        'Devoted in the details',
        'Calm under your intensity',
      ],
      shareLine: 'My soulmate sign is Virgo — quietly, precisely devoted.',
    },
  },
}
