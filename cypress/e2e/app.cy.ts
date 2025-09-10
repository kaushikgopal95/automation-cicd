/// <reference types="cypress" />

describe('PlantBot App Tests', () => {
  beforeEach(() => {
    
    
    cy.visit('/')
  })

  it('TC-1: Validate to check if the page title is "PlantBot - Your Plant Care Companion"', () => {
    cy.title().should('eq', 'PlantBot - Your Plant Care Companion')
  })

  it('TC-2: Validate to check if clicking on Shop from navbar redirects the user to shopping section', () => {
    cy.get('nav').contains('Shop').click()
    cy.get('[data-testid="featured-title"]').should('contain', 'Featured Plants')
  })

  it('TC-3: Validate to check if clicking on About from navbar redirects the user to About section', () => {
    cy.get('button').contains('About Us').click()
    cy.get('h2').should('contain', 'About PlantBot')
  })

  it('TC-4: Validate to check if clicking on Contact from navbar redirects the user to Contact Us page', () => {
    cy.get('button').contains('Contact').click()
    cy.url().should('include', '/contact')
    cy.get('h1').should('contain','Get in Touch')
  })

  it('TC-5: Validate to check if the email address mentioned in the contact page accurate', () => {
    cy.get('button').contains('Contact').click()
    cy.get('p').should('contain','kaushik.gopal95@gmail.com')
  })
  
  it('TC-6: Validate to check if the phone number mentioned in the contact page is accurate', () => {
    cy.get('button').contains('Contact').click()
    cy.get('p').should('contain','+91-8147325107')
  })

  it('TC-7: Validate to check if the back button is functional on contact us page', () => {
    cy.get('button').contains('Contact').click()
    cy.get('button').contains('Back').click()
    cy.url().should('eq',`${Cypress.config('baseUrl')}/`)
    cy.get('span').should('contain','Premium Quality Plants')
  })

  it('TC-8: Validate to check if the sign in button opens up the side drawer', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('h2').should('contain','Welcome Back')
  })


  it.only('TC-9: Validate to check if the X icon is functional on sign in drawer', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('button > svg.lucide-x').click()
    cy.get('span').should('contain','Premium Quality Plants')
  })

  it('TC-10: Validate to check if clicking cart button displays "Please sign in message"', () => {
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('p').should('contain','Please sign in to view your cart')
  })
})
