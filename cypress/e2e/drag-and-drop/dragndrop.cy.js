/* global cy */

const dragAndDrop = (itemSelector, offsetX = 0, offsetY = 0) => {
  cy.get(itemSelector)
    .should('be.visible')
    .then($item => {
      cy.get('.react-flow')
        .should('be.visible')
        .then($reactFlowEl => {
          const flow = $reactFlowEl[0];
          const rect = flow.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const dataTransfer = new DataTransfer();

          cy.wrap($item).trigger('dragstart', {clientX: x, clientY: y, dataTransfer, which: 1, force: true});
          cy.wait(500);

          cy.get('.react-flow__pane')
            .should('be.visible')
            .trigger('dragover', {dataTransfer, force: true})
            .trigger('drop', { clientX: x + offsetX, clientY: y + offsetY, dataTransfer, force: true });

          cy.wrap($item).trigger('dragend', {force: true});
        });
    });
}

describe('Drag and Drop Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.viewport('macbook-15');
  });

  it('Create topology test', () => {
    dragAndDrop('.Toolbar_routerContainer__JlvAK');
    dragAndDrop('.Toolbar_PCContainer__wvUtm', 100, 100);
    dragAndDrop('.Toolbar_serverContainer__w9\\+bD', 300, 100);
  });
  
});