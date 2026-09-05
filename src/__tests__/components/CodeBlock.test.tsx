import { act, fireEvent, render, screen } from '@testing-library/react';

import CodeBlock from '@/components/blog/CodeBlock';

describe('CodeBlock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('copies the code text and reverts the label after a delay', async () => {
    render(
      <CodeBlock lang='en' language='ts'>
        <pre>const x = 1;</pre>
      </CodeBlock>,
    );

    expect(screen.getByText('Copy')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Copied')).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
});
