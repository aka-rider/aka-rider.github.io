type SpeculationCondition =
  | { href_matches: string }
  | { not: SpeculationCondition }
  | { and: SpeculationCondition[] };

type SpeculationRuleSet = {
  prerender: {
    where: SpeculationCondition;
    eagerness: 'conservative' | 'moderate' | 'eager' | 'immediate';
  }[];
};

const rules: SpeculationRuleSet = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/*.xml' } },
          { not: { href_matches: '/*.*' } },
          { not: { href_matches: '/_next/*' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
};

export default function SpeculationRules() {
  const json = JSON.stringify(rules).replace(/</g, '\\u003c');

  return (
    <script
      type='speculationrules'
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
