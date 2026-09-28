import {
  ATTENTION_HEAD_IDS,
  ATTENTION_HEADS,
} from '@/components/blog/llm/AttentionDemo';
import {
  EXAMPLE_ANSWER_TOKENS,
  EXAMPLE_TOKEN_IDS,
  EXAMPLE_TOKENS,
  NEXT_TOKEN_CANDIDATES,
} from '@/components/blog/llm/example';
import { gelu } from '@/components/blog/llm/math';
import { candidateDistribution } from '@/components/blog/llm/TemperatureDemo';
import {
  BARE_TOWER_PRESET,
  MAIN_PRESET,
  SPACE_TOWER_PRESET,
  UKRAINIAN_PRESET,
} from '@/components/blog/llm/tokenizerPresets';
import {
  finalEmbedding,
  positionEncoding,
  tokenEmbedding,
} from '@/components/blog/llm/vectors';
import { WORLD_PICKER_DISTRIBUTIONS } from '@/components/blog/llm/WorldPickerDemo';

const ALL_PRESETS = [
  MAIN_PRESET,
  BARE_TOWER_PRESET,
  SPACE_TOWER_PRESET,
  UKRAINIAN_PRESET,
];

function argmax(values: readonly number[]): number {
  return values.reduce(
    (bestIdx, value, idx) => (value > values[bestIdx]! ? idx : bestIdx),
    0,
  );
}

describe('1.1 Embedding — tokenizing the running example', () => {
  it("the phrase's final BPE round is exactly the running example's 7 tokens and IDs", () => {
    const lastRound = MAIN_PRESET.rounds[MAIN_PRESET.rounds.length - 1]!;

    expect(lastRound.map((p) => p.id)).toEqual(Array.from(EXAMPLE_TOKEN_IDS));
    expect(lastRound.map((p) => p.text)).toEqual(Array.from(EXAMPLE_TOKENS));
  });

  it('bare "Tower" splits into T and ower, not one piece', () => {
    const lastRound =
      BARE_TOWER_PRESET.rounds[BARE_TOWER_PRESET.rounds.length - 1]!;

    expect(lastRound.map((p) => p.id)).toEqual([51, 789]);
    expect(lastRound.map((p) => p.text)).toEqual(['T', 'ower']);
  });

  it('" Tower" with its leading space is a single token', () => {
    const lastRound =
      SPACE_TOWER_PRESET.rounds[SPACE_TOWER_PRESET.rounds.length - 1]!;

    expect(lastRound.map((p) => p.id)).toEqual([8765]);
    expect(lastRound.map((p) => p.text)).toEqual([' Tower']);
  });

  it('text outside the training distribution ends in 32 byte-level pieces, some of them lone bytes that split a letter', () => {
    const lastRound =
      UKRAINIAN_PRESET.rounds[UKRAINIAN_PRESET.rounds.length - 1]!;

    expect(lastRound).toHaveLength(32);
    expect(lastRound.some((piece) => piece.text === null)).toBe(true);
  });

  it('every merge round still reassembles the exact original UTF-8 bytes', () => {
    ALL_PRESETS.forEach((preset) => {
      const utf8Hex = Array.from(Buffer.from(preset.text, 'utf8'))
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');

      preset.rounds.forEach((round) => {
        expect(round.map((p) => p.hex).join(' ')).toBe(utf8Hex);
      });
    });
  });

  it('merging pieces together never increases how many pieces remain', () => {
    ALL_PRESETS.forEach((preset) => {
      for (let i = 0; i < preset.rounds.length - 1; i++) {
        expect(preset.rounds[i]!.length).toBeGreaterThanOrEqual(
          preset.rounds[i + 1]!.length,
        );
      }
    });
  });

  it('every preset starts, at round 0, from single raw bytes', () => {
    ALL_PRESETS.forEach((preset) => {
      preset.rounds[0]!.forEach((piece) => {
        expect(piece.hex.length).toBe(2);
      });
    });
  });
});

