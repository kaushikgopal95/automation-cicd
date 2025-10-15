/// <reference types="cypress" />


declare global {
  namespace Cypress {
    interface Chainable {
      realHover(options?: any): Chainable<JQuery<HTMLElement>>;
    }
  }
}

describe('PlantBot sign up Test cases', () => {
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
cy.get('span.text-red-400').should('contain', 'At least 8 characters')
cy.get('span').should('contain', 'Weak')
})

it('TC-31: Validate to check if user can enter valid password combination during sign up', () => {  
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('input[name="password"]').type('ValidPass123!')
cy.get('span.text-green-400').should('contain', 'At least 8 characters')
cy.get('span.text-green-400').should('contain', 'Contains number')
cy.get('span').should('contain', 'Strong')
})



it('TC-32: Validate to check if create password and confirm password validations are working', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('input[name="password"]').type('ValidPass123!')
cy.get('input[name="confirmPassword"]').type('DifferentPass123!')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p.text-destructive').should('contain', 'Passwords do not match');
})

it('TC-33: Validate to check if user can upload a profile picture', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[type="file"]').selectFile('cypress/fixtures/Kaushik.jpg', { force: true })
cy.get('img[alt="Profile preview"]').should('be.visible')
})

it('TC-34: Validate to check if agree to terms and conditions is mandatory', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('input[name="password"]').type('ValidPass123!')
cy.get('input[name="confirmPassword"]').type('ValidPass123!')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.get('p.text-red-500').should('contain', 'You must accept the terms and conditions');
})

it('TC-35: Validate to check if user can check the agree to terms and conditions and Subscribe to newsletter checkboxes during sign up', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[name="fullName"]').type('John Paul')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('1234567890')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('Canada{enter}');
cy.get('input[name="email"]').type('kaushik.test@gmail.com')
cy.get('input[name="password"]').type('ValidPass123!')
cy.get('input[name="confirmPassword"]').type('ValidPass12')
cy.get('#terms').check()
cy.get('#terms').should('be.checked')
cy.get('input[type="checkbox"]#newsletter').should('be.checked')
cy.get('button[type="submit"]').contains('Create Account').click()
})

it('TC-36: Validate to check if user can successfully sign up with valid details', () => {
cy.get('[data-testid="get-started-btn"]').click()
cy.get('input[type="file"]').selectFile('cypress/fixtures/Kaushik.jpg', { force: true })
cy.get('input[name="fullName"]').type('Kaushik Test ')
cy.get('select').select('Business')
cy.get('input[name="phone"]').type('9876543210')
cy.get('button[role="combobox"]').click();
cy.get('input[placeholder="Search countries..."]').should('be.visible').type('India{enter}');
cy.get('input[name="email"]').type(`kaushik.test${Date.now()}@gmail.com`)
cy.get('input[name="password"]').type('Test@123')
cy.get('input[name="confirmPassword"]').type('Test@123')
cy.get('#terms').check()
cy.get('#terms').should('be.checked')
cy.get('input[type="checkbox"]#newsletter').should('be.checked')
cy.get('button[type="submit"]').contains('Create Account').click()
cy.contains('div', 'Success').should('be.visible')
cy.contains('div', 'Your account has been created! Please check your email to verify your account.').should('be.visible')
})

it('TC-37: Validate to check if user can login without verifying the email id', () => {
cy.get('button').contains('Sign In').click()
cy.get('input[name="email"]').type('kaushik.test1759811845970@gmail.com')
cy.get('input[name="password"]').type('Test@123')
cy.get('button[type="submit"]').contains('Sign In').click()
cy.contains('div', 'Error').should('be.visible')
cy.contains('div', 'Please verify your email before logging in.').should('be.visible')
})

it('TC-38: Validate to check if user can login with valid credentials after verifying the email id', () => {
cy.get('button').contains('Sign In').click()
cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
cy.get('input[name="password"]').type('Test@123')
cy.get('button[type="submit"]').contains('Sign In').click()
cy.contains('div', 'Success').should('be.visible')
cy.contains('div', 'You have been logged in successfully!').should('be.visible')
cy.get('[data-testid="cart-btn"]').click()
cy.get('p').should('contain', 'Add some beautiful plants to get started!')
})

it.only('TC-39: Validate to check if user can logout successfully', () => {
cy.get('button').contains('Sign In').click()
cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
cy.get('input[name="password"]').type('Test@123')
cy.get('button[type="submit"]').contains('Sign In').click()
cy.contains('button', 'Profile').realHover();
cy.contains('button', 'Sign Out').should('be.visible').click();
cy.contains('button', 'Shop Now')

})

it.only('TC-40: Validate to check if user is redirected to shopping section on clicking "Shop Now" button from hero section', () => {
cy.get('button').contains('Sign In').click()
cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
cy.get('input[name="password"]').type('Test@123')
cy.get('button[type="submit"]').contains('Sign In').click()
cy.contains('button', 'Shop Now').click();
cy.get('[data-testid="featured-title"]').should('contain', 'Featured Plants')
})
})
