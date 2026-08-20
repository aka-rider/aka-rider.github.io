export const SPACE_MARK = '␣';

export function visibleSpaces(text: string): string {
  return text.replaceAll(' ', SPACE_MARK);
}

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined)
      throw new Error(`fill: no value for placeholder {${key}}`);
    return value;
  });
}