describe('1.1 Embedding — token identity plus position', () => {
  it('the final embedding is the token embedding plus the position encoding', () => {
    const cases: [id: number, position: number][] = [
      [464, 0],
      [412, 1],
      [8765, 4],
      [287, 6],
    ];

    cases.forEach(([id, position]) => {
      const token = tokenEmbedding(id);
      const place = positionEncoding(position);

      finalEmbedding(id, position).forEach((value, dim) => {
        expect(value).toBeCloseTo(token[dim]! + place[dim]!, 12);
      });
    });
  });

  it('the same token gets a different final embedding at a different position', () => {
    const here = finalEmbedding(464, 0);
    const there = finalEmbedding(464, 4);

    expect(here).not.toEqual(there);
  });
});

describe('1.2 Multi-head self-attention — behaviour of the three illustrative heads', () => {
  it('no token attends to a token that comes after it', () => {
    ATTENTION_HEAD_IDS.forEach((headId) => {
      ATTENTION_HEADS[headId].forEach((row, i) => {
        expect(row).toHaveLength(i + 1);
      });
    });
  });

  it("each token's attention weights form a probability distribution", () => {
    ATTENTION_HEAD_IDS.forEach((headId) => {
      ATTENTION_HEADS[headId].forEach((row) => {
        row.forEach((weight) => {
          expect(weight).toBeGreaterThanOrEqual(0);
        });
        expect(row.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
      });
    });
  });

  it('the previous-token head looks mostly at the token right before each one', () => {
    const rows = ATTENTION_HEADS.previousToken;
    for (let i = 1; i < rows.length; i++) {
      expect(argmax(rows[i]!)).toBe(i - 1);
    }
  });

  it('the name-builder head, at "el", looks mostly at "␣E" and "iff"', () => {
    const elIndex = EXAMPLE_TOKENS.indexOf('el');
    const spaceEIndex = EXAMPLE_TOKENS.indexOf(' E');
    const iffIndex = EXAMPLE_TOKENS.indexOf('iff');
    const row = ATTENTION_HEADS.nameBuilder[elIndex]!;

    const combinedWeight = row[spaceEIndex]! + row[iffIndex]!;
    expect(combinedWeight).toBeGreaterThan(0.9);

    const others = row.filter(
      (_, idx) => idx !== spaceEIndex && idx !== iffIndex,
    );
    others.forEach((weight) => {
      expect(weight).toBeLessThan(row[spaceEIndex]!);
      expect(weight).toBeLessThan(row[iffIndex]!);
    });
  });

  it('the locating head, at "␣in", looks mostly at "␣Tower"', () => {
    const inIndex = EXAMPLE_TOKENS.indexOf(' in');
    const towerIndex = EXAMPLE_TOKENS.indexOf(' Tower');
    const row = ATTENTION_HEADS.locate[inIndex]!;

    expect(argmax(row)).toBe(towerIndex);
    expect(row[towerIndex]!).toBeGreaterThan(0.5);
  });
});

describe('1.3 MLP — the GELU nonlinearity', () => {
  it('is close to zero for large negative inputs', () => {
    expect(gelu(-10)).toBeCloseTo(0, 6);
  });

  it('is close to the identity for large positive inputs', () => {
    expect(gelu(10)).toBeCloseTo(10, 6);
  });

  it('is exactly zero at zero', () => {
    expect(gelu(0)).toBe(0);
  });
});

describe('1.5 Output probabilities — candidateDistribution', () => {
  const ALL_KEPT = {
    temperature: 1,
    topK: NEXT_TOKEN_CANDIDATES.length,
    topP: 1,
  };

  it('at the default settings, " Paris" is the most likely next token and nothing is cut', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, ALL_KEPT);

    const top = distribution.reduce((best, row) =>
      row.probability > best.probability ? row : best,
    );
    expect(top.token).toBe(' Paris');

    distribution.forEach((row) => {
      expect(row.cutReason).toBeNull();
    });
    const sum = distribution.reduce((a, row) => a + row.probability, 0);
    expect(sum).toBeCloseTo(1, 9);
  });

  it('lowering the temperature concentrates probability on " Paris"', () => {
    const parisProbAt = (temperature: number) =>
      candidateDistribution(NEXT_TOKEN_CANDIDATES, {
        ...ALL_KEPT,
        temperature,
      }).find((row) => row.token === ' Paris')!.probability;

    const atHigh = parisProbAt(2);
    const atOne = parisProbAt(1);
    const atHalf = parisProbAt(0.5);
    const atLow = parisProbAt(0.05);

    expect(atHigh).toBeLessThan(atOne);
    expect(atOne).toBeLessThan(atHalf);
    expect(atHalf).toBeLessThan(atLow);
  });

  it('an extreme low temperature stays numerically finite and nearly all-in on " Paris"', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      ...ALL_KEPT,
      temperature: 0.05,
    });

    distribution.forEach((row) => {
      expect(Number.isNaN(row.probability)).toBe(false);
      expect(Number.isFinite(row.probability)).toBe(true);
    });
    const paris = distribution.find((row) => row.token === ' Paris')!;
    expect(paris.probability).toBeGreaterThanOrEqual(0.99);
  });

  it('top-k=1 is greedy: only " Paris" survives, with all the probability', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      ...ALL_KEPT,
      topK: 1,
    });

    const survivors = distribution.filter((row) => row.cutReason === null);
    expect(survivors).toHaveLength(1);
    expect(survivors[0]!.token).toBe(' Paris');
    expect(survivors[0]!.probability).toBeCloseTo(1, 9);

    distribution
      .filter((row) => row.token !== ' Paris')
      .forEach((row) => {
        expect(row.cutReason).toBe('top-k');
      });
  });

  it('top-p cuts the low-probability tail and the survivors renormalise to 1', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      ...ALL_KEPT,
      topP: 0.95,
    });

    const survivors = distribution.filter((row) => row.cutReason === null);
    const cut = distribution.filter((row) => row.cutReason === 'top-p');

    expect(survivors.length).toBeGreaterThan(0);
    expect(survivors.length).toBeLessThan(distribution.length);
    expect(cut.length).toBe(distribution.length - survivors.length);

    const survivorSum = survivors.reduce((a, row) => a + row.probability, 0);
    expect(survivorSum).toBeCloseTo(1, 9);
  });

  it('the most likely token always survives top-p, even at the smallest p the slider allows', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      ...ALL_KEPT,
      topP: 0,
    });

    const top = distribution.reduce((best, row) =>
      row.logit > best.logit ? row : best,
    );
    expect(top.token).toBe(' Paris');
    expect(top.cutReason).toBeNull();
  });

  it('scaled logits are the raw logit divided by the temperature', () => {
    const temperature = 2;
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      ...ALL_KEPT,
      temperature,
    });

    distribution.forEach((row) => {
      expect(row.scaledLogit).toBeCloseTo(row.logit / temperature, 9);
    });
  });
});

