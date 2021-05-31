// https://on.cypress.io/custom-commands
import 'cypress-mailosaur';
import {signInPageElements, signInPageData} from '../components/sign-in.js';
import {signUpPageElements, signUpPageData} from '../components/sign-up.js';
import {navbarElements} from '../components/navbar.js';

Cypress.Commands.add("signUpStepOne", (firstName, lastName, email, phoneNumber, personalUrl) => {
    cy.get(signUpPageElements.firstNameField).clear().type(firstName).should('have.value', firstName);
    cy.get(signUpPageElements.lastNameField).clear().type(lastName).should('have.value', lastName);
    cy.get(signUpPageElements.emailField).clear().type(email).should('have.value', email);
    cy.get(signUpPageElements.phoneNumberField).clear().type(phoneNumber).should('have.value', phoneNumber);
    cy.get(signUpPageElements.personalUrlField).clear().type(personalUrl).should('have.value', personalUrl);
    cy.contains(signUpPageElements.btn, signUpPageData.buttons.continue).click();
});

Cypress.Commands.add("signUpStepTwo", (companyName, taxNumber, numberOfEmployees, companyWebAddress) => {
    cy.get(signUpPageElements.companyNameField).clear().type(companyName).should('have.value', companyName);
    cy.get(signUpPageElements.taxNumberField).clear().type(taxNumber).should('have.value', taxNumber);
    cy.get(signUpPageElements.numberOfEmployeesField).type(numberOfEmployees).should('have.value', numberOfEmployees);
    cy.get(signUpPageElements.companyWebAddressField).type(companyWebAddress).should('have.value', companyWebAddress);
    cy.contains(signUpPageElements.btnSecondStep, signUpPageData.buttons.continue).click();
});

Cypress.Commands.add("signUpStepThree", (country, countryValue, state, stateValue, city, zip) => {
    cy.get(signUpPageElements.countryDropdown).select(country).should('have.value', countryValue);
    cy.get(signUpPageElements.stateDropdown).select(state).should('have.value', stateValue);
    cy.get(signUpPageElements.cityField).clear().type(city).should('have.value', city);
    cy.get(signUpPageElements.zipField).clear().type(zip).should('have.value', zip);
    cy.contains(signUpPageElements.btnThirdStep, signUpPageData.buttons.continue).click();
});

Cypress.Commands.add("signUpStepFour", (password, confirmPassword) => {
    cy.get(signUpPageElements.passwordField).clear().type(password);
    cy.get(signUpPageElements.confirmPasswordField).clear().type(confirmPassword);
});

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

Cypress.Commands.add('clickOutside', () => {
    cy.get('body').click(0, 0); // 0, 0 here are the x and y coordinates
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