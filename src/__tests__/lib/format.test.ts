import { formatDate, formatMeta, formatReadingTime } from '@/lib/format';

describe('formatDate', () => {
  const date = new Date(Date.UTC(2026, 8, 1));

  it('formats an English short date', () => {
    expect(formatDate(date, 'en', 'short')).toBe('Sep 1, 2026');
  });

  it('formats an English long date', () => {
    expect(formatDate(date, 'en', 'long')).toBe('September 1, 2026');
  });

  it('formats a Ukrainian short date', () => {
    expect(formatDate(date, 'uk', 'short')).toBe('1 вер. 2026 р.');
  });

  it('formats a Ukrainian long date', () => {
    expect(formatDate(date, 'uk', 'long')).toBe('1 вересня 2026 р.');
  });
});

describe('formatReadingTime', () => {
  it('formats English reading time', () => {
    expect(formatReadingTime(4, 'en')).toBe('4 min');
  });

  it('formats Ukrainian reading time', () => {
    expect(formatReadingTime(4, 'uk')).toBe('4 хв');
  });
});

describe('formatMeta', () => {
  const date = new Date(Date.UTC(2026, 8, 1));

  it('combines the short date and reading time when a date is given', () => {
    expect(formatMeta(date, 4, 'en')).toBe('Sep 1, 2026 · 4 min');
  });

  it('falls back to reading time alone when there is no date', () => {
    expect(formatMeta(undefined, 4, 'en')).toBe('4 min');
  });
});
