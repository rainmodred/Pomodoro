describe('pomodoro app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
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
    cy.findByTestId('pomodoro-clock').should('have.text', '24:58');
  });

  it('can reset timer', () => {
    cy.clock();
    cy.findByRole('button', {
      name: /start/i,
    }).click();
    cy.tick(2000);
    cy.findByTestId('pomodoro-reset').click();
    cy.findByTestId('pomodoro-clock').should('have.text', '25:00');
  });

  it('can change tab', () => {
    cy.findByRole('tab', {
      name: /short break/i,
    }).click();

    cy.findByTestId('short break-clock').should('have.text', '05:00');
  });

  it('timer resets on tab change', () => {
    cy.clock();
    cy.findByRole('button', {
      name: /start/i,
    }).click();
    cy.tick(2000);
    cy.findByRole('tab', {
      name: /short break/i,
    }).click();
    cy.findByRole('tab', {
      name: /pomodoro/i,
    }).click();
    cy.findByTestId('pomodoro-clock').should('have.text', '25:00');
  });

  it('can change settings', () => {
    expect(localStorage.getItem('settings')).to.equal(null);
    cy.findByTestId('settings').click();
    cy.findByRole('spinbutton', {
      name: /pomodoro/i,
    })
      .clear()
      .type(30);
    cy.findByRole('spinbutton', {
      name: /short break/i,
    })
      .clear()
      .type(10);

    cy.findByTestId('#d880f5').click();
    cy.findByRole('button', {
      name: /apply/i,
    })
      .click()
      .should(() => {
        expect(
          JSON.parse(window.localStorage.getItem('settings')),
        ).to.deep.equal({
          timers: [
            {
              label: 'pomodoro',
              time: 1800,
            },
            {
              label: 'short break',
              time: 600,
            },
            {
              label: 'long break',
              time: 600,
            },
          ],
          selectedColor: '#d880f5',
        });
      });
    cy.findByTestId('pomodoro-clock').should('have.text', '30:00');
    cy.findByRole('tab', {
      name: /short break/i,
    }).click();
    cy.findByTestId('short break-clock').should('have.text', '10:00');
  });
});
