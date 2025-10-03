/// <reference types="cypress" />

describe('PlantBot App Tests', () => {
  beforeEach(() => {


    cy.visit('/')
  })

it('TC-21: Validate to check if validation error message is displayed when user sign up field is empty', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('input[name="fullName"]').should('have.attr', 'required');
})

it('TC-22: Validate to check if user can enter valid details on Full name field during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('input[name="phone"]').should('have.attr', 'required');
})

it.only('TC-23: Validate to check if user can select "User Type" from the dropdown during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('select').should('have.value', 'business')

})
})