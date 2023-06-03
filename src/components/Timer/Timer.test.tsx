import { render, screen } from '@testing-library/react';
import { vi, afterAll } from 'vitest';

import Timer from './Timer';
import { wrapper } from '../../utils/testUtils';
const DEFAULT_TIME = 1500;

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders Timer', () => {
    render(
      <Timer
        initialTime={DEFAULT_TIME}
        currentTime={DEFAULT_TIME}
        statusText="start"
        reset={vi.fn}
        toggle={vi.fn}
      />,
      { wrapper },
    );

    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });
});
