describe('Products Management', () => {
     beforeEach(() => {
          // Intercept API calls if necessary, but here we run against the real local backend
          cy.visit('/products')
     })

     it('should create a new product, display it, and delete it', () => {
          const productName = `Mezanino Teste ${Date.now()}`
          const productPrice = '500.50'

          // 1. Click 'Novo Produto'
          cy.contains('button', 'Novo Produto').click()

          // 2. Fill the form
          cy.get('input[name="name"]').type(productName)
          cy.get('input[name="price"]').type(productPrice)

          // 3. Save
          cy.contains('button', 'Criar produto').click()

          // 4. Verify it's in the table
          // The table should update and we should see our new product.
          cy.contains('td', productName).should('be.visible')

          // Check if price is formatted correctly or just visible
          cy.contains('td', 'R$').should('be.visible')

          // 5. Delete it to clean up
          cy.contains('tr', productName)
               .find('button[title="Excluir"]') // Assuming the delete button has a title or we find it by icon
               .click()

          // Confirm deletion in the modal (custom modal - click the red 'Excluir' button)
          cy.contains('button', 'Excluir').click()

          // Verify it's gone
          cy.contains('td', productName).should('not.exist')
     })
})
