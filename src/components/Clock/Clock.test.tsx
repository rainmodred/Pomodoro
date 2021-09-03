import { render, screen } from '@testing-library/react';
import Clock from './Clock';

describe('Clock', () => {
  it('renders Clock', () => {
    render(<Clock time={1500} id="meow" />);

    expect(screen.getByTestId('meow-clock')).toHaveTextContent('25:00');
  });
});
