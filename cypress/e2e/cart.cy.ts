/// <reference types="cypress" />

import { contains } from "node_modules/cypress/types/jquery"

describe('PlantBot cart and checkout Test cases', () => {
    beforeEach(() => {
        cy.visit('/')
    })

it('TC-41: Validate to check if clicking on cart icon redirects the user to cart page after sign in', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('p.text-sm').should('contain', 'Add some beautiful plants to get started!')
})

it('TC-42: Validate to check if toast message is displayed when items are added to cart', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.contains('Z Plant has been added to your cart').should('be.visible')   
})

it('TC-43: Validate to check if added items are displayed in the cart', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('[data-testid="cart-item-name"]').should('contain', 'ZZ Plant')
    cy.get('[data-testid="cart-item-price"]').should('contain', '39.99')
    cy.get('[data-testid="checkout-btn"]').should('be.enabled')
})

it('TC-44: Validate to check if user can increment the item quantity in the cart', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('[data-testid="increase-quantity"]').click()
    cy.get('[data-testid="cart-item-quantity"]').should('contain', '2')
    cy.get('[data-testid="cart-total"]').should('contain', '79.98')
})

it('TC-45: Validate to check if user can decrement the item quantity in the cart', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('[data-testid="increase-quantity"]').click()
    cy.get('[data-testid="cart-item-quantity"]').should('contain', '2')
    cy.get('[data-testid="decrease-quantity"]').click()
    cy.get('[data-testid="cart-item-quantity"]').should('contain', '1')
    cy.get('[data-testid="cart-total"]').should('contain', '39.99')

})


it('TC-46: Validate to check if user can delete the item from the cart', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('[data-testid="cart-item-quantity"]').should('contain', '1')
    cy.get('[data-testid="remove-item"]').click()
    cy.contains('Item has been removed from your cart').should('be.visible')
    cy.get('p.text-sm').should('contain', 'Add some beautiful plants to get started!')
})

it('TC-47: Validate to check if clicking on "Checkout" button redirects the user to checkout page', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('button').contains('Proceed to Checkout').click({ force: true })
    cy.url().should('eq', Cypress.config().baseUrl + 'checkout')
    cy.get('h2').should('contain', 'Cart Review')
    cy.get('p').should('contain', 'ZZ Plant')
    cy.get('p').should('contain.text', 'Qty:').and('contain.text', '1');
    cy.get('p.font-semibold').should('contain.text', '$').and('contain.text', '39.99');
    cy.contains('Continue to Address').should('be.enabled')

})

it('TC-48: Validate to check if back button is functional in the checkout page', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('button').contains('Proceed to Checkout').click({ force: true })
    cy.get('h2').should('contain', 'Cart Review')
    cy.get('button').contains('Back').click()
    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('h1').should('contain', 'Bring Nature')
})

it('TC-49: Validate to check if user is redirected to address section on clicking "Continue to Address" button', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('button').contains('Proceed to Checkout').click({ force: true })
    cy.contains('Continue to Address').should('be.enabled').click()
    cy.get('h3').should('contain', 'Shipping Address')
    cy.contains('Continue to Payment').should('be.enabled')
})

it('TC-50: Validate to check if back button from address section is functional', () => {
    cy.get('button').contains('Sign In').click()
    cy.get('input[name="email"]').type('kaushik.leapus@gmail.com')
    cy.get('input[name="password"]').type('Test@123')
    cy.get('button[type="submit"]').contains('Sign In').click()
    cy.contains('button', 'Shop Now').click();
    cy.get('[data-testid=add-to-cart-btn]').eq(2).click()
    cy.get('[data-testid="cart-btn"]').click()
    cy.get('button').contains('Proceed to Checkout').click({ force: true })
    cy.contains('Continue to Address').should('be.enabled').click()
    cy.get('h3').should('contain', 'Shipping Address')
    cy.get('.gap-3 > .border').click()
    cy.get('h2').should('contain', 'Cart Review')
    cy.contains('Continue to Address').should('be.enabled')

})
})