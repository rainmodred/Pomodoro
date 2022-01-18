import { render, screen } from '@testing-library/react';

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

    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    expect(screen.getByTestId('reset')).toBeInTheDocument();
  });
});
