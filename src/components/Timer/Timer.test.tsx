import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Timer from './Timer';
import { wrapper } from '../../utils/testUtils';
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
    render(
      <Timer
        initialTime={DEFAULT_TIME}
        currentTime={DEFAULT_TIME}
        statusText="start"
        reset={jest.fn}
        toggle={jest.fn}
      />,
      { wrapper },
    );

    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });

  // it('on timer button click it changes text', () => {
  //   render(<Timer initialTime={DEFAULT_TIME} />, { wrapper });

  //   const startButton = screen.getByTestId('meow-start');
  //   userEvent.click(startButton);
  //   expect(screen.queryByText(/start/i)).not.toBeInTheDocument();

  //   expect(screen.getByText(/pause/i)).toBeInTheDocument();
  //   userEvent.click(startButton);
  //   expect(screen.queryByText(/pause/i)).not.toBeInTheDocument();
  // });

  // it('on start button click start timer', async () => {
  //   render(<Timer initialTime={DEFAULT_TIME} />, { wrapper });

  //   userEvent.click(screen.getByTestId('meow-start'));

  //   act(() => {
  //     jest.advanceTimersByTime(60000);
  //   });

  //   expect(screen.getByTestId('meow-clock')).toHaveTextContent('24:00');
  // });

  // it('reset click resets timer', () => {
  //   render(<Timer initialTime={DEFAULT_TIME} />, { wrapper });

  //   userEvent.click(screen.getByTestId('meow-start'));

  //   act(() => {
  //     jest.advanceTimersByTime(100000);
  //   });

  //   userEvent.click(screen.getByTestId('meow-reset'));

  //   expect(screen.getByTestId('meow-clock')).toHaveTextContent('25:00');
  //   expect(screen.getByText(/start/i)).toBeInTheDocument();
  // });

  // it('on initialTime end start/pause button is disabled', () => {
  //   render(<Timer initialTime={1} />, { wrapper });

  //   userEvent.click(screen.getByTestId('meow-start'));

  //   act(() => {
  //     jest.advanceTimersByTime(60000);
  //   });

  //   expect(screen.getByTestId('meow-start')).toBeDisabled();
  // });

  // it('should stop timer on initialTime end', () => {
  //   render(<Timer initialTime={1} />, { wrapper });

  //   userEvent.click(screen.getByTestId('meow-start'));

  //   act(() => {
  //     jest.advanceTimersByTime(60000);
  //   });

  //   expect(screen.getByTestId('meow-clock')).toHaveTextContent('00:00');
  // });
});
