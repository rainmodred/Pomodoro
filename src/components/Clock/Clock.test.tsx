import { render, screen } from '@testing-library/react';
import Clock from './Clock';

describe('Clock', () => {
  it('renders Clock', () => {
    render(<Clock time={1500} />);

    expect(screen.getByText(/25:00/i)).toBeInTheDocument();
  });
});
