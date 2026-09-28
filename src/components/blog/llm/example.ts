export const EXAMPLE_QUERY = 'The Eiffel Tower is in';

export const EXAMPLE_TOKENS = [
  'The',
  ' E',
  'iff',
  'el',
  ' Tower',
  ' is',
  ' in',
] as const;

export const EXAMPLE_TOKEN_IDS = [464, 412, 733, 417, 8765, 318, 287] as const;

export const NEXT_TOKEN_CANDIDATES = [
  { token: ' Paris', logit: 8.1 },
  { token: ' France', logit: 5.6 },
  { token: ' the', logit: 5.2 },
  { token: ' Las', logit: 4.3 },
  { token: ' central', logit: 3.7 },
  { token: ' a', logit: 3.4 },
  { token: ' Europe', logit: 2.6 },
  { token: ' London', logit: 1.9 },
] as const;

export const EXAMPLE_ANSWER_TOKENS = [' Paris', ',', ' France', '.'] as const;
