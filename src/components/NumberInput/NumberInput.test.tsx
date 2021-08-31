import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  it('renders and allow type numbers', () => {
    render(<NumberInput min={1} max={99} defaultValue="25" label="cats" />);

    const input = screen.getByLabelText('cats');
    expect(input).toBeInTheDocument();

    userEvent.clear(input);
    expect(input).toHaveValue(null);

    userEvent.type(input, '20');
    expect(input).toHaveValue(20);
  });
});
