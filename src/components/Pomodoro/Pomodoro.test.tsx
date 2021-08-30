import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pomodoro from './Pomodoro';

const DEFAULT_TIME = 1500000;

describe('Pomodoro', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders Pomodoro', () => {
    render(<Pomodoro />);

    expect(screen.getByText('Pomodoro')).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /pomodoro/i })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /short break/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: /long break/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('pomodoro-clock')).toBeVisible();
    expect(screen.getByTestId('short break-clock')).not.toBeVisible();
    expect(screen.getByTestId('long break-clock')).not.toBeVisible();

    expect(screen.getByTestId('pomodoro-start')).toBeInTheDocument();
    expect(screen.getByTestId('pomodoro-reset')).toBeInTheDocument();
  });

  it('resets timer on tab change', () => {
    render(<Pomodoro />);

    userEvent.click(screen.getByTestId('pomodoro-start'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    userEvent.click(screen.getByRole('tab', { name: /short break/i }));
    expect(screen.getByTestId('short break-clock')).toHaveTextContent('05:00');

    userEvent.click(screen.getByRole('tab', { name: /pomodoro/i }));
    expect(screen.getByTestId('pomodoro-clock')).toHaveTextContent('25:00');
  });
});
