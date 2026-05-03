import type { ElectionStep, StatItem, DemocracyCountry } from '../types';

export const ELECTION_STEPS: ElectionStep[] = [
  {
    number: '01',
    iconName: 'UserCheck',
    title: 'Voter Registration',
    description: 'Citizens sign up to participate. Deadlines vary by region — check your local rules.',
    color: '#3b82f6',
    detail:
      'Registration ensures eligible citizens can cast their ballot. Most countries require registration before Election Day.',
  },
  {
    number: '02',
    iconName: 'Award',
    title: 'Candidate Nomination',
    description: 'Parties and independents formally declare their candidacy through official channels.',
    color: '#8b5cf6',
    detail:
      'Candidates must meet eligibility requirements including age, citizenship, and filing deadlines.',
  },
  {
    number: '03',
    iconName: 'Megaphone',
    title: 'Campaigning Period',
    description: 'Candidates campaign across media, debates, and rallies to win voter support.',
    color: '#f59e0b',
    detail:
      'Campaigns are regulated by finance laws and media access rules to ensure fair competition.',
  },
  {
    number: '04',
    iconName: 'Mail',
    title: 'Early & Absentee Voting',
    description: 'Voters unable to attend on Election Day can vote early or by mail in many jurisdictions.',
    color: '#06b6d4',
    detail:
      'Absentee and early voting options expand access for working voters, military, and those with disabilities.',
  },
  {
    number: '05',
    iconName: 'Vote',
    title: 'Election Day',
    description: 'Polls open and millions cast their votes at polling stations across the country.',
    color: '#ef4444',
    detail:
      'Election Day is typically a public holiday or held on a weekend to maximise voter participation.',
  },
  {
    number: '06',
    iconName: 'Calculator',
    title: 'Vote Counting & Verification',
    description: 'Ballots are tabulated by officials and independently verified for accuracy.',
    color: '#10b981',
    detail:
      'Multiple verification layers including audits and recounts ensure every valid vote is counted correctly.',
  },
  {
    number: '07',
    iconName: 'CheckSquare',
    title: 'Results Certification',
    description: 'Election authorities formally certify the results, making them official and legally binding.',
    color: '#3b82f6',
    detail:
      'Certification often involves canvassing boards reviewing all ballots including provisionals and absentees.',
  },
  {
    number: '08',
    iconName: 'Star',
    title: 'Inauguration',
    description: 'The winner is sworn into office, completing the democratic transfer of power.',
    color: '#f59e0b',
    detail: "The inauguration ceremony officially transfers power and marks the start of the new official's term.",
  },
];

export const STAT_ITEMS: StatItem[] = [
  {
    iconName: 'Globe2',
    value: 150,
    suffix: '+',
    label: 'Countries Hold Elections',
    color: '#3b82f6',
    description: 'Democratic nations worldwide',
  },
  {
    iconName: 'Users',
    value: 4.2,
    suffix: 'B',
    label: 'Eligible Voters Worldwide',
    color: '#ef4444',
    description: 'People with the right to vote',
  },
  {
    iconName: 'ListChecks',
    value: 8,
    suffix: '',
    label: 'Steps to Certified Result',
    color: '#f59e0b',
    description: 'From registration to inauguration',
  },
  {
    iconName: 'TrendingUp',
    value: 68,
    suffix: '%',
    label: 'Avg Global Voter Turnout',
    color: '#10b981',
    description: 'In most recent national elections',
  },
];

export const DEMOCRACY_COUNTRIES: DemocracyCountry[] = [
  { name: 'United States', lat: 38, lon: -97, year: 2024 },
  { name: 'United Kingdom', lat: 55, lon: -3, year: 2024 },
  { name: 'France', lat: 46, lon: 2, year: 2022 },
  { name: 'Germany', lat: 51, lon: 10, year: 2021 },
  { name: 'India', lat: 20, lon: 77, year: 2024 },
  { name: 'Brazil', lat: -14, lon: -51, year: 2022 },
  { name: 'Canada', lat: 56, lon: -96, year: 2021 },
  { name: 'Australia', lat: -25, lon: 133, year: 2022 },
  { name: 'Japan', lat: 36, lon: 138, year: 2021 },
  { name: 'South Korea', lat: 36, lon: 127, year: 2022 },
  { name: 'Mexico', lat: 23, lon: -102, year: 2024 },
  { name: 'South Africa', lat: -30, lon: 25, year: 2024 },
  { name: 'Indonesia', lat: -5, lon: 120, year: 2024 },
  { name: 'Argentina', lat: -34, lon: -64, year: 2023 },
  { name: 'Nigeria', lat: 10, lon: 8, year: 2023 },
  { name: 'New Zealand', lat: -41, lon: 174, year: 2023 },
  { name: 'Sweden', lat: 62, lon: 15, year: 2022 },
  { name: 'Spain', lat: 40, lon: -4, year: 2023 },
  { name: 'Poland', lat: 52, lon: 20, year: 2023 },
  { name: 'Netherlands', lat: 52, lon: 5, year: 2023 },
  { name: 'Portugal', lat: 39, lon: -8, year: 2022 },
  { name: 'Greece', lat: 39, lon: 22, year: 2023 },
  { name: 'Chile', lat: -30, lon: -71, year: 2021 },
  { name: 'Taiwan', lat: 23, lon: 121, year: 2024 },
  { name: 'Philippines', lat: 13, lon: 122, year: 2022 },
  { name: 'Ghana', lat: 7, lon: -1, year: 2024 },
  { name: 'Kenya', lat: 1, lon: 38, year: 2022 },
  { name: 'Israel', lat: 31, lon: 35, year: 2022 },
  { name: 'Colombia', lat: 4, lon: -72, year: 2022 },
  { name: 'Ukraine', lat: 49, lon: 32, year: 2019 },
];

export const STARTER_QUESTIONS: string[] = [
  'How do I register to vote?',
  'What is the Electoral College?',
  'When is Election Day?',
  'How are votes counted?',
  'What is voter ID?',
];

export const CHAT_SYSTEM_PROMPT =
  'You are an expert, neutral, non-partisan election education assistant. Help users understand election processes, voting rights, timelines, and civic duties clearly and factually. Never express political bias. Keep answers concise and educational. Use bullet points when listing steps or facts.';

export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
