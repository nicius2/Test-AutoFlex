describe('Production Suggestions & Recipes', () => {
     // We need a product and a raw material to test this properly.
     // We will create them, test the recipe, and then clean up.
     const testId = Date.now();
     const prodName = `Produto Receita ${testId}`;
     const rmName = `Materia Receita ${testId}`;

     before(() => {
          // Setup: Create a Product via cy.apiRequest (uses Cypress.env('apiUrl'))
          cy.apiRequest('POST', '/products', {
               name: prodName,
               value: 100.0
          });

          // Setup: Create a Raw Material
          cy.apiRequest('POST', '/raw-materials', {
               name: rmName,
               stockQuantity: 50
          });
     });

     after(() => {
          // Cleanup: delete the product and raw material created in before()
          cy.apiRequest('GET', '/products').then((res) => {
               const body = res.body as Array<{ id: string; name: string }>;
               const prod = body.find((p) => p.name === prodName);
               if (prod) cy.apiRequest('DELETE', `/products/${prod.id}`);
          });
          cy.apiRequest('GET', '/raw-materials').then((res) => {
               const body = res.body as Array<{ id: string; name: string }>;
               const rm = body.find((r) => r.name === rmName);
               if (rm) cy.apiRequest('DELETE', `/raw-materials/${rm.id}`);
          });
     });

     beforeEach(() => {
          cy.visit('/suggestions');
     });

     it('should create a recipe and see the production suggestion update', () => {
          // 1. Open 'Criar Fabricação'
          cy.contains('Criar Fabricação').click();

          // 2. Select the product — wait for modal content to be visible
          cy.contains('Selecione o Produto').should('be.visible');

          // Radix UI Select.Trigger renders as button[role="combobox"]
          cy.get('button[role="combobox"]').first().click();
          cy.contains('[role="option"]', prodName).click();

          // 3. After selecting the product, fetchData() runs (async loading).
          // Wait for the "Adicionar Matéria-Prima" section to appear,
          // which confirms data is loaded and the material section is visible.
          cy.contains('Adicionar Matéria-Prima').should('be.visible');

          // Wait for the raw material Select to be enabled (not disabled during loading)
          cy.get('button[role="combobox"]').last().should('not.be.disabled').click();
          cy.contains('[role="option"]', rmName).click();

          // Set quantity (e.g. 5 units required)
          cy.get('input[type="number"]').clear().type('5');

          // Click Add
          cy.contains('button', 'Adicionar').click();

          // 4. Verify 'Estimativa de Produção' updates
          // The number (10) and text ('unidades possíveis') are rendered in separate <Text> elements,
          // so we verify them independently.
          // If stock is 50, and we need 5, suggestion should be 10.
          cy.contains('unidades possíveis').should('be.visible');
          cy.contains('Estimativa de Produção').parents('div').first().contains('10').should('be.visible');

          // 5. Close modal
          cy.contains('button', 'Fechar').click();

          // 6. Verify main suggestions table
          // Should see the product in the table with 10 units suggested
          cy.contains('td', prodName).should('be.visible');
          cy.contains('10 unidades').should('be.visible');

          // 7. Click Delete Recipe
          cy.contains('tr', prodName)
               .find('button[title="Excluir Fabricação"]')
               .click();

          // Confirm deletion (uses window.confirm on this page)
          cy.on('window:confirm', () => true);

          // Verify it disappears from suggestions (since it has no recipe)
          cy.contains('td', prodName).should('not.exist');
     });
});
