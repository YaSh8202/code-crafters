describe("Solutions", () => {
  it("Test Solutions Container", () => {
    cy.visit("/solutions");
    cy.wait(1000);
    cy.url().should("include", "/solutions");
    cy.get('[data-test-id="solutionsContainer"]').should("exist");
    cy.get('[data-test-id="solutionsContainer"]')
      .find('[data-test-id="solutionCard"]')
      .its("length")
      .should("be.gte", 1);
  });

  it("Test Solution Card", () => {
    cy.visit("/solutions");
    cy.wait(1000);
    cy.get('[data-test-id="solutionsContainer"]')
      .children()
      .closest('[data-test-id="solutionCard"]')
      .find('[data-test-id="solutionCardImage"]')
      .should("exist");
    cy.get('[data-test-id="solutionsContainer"]')
      .get('[data-test-id="solutionCard"]')
      .first()
      .find('[data-test-id="solutionCardTitle"]')
      .should("exist")
      .click();

    cy.wait(2000);
    cy.url().should("match", /\/solutions\/[a-zA-Z0-9]+/);
  });
});

export {};
