import { render, screen } from '@testing-library/react';
import Clock from './Clock';

describe('Clock', () => {
  it('renders Clock', () => {
    render(<Clock minutes="25" seconds="00" />);

    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
  });
});
