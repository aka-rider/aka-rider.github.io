export const EXAMPLE_QUERY = 'Why is the sky blue?';

export const EXAMPLE_TOKENS = [
  'Why',
  ' is',
  ' the',
  ' sky',
  ' blue',
  '?',
] as const;

export const EXAMPLE_TOKEN_IDS = [3923, 374, 279, 13180, 6437, 30] as const;

export const NEXT_TOKEN_CANDIDATES = [
  { token: 'Because', logit: 5.8 },
  { token: 'The', logit: 5.1 },
  { token: 'Sunlight', logit: 4.6 },
  { token: 'It', logit: 3.9 },
  { token: 'Short', logit: 3.2 },
  { token: 'Blue', logit: 2.4 },
  { token: 'Sky', logit: 1.7 },
  { token: 'Photons', logit: 1.1 },
] as const;

export const EXAMPLE_ANSWER_TOKENS = [
  'Because',
  ' sunlight',
  ' scatters',
  ' off',
  ' air',
  ' molecules',
  ',',
  ' and',
  ' blue',
  ' scatters',
  ' most',
  '.',
] as const;
