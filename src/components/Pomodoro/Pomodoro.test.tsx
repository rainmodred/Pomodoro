import { render, screen } from '@testing-library/react';

import Pomodoro from './Pomodoro';

describe('Pomodoro', () => {
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
});
