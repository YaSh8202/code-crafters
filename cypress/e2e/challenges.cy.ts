describe("Challenges", () => {
  it("Test Challenge Container", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.url().should("include", "/challenges");
    cy.get('[data-test-id="challengesContainer"]').should("exist");
    cy.get('[data-test-id="challengesContainer"]')
      .find('[data-test-id="challengeCard"]')
      .its("length")
      .should("be.gte", 1);
  });

  it("Test Challenge Card", () => {
    cy.visit("/");
    cy.wait(1000);
    // test image, title, and description
    cy.get('[data-test-id="challengesContainer"]')
      .children()
      .closest('[data-test-id="challengeCard"]')
      .find("img")
      .should("exist");
    cy.get('[data-test-id="challengesContainer"]')
      .children()
      .closest('[data-test-id="challengeCard"]')
      .find("h4")
      .should("exist");
    cy.get('[data-test-id="challengesContainer"]')
      .children()
      .closest('[data-test-id="challengeCard"]')
      .find('[data-test-id="challengeCardDescription"]')
      .should("exist");
    cy.get('[data-test-id="challengesContainer"]')
      .get('[data-test-id="challengeCard"]')
      .first()
      .find('[data-test-id="challengeCardTitle"]')
      .should("exist")
      .click();
    cy.wait(1000);
    cy.url().should("match", /\/challenges\/[a-zA-Z0-9]+/);
  });
});

export {};
