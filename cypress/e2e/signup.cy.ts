/// <reference types="cypress" />

describe('PlantBot App Tests', () => {
  beforeEach(() => {


    cy.visit('/')
  })

it('TC-21: Validate to check if validation error message is displayed when user sign up field is empty', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Full name is required');
})

it('TC-22: Validate to check if user can enter valid details on Full name field during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Phone number is required');
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
cy.get('p').should('contain', 'Phone number is required');
})


it('TC-25: Validate to check if error message is displayed when user enters invalid phone number during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('12345')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Phone number must be exactly 10 digits');
})

it('TC-26: Validate to check if user can select a country from the dropdown during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
// cy.contains('Canada').click();
cy.get('button[role="combobox"]').should('contain.text', 'Canada');
})

it('TC-27: Validate to check if user can enter blank email sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Email is required');
})

it('TC-28: Validate to check if user can enter invalid email during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('invalidemail')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Please enter a valid email address');
})


it('TC-29: Validate to check if user can enter valid email during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p').should('contain', 'Password is required');
})

it('TC-30: Validate to check if user can enter invalid password combination during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('input[name="password"]').type('short')
cy.get('span').should('contain', 'At least 8 characters')
cy.get('span').should('contain', 'Weak')
})



})