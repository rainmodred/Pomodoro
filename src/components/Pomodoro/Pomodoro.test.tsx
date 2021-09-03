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

    expect(screen.getByTestId('pomodoro-clock')).toBeVisible();
    expect(screen.getByTestId('short break-clock')).not.toBeVisible();
    expect(screen.getByTestId('long break-clock')).not.toBeVisible();

    expect(screen.getByTestId('pomodoro-start')).toBeInTheDocument();
    expect(screen.getByTestId('pomodoro-reset')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
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

  it('on settings click opens modal', () => {
    render(<Pomodoro />);

    userEvent.click(screen.getByTestId('settings'));

    expect(screen.getByText(/time/i)).toBeInTheDocument();

    expect(
      screen.getByRole('spinbutton', { name: 'pomodoro' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'short break' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'long break' }),
    ).toBeInTheDocument();
  });

  it('can change pomodoro time', () => {
    render(<Pomodoro />);

    userEvent.click(screen.getByTestId('settings'));

    const input = screen.getByRole('spinbutton', { name: 'pomodoro' });
    userEvent.clear(input);
    userEvent.type(input, '20');
    expect(input).toHaveValue(20);

    userEvent.click(screen.getByText(/apply/i));

    expect(screen.getByTestId('pomodoro-clock')).toHaveTextContent('20:00');
  });
});
