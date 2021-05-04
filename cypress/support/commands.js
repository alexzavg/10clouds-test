// ***********************************************
// https://on.cypress.io/custom-commands
// ***********************************************
import 'cypress-mailosaur';
import {signInPageElements, signInPageData} from '../pages/sign-in.js';
import {navbarElements} from '../pages/navbar.js';

Cypress.Commands.add("signIn", (email, password) => {
    cy.get(signInPageElements.loginField).clear().type(email).should('have.value', email);
    cy.get(signInPageElements.passwordField).clear().type(password);
    cy.contains(signInPageElements.btn, signInPageData.buttons.signIn).click();
});

Cypress.Commands.add("fillOtp", (firstNum, secondNum, thirdNum, fourthNum, fifthNum, sixthNum) => {
    cy.get(signInPageElements.otpInput).eq(0).type(firstNum).should('have.value', firstNum);
    cy.get(signInPageElements.otpInput).eq(1).type(secondNum).should('have.value', secondNum);
    cy.get(signInPageElements.otpInput).eq(2).type(thirdNum).should('have.value', thirdNum);
    cy.get(signInPageElements.otpInput).eq(3).type(fourthNum).should('have.value', fourthNum);
    cy.get(signInPageElements.otpInput).eq(4).type(fifthNum).should('have.value', fifthNum);
    cy.get(signInPageElements.otpInput).eq(5).type(sixthNum).should('have.value', sixthNum);
    cy.contains(signInPageElements.btn, signInPageData.buttons.verify).click();
});

Cypress.Commands.add("logout", () => {
    cy.get(navbarElements.user).click();
    cy.get(navbarElements.logout).click();
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })