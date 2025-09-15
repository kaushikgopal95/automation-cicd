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
    const baseUrl = Cypress.config('baseUrl')
    console.log('Base URL:', baseUrl)
    cy.url().should('eq', `${baseUrl}/`)
    cy.get('span').should('contain','Premium Quality Plants')
  })

  it('TC-8: Validate to check if the sign in button opens up the side drawer', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('h2').should('contain','Welcome Back')
  })


  it('TC-9: Validate to check if the X icon is functional on sign in drawer', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('button > svg.lucide-x').click()
    cy.get('span').should('contain','Premium Quality Plants')
  })

  it('TC-10: Validate to check if clicking cart button displays "Please sign in message"', () => {
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('p').should('contain','Please sign in to view your cart') 
  })

  it('TC-11: Validate to check if "Get Started" button in the hero section is functional', () => {
    cy.get('button').contains('Get Started').click()
    cy.get('h2').should('contain','Create an Account')
  })

  it('TC-12: Validate to check if "back to sign in" redirects the user to sign in page', () => {
    cy.get('button').contains('Get Started').click()
    cy.get('button').contains('Back to sign in').click()
    cy.get('h2').should('contain','Welcome Back')
  })

  it('TC-13: Validate to check if invalid keywords in search box shows "No plants found" message', () => {
    cy.get('input[placeholder="Search plants..."]').type('xyzabc')
    cy.get('button[type="submit"]').contains('Search').click();
    cy.contains('h2', 'Featured Products')
    .next('p')
    .should('contain', 'No products found for "xyzabc"'); 
  })

  it('TC-14: Validate to check if searching for "Snake Plant" displays the relevant product', () => {
    cy.get('input[placeholder="Search plants..."]').type('Snake Plant')
    cy.get('button[type="submit"]').contains('Search').click();
    cy.contains('p', 'Found 1 result for "Snake Plant"')
    cy.get('[data-testid="product-name"]').should('contain', 'Snake Plant');
  })

  it('TC-15: Validate to check if reloading the page clears the search results', () => {
    cy.get('input[placeholder="Search plants..."]').type('Snake Plant')
    cy.get('button[type="submit"]').contains('Search').click();
    cy.contains('p', 'Found 1 result for "Snake Plant"')
    cy.reload()
    cy.contains('p', 'Handpicked favorites that bring life and beauty to your space')
  })

  it('TC-16: Validate to check if clicking on PlantBot logo redirects the user to home page', () => {
    cy.get('input[placeholder="Search plants..."]').type('Snake Plant')
    cy.get('button[type="submit"]').contains('Search').click();
    cy.contains('p', 'Found 1 result for "Snake Plant"')
    cy.get('[data-testid="logo"]').click()
    cy.url().should('eq',`${Cypress.config('baseUrl')}/`)
    cy.contains('p', 'Handpicked favorites that bring life and beauty to your space')
  })

  it('TC-17: Validate to check clicking on any product card displays the full product details', () => {
    cy.get('img[alt="Fiddle Leaf Fig"]').click()
    cy.get('h1').should('contain','Fiddle Leaf Fig')
    cy.get('div').should('contain','89.99')
    cy.get('h2').should('contain','Frequently Asked Questions')
  })

  it('TC-18: Validate to check if clicking on "Add to cart displays" error message', () => {
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.wait(500)
    cy.get('[data-component-name="ToastTitle"]')
    .should('be.visible')
    .and('contain.text', 'Please sign in');
    cy.get('[data-component-name="ToastDescription"]')
    .should('be.visible')
    .and('contain.text', 'You need to be signed in to add items to cart');
  })

  it('TC-19: Validate to check if clicking on "Subscribe" button without input displays the error message', () => {
    cy.get('[data-testid="newsletter-submit"]').click()
    cy.get('input[type="email"]').should('have.attr', 'required');
    cy.get('[data-testid="newsletter-email"]').then($input => {
    // Get the 1st email input box as a special "HTMLInputElement"
    // This gives us access to the browser's built-in validation features
    const inputElem = $input[0] as HTMLInputElement;
    // Check the input's validity state and Since the email field is empty but required, answer should be "NO" (false)
    expect(inputElem.validity.valid).to.be.false;
    // The browser automatically creates messages like "Please fill out this field"
    // We just check that some message exists (not empty)
    expect(inputElem.validationMessage).to.not.be.empty;
  })
  })

  it('TC-20: Validate to check if entering a valid email and clicking on "Subscribe" button displays success message', () => {
    cy.get('input[type="email"]').type('kaushik.leapus@gmail.com')
    cy.get('[data-testid="newsletter-submit"]').click()
    cy.get('[data-component-name="ToastTitle"]')
    .should('be.visible')
    .and('contain.text', 'Success!');
    cy.get('[data-component-name="ToastDescription"]')
    .should('be.visible')
    .and('contain.text', 'Thank you for subscribing to our newsletter');
  })
})
