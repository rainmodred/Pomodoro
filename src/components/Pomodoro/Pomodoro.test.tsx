import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapper } from '../../utils/testUtils';

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
    render(<Pomodoro />, { wrapper });

    expect(screen.getByText('Pomodoro')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /pomodoro/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /short break/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /long break/i }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('clock')).toBeVisible();

    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('should start timer on click', async () => {
    render(<Pomodoro />, { wrapper });

    userEvent.click(screen.getByTestId('toggle'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    expect(await screen.findByTestId('clock')).toHaveTextContent('23:20');
    expect(screen.getByText('pause')).toBeInTheDocument();
  });

  it('should start timer on keydown', () => {
    render(<Pomodoro />, { wrapper });

    fireEvent.keyDown(document, { key: ' ', code: 'SpaceSpace' });
    expect(screen.getByText('start')).toBeInTheDocument();
  });

  it('should pause timer', async () => {
    render(<Pomodoro />, { wrapper });

    userEvent.click(screen.getByTestId('toggle'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    expect(await screen.findByTestId('clock')).toHaveTextContent('23:20');
    userEvent.click(screen.getByTestId('toggle'));
    expect(screen.getByText('start')).toBeInTheDocument();
  });

  it('should reset timer on reset button click', async () => {
    render(<Pomodoro />, { wrapper });

    userEvent.click(screen.getByTestId('toggle'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    userEvent.click(screen.getByTestId('reset'));

    expect(await screen.findByTestId('clock')).toHaveTextContent('25:00');
  });

  it('should reset timer on manual tab change', async () => {
    render(<Pomodoro />, { wrapper });

    userEvent.click(screen.getByTestId('toggle'));

    act(() => {
      jest.advanceTimersByTime(100000);
    });

    userEvent.click(screen.getByRole('button', { name: /short break/i }));
    //screen.getByTestId() not working
    expect(await screen.findByTestId('clock')).toHaveTextContent('05:00');

    userEvent.click(screen.getByRole('button', { name: /pomodoro/i }));
    expect(await screen.findByTestId('clock')).toHaveTextContent('25:00');
  });

  it('should open settings dialog', () => {
    render(<Pomodoro />, { wrapper });

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

  it('should change pomodoro time', async () => {
    render(<Pomodoro />, { wrapper });

    userEvent.click(screen.getByTestId('settings'));

    const input = screen.getByRole('spinbutton', { name: 'pomodoro' });
    userEvent.clear(input);
    userEvent.type(input, '20');
    expect(input).toHaveValue(20);

    userEvent.click(screen.getByText(/apply/i));
    expect(await screen.findByTestId('clock')).toHaveTextContent('20:00');
  });
});
