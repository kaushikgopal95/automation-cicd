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

it('TC-23: Validate to check if user can select "User Type" from the dropdown during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('select').should('have.value', 'business')
})

it('TC-24: Validate to check if error message is displayed when phone number field is empty during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('input[name="phone"]').should('have.attr', 'required');
})


it('TC-25: Validate to check if error message is displayed when user enters invalid phone number during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('12345')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('input[name="phone"]').then(($input) => {
    const inputElem = $input[0] as HTMLInputElement;
    expect(inputElem.checkValidity()).to.be.false;
    expect(inputElem.validationMessage).to.include('Please match');
  });
})

it.only('TC-26: Validate to check if user can select a country from the dropdown during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.contains('Canada').click();
cy.get('button[role="combobox"]').should('contain.text', 'Canada');
})




})