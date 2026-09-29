import { Languages } from '@/i18n';

describe('Languages.foreign', () => {
  it('names the content language when it differs from the page language', () => {
    expect(Languages.foreign('uk', 'en')).toBe('uk');
  });

  it('is undefined for content in the page language', () => {
    expect(Languages.foreign('en', 'en')).toBeUndefined();
  });

  it('is undefined for content without a language', () => {
    expect(Languages.foreign(null, 'uk')).toBeUndefined();
  });
});
