import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Timer from './Timer';

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
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />);

    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });

  it('on timer button click it changes text', () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />);

    const start = screen.getByText(/start/i);
    userEvent.click(start);
    expect(screen.queryByText(/start/i)).not.toBeInTheDocument();

    const pause = screen.getByText(/pause/i);
    expect(screen.getByText(/pause/i)).toBeInTheDocument();
    userEvent.click(pause);
    expect(screen.queryByText(/pause/i)).not.toBeInTheDocument();
  });

  it('on start button click start timer', async () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />);

    userEvent.click(screen.getByText(/start/i));

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(screen.getByText('24:00')).toBeInTheDocument();
  });

  it('reset click resets timer', () => {
    render(<Timer id="meow" tabIndex={0} time={DEFAULT_TIME} />);

    userEvent.click(screen.getByText(/start/i));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    userEvent.click(screen.getByText(/reset/i));

    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
  });
});
