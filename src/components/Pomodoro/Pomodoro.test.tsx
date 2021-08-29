import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pomodoro from './Pomodoro';

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

    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByText(/setting/i)).toBeInTheDocument();
  });

  it('on timer button click it changes text', () => {
    render(<Pomodoro />);

    const start = screen.getByText(/start/i);
    userEvent.click(start);
    expect(screen.queryByText(/start/i)).not.toBeInTheDocument();

    const pause = screen.getByText(/pause/i);
    expect(screen.getByText(/pause/i)).toBeInTheDocument();
    userEvent.click(pause);
    expect(screen.queryByText(/pause/i)).not.toBeInTheDocument();
  });

  it('on start button click start timer', async () => {
    const DEFAULT_TIME = 1500000;
    render(<Pomodoro />);

    userEvent.click(screen.getByText(/start/i));

    act(() => {
      jest.advanceTimersByTime(DEFAULT_TIME);
    });

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
