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

  it('should have basic app structure', () => {
    // Check if the root element exists
    cy.get('#root').should('exist')
    
    // Check if the app is mounted (React app loaded)
    cy.get('#root').should('not.be.empty')
  })

  it('should be responsive and accessible', () => {
    // Check if the page is responsive
    cy.viewport(1280, 720)
    cy.get('body').should('be.visible')
    
    // Check if the page is accessible (basic accessibility)
    cy.get('body').should('have.attr', 'lang')
  })
})
