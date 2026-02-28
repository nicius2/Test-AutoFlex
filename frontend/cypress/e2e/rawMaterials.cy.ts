describe('Raw Materials Management', () => {
     beforeEach(() => {
          cy.visit('/raw-materials')
     })

     it('should create, list, and delete a raw material', () => {
          const rmName = `Cimento Teste ${Date.now()}`
          const rmPrice = '35.90'
          const rmStock = '100'

          // 1. Click 'Nova Matéria-Prima'
          cy.contains('button', 'Nova Matéria-Prima').click()

          // 2. Fill the form
          cy.get('input[name="name"]').type(rmName)
          cy.get('input[name="stockQuantity"]').type(rmStock)

          // 3. Save
          cy.contains('button', 'Criar matéria-prima').click()

          // 4. Verify in table
          cy.contains('td', rmName).should('be.visible')
          cy.contains('td', rmStock).should('be.visible')

          // 5. Delete
          cy.contains('tr', rmName)
               .find('button[title="Excluir"]')
               .click()

          // Confirm deletion in the custom modal
          cy.contains('button', 'Excluir').click()

          // Verify it's gone
          cy.contains('td', rmName).should('not.exist')
     })
})
