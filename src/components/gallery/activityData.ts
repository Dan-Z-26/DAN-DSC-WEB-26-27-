/**
 * Gallery Feature — Activity Data
 * Developer Students Club • SRM IST Ramapuram
 *
 * Single source of truth for the gallery spiral and the generated
 * /gallery/[slug] detail pages. Extend by appending a new object to
 * the ACTIVITIES array — the spiral layout and the static routes both
 * derive from it automatically.
 *
 * PLACEHOLDER CONTENT — copy and imagery are stand-ins to be replaced
 * with real club activities.
 */

import type { ActivityData } from './types';

export const ACTIVITIES: ActivityData[] = [
  {
    id: 'hackcelerate',
    slug: 'hackcelerate',
    title: 'Hackcelerate',
    blurb: 'Thirty-six hours, one room, far too much coffee.',
    description:
      'Our flagship overnight hackathon brings together students from every year and every discipline to build something end-to-end in a single weekend. Teams pitch on Friday evening, build through the night, and demo to a panel of industry mentors on Sunday. No prior hackathon experience required — half of every cohort is building their first project in public.',
    imagePath: '/gallery/hackathon.png',
    date: 'March 2026',
    tag: 'HACKATHON',
    isNew: true,
    stats: [
      { value: '36', label: 'hours' },
      { value: '42', label: 'teams' },
      { value: '9', label: 'mentors' },
    ],
    highlights: [
      {
        title: 'Pitch night',
        body: 'Friday opens with sixty seconds per idea and no slides allowed. Teams form in the room immediately afterwards, so nobody arrives pre-assembled.',
      },
      {
        title: 'The long night',
        body: 'Mentors rotate through the floor until roughly three in the morning. Most of the useful debugging happens in that window, and so does most of the pizza.',
      },
      {
        title: 'Demo and defend',
        body: 'Sunday is a live demo on the real thing — no recordings, no mockups. Judges ask what broke, and answering that honestly scores better than pretending nothing did.',
      },
    ],
    quote: {
      text: 'I came in not knowing how to deploy anything. I left having shipped to a URL a stranger could open.',
      attribution: 'First-year participant',
    },
  },
  {
    id: 'build-sessions',
    slug: 'build-sessions',
    title: 'Build Sessions',
    blurb: 'Weekly hands-on workshops, taught by students.',
    description:
      'Every week a member takes the floor and walks the room through something they have actually shipped — a framework, a deployment pipeline, a debugging technique. Sessions are deliberately hands-on: laptops open, everyone building alongside the presenter rather than watching slides. Past topics have spanned React internals, containerisation, and getting a first pull request merged into an open-source project.',
    imagePath: '/gallery/workshop.png',
    date: 'Every Thursday',
    tag: 'WORKSHOP',
    stats: [
      { value: '30+', label: 'sessions a year' },
      { value: '90', label: 'minutes each' },
      { value: '100%', label: 'student-led' },
    ],
    highlights: [
      {
        title: 'One member, one topic',
        body: 'Whoever is presenting has actually shipped the thing they are teaching. No borrowed slide decks, no tutorial recitals.',
      },
      {
        title: 'Laptops open',
        body: 'The room builds alongside the presenter rather than watching. Sessions are paced so the slowest laptop in the room still keeps up.',
      },
      {
        title: 'Nothing is too basic',
        body: 'Questions that sound obvious get answered properly. Half the room is encountering the topic for the first time, and pretending otherwise helps nobody.',
      },
    ],
    quote: {
      text: 'The first session I taught, I understood the topic twice as well by the end of it.',
      attribution: 'Technical domain member',
    },
  },
  {
    id: 'design-jam',
    slug: 'design-jam',
    title: 'Design Jam',
    blurb: 'Where the interface gets argued about properly.',
    description:
      'A recurring collaborative session for the Creatives domain, where members redesign a real product interface under a tight time limit and then defend their decisions to the room. The emphasis is on critique and iteration rather than polish — work is deliberately shown unfinished, and the most useful feedback usually arrives before anything looks good.',
    imagePath: '/gallery/design.png',
    date: 'February 2026',
    tag: 'CREATIVES',
    stats: [
      { value: '4', label: 'hours' },
      { value: '1', label: 'brief' },
      { value: '0', label: 'finished work' },
    ],
    highlights: [
      {
        title: 'A real interface',
        body: 'The brief is always a product people in the room already use, so critique has something concrete to push against rather than an invented scenario.',
      },
      {
        title: 'Show it ugly',
        body: 'Work is presented deliberately unfinished. The most useful feedback arrives long before anything looks good, and polish makes people reluctant to change direction.',
      },
      {
        title: 'Defend the decision',
        body: 'Every participant explains why, not what. "It looked better" is a starting point for a question, never an answer.',
      },
    ],
    quote: {
      text: 'Being asked to justify a corner radius sounds petty until you realise you cannot.',
      attribution: 'Creatives domain member',
    },
  },
  {
    id: 'open-source-drive',
    slug: 'open-source-drive',
    title: 'Open Source Drive',
    blurb: 'First contributions, merged for real.',
    description:
      'A month-long push to get every participating member a merged pull request in a public repository. Maintainers from partner projects triage beginner-friendly issues ahead of time, and senior members pair with first-timers through the entire loop — forking, branching, writing the patch, surviving code review, and landing it. The goal is the second contribution, which people make on their own.',
    imagePath: '/gallery/community.png',
    date: 'January 2026',
    tag: 'COMMUNITY',
    stats: [
      { value: '4', label: 'weeks' },
      { value: '60+', label: 'pull requests' },
      { value: '11', label: 'repositories' },
    ],
    highlights: [
      {
        title: 'Issues triaged first',
        body: 'Maintainers mark genuinely beginner-friendly issues ahead of time, so nobody spends their first week reading a build system they cannot run.',
      },
      {
        title: 'Paired end to end',
        body: 'A senior member sits with each first-timer through forking, branching, writing the patch, surviving review and landing it.',
      },
      {
        title: 'Review is the lesson',
        body: 'Most participants say the review thread taught them more than the patch did. Changes requested is the normal outcome, not a failure.',
      },
    ],
    quote: {
      text: 'The second contribution is the point. The first one just proves the door opens.',
      attribution: 'Drive organiser',
    },
  },
  {
    id: 'industry-connect',
    slug: 'industry-connect',
    title: 'Industry Connect',
    blurb: 'Alumni, engineers, and unusually candid advice.',
    description:
      'An evening series where alumni and working engineers return to talk about what the transition from campus to industry was actually like — including the parts that do not make it onto a LinkedIn post. Sessions run as long-form conversation rather than a talk, and the second half is entirely questions from the room.',
    imagePath: '/gallery/networking.png',
    date: 'December 2025',
    tag: 'NETWORKING',
    stats: [
      { value: '6', label: 'guests' },
      { value: '50%', label: 'of it is questions' },
      { value: '0', label: 'slide decks' },
    ],
    highlights: [
      {
        title: 'Conversation, not a talk',
        body: 'Guests are interviewed rather than given a stage. It keeps the session specific and stops it drifting into general career advice.',
      },
      {
        title: 'The unglamorous parts',
        body: 'Rejections, offers turned down, the first six months of not understanding the codebase. The parts that never make it onto a public profile.',
      },
      {
        title: 'Open floor',
        body: 'The second half belongs entirely to the room, and questions are collected anonymously beforehand so nobody has to ask theirs out loud.',
      },
    ],
    quote: {
      text: 'Everyone told me what to learn. This was the first time someone told me what the first year actually feels like.',
      attribution: 'Final-year attendee',
    },
  },
];
