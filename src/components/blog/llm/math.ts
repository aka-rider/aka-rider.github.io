export function softmax(
  logits: readonly number[],
  temperature: number,
): number[] {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function gelu(x: number): number {
  return (
    0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)))
  );
}
