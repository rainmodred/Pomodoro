import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Timer from './Timer';
import { wrapper } from '../../utils';
const DEFAULT_TIME = 1500;

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders Timer', () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />, { wrapper });

    expect(screen.getByTestId('meow-start')).toBeInTheDocument();
    expect(screen.getByTestId('meow-clock')).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByTestId('meow-reset')).toBeInTheDocument();
  });

  it('on timer button click it changes text', () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />, { wrapper });

    const startButton = screen.getByTestId('meow-start');
    userEvent.click(startButton);
    expect(screen.queryByText(/start/i)).not.toBeInTheDocument();

    const pause = screen.getByText(/pause/i);
    expect(screen.getByText(/pause/i)).toBeInTheDocument();
    userEvent.click(startButton);
    expect(screen.queryByText(/pause/i)).not.toBeInTheDocument();
  });

  it('on start button click start timer', async () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />, { wrapper });

    userEvent.click(screen.getByTestId('meow-start'));

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('meow-clock')).toHaveTextContent('24:00');
  });

  it('reset click resets timer', () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />, { wrapper });

    userEvent.click(screen.getByTestId('meow-start'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    userEvent.click(screen.getByTestId('meow-reset'));

    expect(screen.getByTestId('meow-clock')).toHaveTextContent('25:00');
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it('on time end start/pause button is disabled', () => {
    render(<Timer id="meow" tabIndex={0} time={1} />, { wrapper });

    userEvent.click(screen.getByTestId('meow-start'));

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByTestId('meow-start')).toBeDisabled();
  });
});
