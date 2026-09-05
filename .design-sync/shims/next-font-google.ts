type FontResult = {
  variable: string;
  className: string;
  style: Record<string, unknown>;
};

function makeFont(_options?: Record<string, unknown>): FontResult {
  return { variable: '', className: '', style: {} };
}

export function JetBrains_Mono(options?: Record<string, unknown>): FontResult {
  return makeFont(options);
}

export function Atkinson_Hyperlegible_Next(options?: Record<string, unknown>): FontResult {
  return makeFont(options);
}

export function Wix_Madefor_Text(options?: Record<string, unknown>): FontResult {
  return makeFont(options);
}
