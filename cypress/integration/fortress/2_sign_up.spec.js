import {signUpPage} from '../../pages/sign-up.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {getRandomCharLength, getRandomNumberLength} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Sign Up New Customer', function() {

    const signUpLink = Cypress.env('urls').signUp;
    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;

    const firstName = 'test' + getRandomCharLength(8);
    const lastName = firstName;
    const email = 'zavgorodniialexander16+' + getRandomCharLength(10) + '@gmail.com';
    const phoneNumber = '+38067' + getRandomNumberLength(7);
    const personalUrl = 'test' + getRandomCharLength(15);
    const companyName = personalUrl;
    const taxNumber = getRandomNumberLength(6);
    const numberOfEmployees = getRandomNumberLength(1);
    const companyWebAddress = 'https://' + getRandomCharLength(20) + '.com';
    const country = 'Ukraine';
    const state = 'Poltavs\'ka Oblast\'';
    const city = 'Poltava';
    const zip = getRandomNumberLength(6);
    const password = getRandomCharLength(4) + getRandomNumberLength(4);

    const mailSubject = 'Fortress - Email verification';
    const mailBody = 'Please verify your email by providing the following code';

    let formattedKey, formattedToken;

    it('should sign up as new customer', function() {
        
        cy.visit(signUpLink);

        cy.get(signUpPage.firstNameField).type(firstName);
        cy.get(signUpPage.lastNameField).type(lastName);
        cy.get(signUpPage.emailField).type(email);
        cy.get(signUpPage.phoneNumberField).type(phoneNumber);
        cy.get(signUpPage.personalUrlField).type(personalUrl);
        cy.get(signUpPage.btnContinueStep1).click();

        cy.get(signUpPage.companyNameField).type(companyName);
        cy.get(signUpPage.taxNumberField).type(taxNumber);
        cy.get(signUpPage.numberOfEmployeesField).type(numberOfEmployees);
        cy.get(signUpPage.companyWebAddressField).type(companyWebAddress);
        cy.get(signUpPage.btnContinueStep2).click();

        cy.get(signUpPage.countryDropdown).select(country).should('have.value', 'UA');
        cy.get(signUpPage.stateDropdown).select(state).should('have.value', '53');
        cy.get(signUpPage.cityField).type(city);
        cy.get(signUpPage.zipField).type(zip);
        cy.get(signUpPage.btnContinueStep3).click();

        cy.get(signUpPage.passwordField).type(password);
        cy.get(signUpPage.confirmPasswordField).type(password);
        cy.get(signUpPage.btnContinueStep4);

    });

});