describe('speedtest-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome header', () => {
    cy.get('h1').should('contain', 'Welcome in speedtest-app');
  });
});
