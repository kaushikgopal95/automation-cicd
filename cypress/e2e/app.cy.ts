describe('PlantBot App Tests', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/')
  })

  it('should load the application successfully', () => {
    // Check if the page loads without errors
    cy.get('body').should('be.visible')
    
    // Check if the page title exists (basic HTML structure)
    cy.title().should('exist')
    
    // Check if the page is accessible (no console errors)
    cy.window().its('console.error').should('not.be.called')
  })

  
})
