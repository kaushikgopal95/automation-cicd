describe('PlantBot App Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/')
  })

 

  it('should have basic app structure', () => {
    // Check if the root element exists
    cy.get('#root').should('exist')
    
    // Check if the app is mounted (React app loaded)
    cy.get('#root').should('not.be.empty')
  })

  
})
