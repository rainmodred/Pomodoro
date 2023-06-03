//TODO: Add more tests

describe('pomodoro app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4173/Pomodoro');
  });

  it('displays heading and pomodoro timer by default', () => {
    cy.findByRole('heading', { name: /pomodoro/i }).should('exist');
  });

  it('can start timer', () => {
    cy.clock();
    cy.findByRole('button', {
      name: /start/i,
    }).click();
    cy.tick(2000);
    cy.findByTestId('clock').should('have.text', '24:58');
  });

  it('can reset timer', () => {
    cy.clock();
    cy.findByRole('button', {
      name: /start/i,
    }).click();
    cy.tick(2000);
    cy.findByTestId('reset').click();
    cy.findByTestId('clock').should('have.text', '25:00');
  });

  it('can change tab', () => {
    cy.findByRole('button', {
      name: /short break/i,
    }).click();

    cy.findByTestId('clock').should('have.text', '05:00');
  });

  it('timer resets on tab change', () => {
    cy.clock();
    cy.findByRole('button', {
      name: /start/i,
    }).click();
    cy.tick(2000);
    cy.findByRole('button', {
      name: /short break/i,
    }).click();
    cy.findByRole('button', {
      name: /pomodoro/i,
    }).click();
    cy.findByTestId('clock').should('have.text', '25:00');
  });

  it('can change settings', () => {
    cy.findByTestId('settings').click();
    cy.findByRole('spinbutton', {
      name: /pomodoro/i,
    }).clear();
    cy.findByRole('spinbutton', {
      name: /pomodoro/i,
    }).type(30);

    cy.findByRole('spinbutton', {
      name: /short break/i,
    }).clear();
    cy.findByRole('spinbutton', {
      name: /short break/i,
    }).type(10);

    cy.findByTestId('#d880f5').click();
    cy.findByRole('button', {
      name: /apply/i,
    }).click();
    cy.findByTestId('clock').should('have.text', '30:00');
    cy.findByRole('button', {
      name: /short break/i,
    }).click();
    cy.findByTestId('clock').should('have.text', '10:00');
  });
});
