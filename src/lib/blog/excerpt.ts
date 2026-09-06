const MAX_LENGTH = 200;

function stripCodeFences(text: string): string {
  return text.replace(/```[\s\S]*?```/g, '');
}

function stripJsxImportExportLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => !/^\s*(import|export)\s/.test(line))
    .join('\n');
}

function stripInlineCode(text: string): string {
  return text.replace(/`([^`]*)`/g, '$1');
}

function stripHeadingLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => !/^\s{0,3}#{1,6}\s+/.test(line))
    .join('\n');
}

function stripJsxOnlyLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => !/^\s*<\/?[A-Za-z][^\n>]*\/?>\s*$/.test(line))
    .join('\n');
}

function stripImages(text: string): string {
  return text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
}

function stripLinks(text: string): string {
  return text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
}

function stripEmphasis(text: string): string {
  return text.replace(/(\*{1,3}|_{1,3})([^*_]+)\1/g, '$2').replace(/[*_]/g, '');
}

function stripJsxTags(text: string): string {
  return text.replace(/<\/?[A-Za-z][^\n>]*>/g, '');
}

function firstNonEmptyParagraph(text: string): string {
  const paragraph = text
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .find((block) => block.length > 0);
  return paragraph ?? '';
}

function cutAtWordBoundary(text: string): string {
  if (text.length <= MAX_LENGTH) return text;
  const truncated = text.slice(0, MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(' ');
  const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
  return `${cut.trimEnd()}…`;
}

export function plainExcerpt(content: string): string {
  let text = content;
  text = stripCodeFences(text);
  text = stripJsxImportExportLines(text);
  text = stripHeadingLines(text);
  text = stripJsxOnlyLines(text);
  text = stripInlineCode(text);
  text = stripImages(text);
  text = stripLinks(text);
  text = stripEmphasis(text);
  text = stripJsxTags(text);

  const paragraph = firstNonEmptyParagraph(text);
  return cutAtWordBoundary(paragraph);
}