describe('3.3 Steering with markdown — the same phrase, three worlds', () => {
  it('every framing distributes probability over exactly 5 continuations summing to 100%', () => {
    Object.values(WORLD_PICKER_DISTRIBUTIONS).forEach((entries) => {
      expect(entries).toHaveLength(5);
      const sum = entries.reduce((acc, [, pct]) => acc + pct, 0);
      expect(sum).toBe(100);
    });
  });

  it('a travel guide continues with " Paris"', () => {
    expect(WORLD_PICKER_DISTRIBUTIONS.travel[0]![0]).toBe(' Paris');
  });

  it('a Las Vegas hotel guide continues with " Las"', () => {
    expect(WORLD_PICKER_DISTRIBUTIONS.vegas[0]![0]).toBe(' Las');
  });

  it('a Minecraft build log continues with " my"', () => {
    expect(WORLD_PICKER_DISTRIBUTIONS.minecraft[0]![0]).toBe(' my');
  });
});

describe("1.7 The loop — appending the model's own output", () => {
  it('the first generated token is the model\'s own top candidate, " Paris"', () => {
    const distribution = candidateDistribution(NEXT_TOKEN_CANDIDATES, {
      temperature: 1,
      topK: NEXT_TOKEN_CANDIDATES.length,
      topP: 1,
    });
    const top = distribution.reduce((best, row) =>
      row.probability > best.probability ? row : best,
    );

    expect(EXAMPLE_ANSWER_TOKENS[0]).toBe(top.token);
    expect(EXAMPLE_ANSWER_TOKENS[0]).toBe(' Paris');
  });
});
