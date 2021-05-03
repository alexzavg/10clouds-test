import {signUpPageElements, signUpPageData} from '../../pages/sign-up.js';
import {signInPageElements} from '../../pages/sign-in.js';
import {dashboardPageElements} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

describe('Sign Up New Customer', function() {

    const signUpLink = Cypress.env('urls').signUp;
    const confirmLink = Cypress.env('urls').confirm;
    const completeLink = Cypress.env('urls').complete;
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    const firstName = 'test' + getRandomCharLength(8);
    const email = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const phoneNumber = '+38067' + getRandomNumberLength(7);
    const personalUrl = 'test' + getRandomCharLength(15);
    const taxNumber = getRandomNumberLength(6);
    const numberOfEmployees = getRandomNumberLength(1);
    const companyWebAddress = 'https://' + getRandomCharLength(20) + '.com';
    const country = 'Ukraine';
    const state = 'Poltavs\'ka Oblast\'';
    const city = 'Poltava';
    const zip = getRandomNumberLength(6);
    const password = getRandomCharLength(4) + getRandomNumberLength(4);

    const currentTime = getCurrentTimeISO();

    const signInLink = Cypress.config().baseUrl + '/' + personalUrl + '/sign-in';
    const prePaymentLink = Cypress.config().baseUrl + '/' + personalUrl + '/payment/pre';
    const selectServicesLink = Cypress.config().baseUrl + '/' + personalUrl + '/select-services';
    const dashboardLink = Cypress.config().baseUrl + '/' + personalUrl + '/dashboard';

    let confirmationCode;

    it('should sign up as new customer', function() {

        cy.intercept(requests['auth-cognito']).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-me']).as('user-me');
        cy.intercept(requests['customer-status']).as('customer-status');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['aggregate-alerts']).as('aggregate-alerts');
        cy.intercept(requests['aggregate-users']).as('aggregate-users');
        cy.intercept(requests['aggregate-endpoints']).as('aggregate-endpoints');
        cy.intercept(requests['catalog-items']).as('catalog-items');
        cy.intercept(requests['catalog-packages']).as('catalog-packages');
        cy.intercept(requests['service-licenses-order']).as('service-licenses-order');
        cy.intercept(requests['services']).as('services');
        cy.intercept(requests['service-licenses-policies']).as('service-licenses-policies');
        
        cy.visit(signUpLink);

        cy.get(signUpPageElements.firstNameField).type(firstName).should('have.value', firstName);
        cy.get(signUpPageElements.lastNameField).type(firstName).should('have.value', firstName);
        cy.get(signUpPageElements.emailField).type(email).should('have.value', email);
        cy.get(signUpPageElements.phoneNumberField).type(phoneNumber).should('have.value', phoneNumber);
        cy.get(signUpPageElements.personalUrlField).type(personalUrl).should('have.value', personalUrl);
        cy.get(signUpPageElements.btnContinueStep1).click();
    
        cy.get(signUpPageElements.companyNameField).type(personalUrl).should('have.value', personalUrl);
        cy.get(signUpPageElements.taxNumberField).type(taxNumber).should('have.value', taxNumber);
        cy.get(signUpPageElements.numberOfEmployeesField).type(numberOfEmployees).should('have.value', numberOfEmployees);
        cy.get(signUpPageElements.companyWebAddressField).type(companyWebAddress).should('have.value', companyWebAddress);
        cy.get(signUpPageElements.btnContinueStep2).click();
    
        cy.get(signUpPageElements.countryDropdown).select(country).should('have.value', 'UA');
        cy.get(signUpPageElements.stateDropdown).select(state).should('have.value', '53');
        cy.get(signUpPageElements.cityField).type(city).should('have.value', city);
        cy.get(signUpPageElements.zipField).type(zip).should('have.value', zip);
        cy.get(signUpPageElements.btnContinueStep3).click();
    
        cy.get(signUpPageElements.passwordField).type(password);
        cy.get(signUpPageElements.confirmPasswordField).type(password);
        cy.get(signUpPageElements.btnContinueStep4).click();
    
        cy.mailosaurGetMessage(serverId, {
            sentFrom: emailsData.emails.noReply,
            sentTo: email,
            subject: emailsData.subjects.emailVerification
        }, {
            receivedAfter: new Date(currentTime),
            timeout: 60000
        }).then(mail => {
            const body = mail.html.body;
            confirmationCode = body.split('code: ')[1].slice(0,6); // get confirmation code from email
            cy.log('Confirmation code is', confirmationCode);

            cy.url().should('eq', confirmLink);
            cy.get(signUpPageElements.emailField).should('have.value', email);
            cy.get(signUpPageElements.confirmationCodeField).type(confirmationCode).should('have.value', confirmationCode);
            cy.get(signUpPageElements.btnSendConfirmationCode).click();
        });

        cy.url().should('eq', completeLink);
        cy.contains('Initial account setup has been completed');
        cy.get(signUpPageElements.btnSignIn).click();

        cy.url().should('eq', signInLink);
        cy.get(signInPageElements.loginField).type(email).should('have.value', email);
        cy.get(signInPageElements.passwordField).type(password);
        cy.get(signInPageElements.btnSignInFirst).click();

        cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
        cy.wait('@sign-in').its('response.statusCode').should('eq', 200);
        cy.wait('@user-me').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@catalog-items').its('response.statusCode').should('eq', 200);
        cy.wait('@catalog-packages').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', prePaymentLink);
        cy.contains('Choose Your Subscription Plan').should('be.visible');
        cy.get(signUpPageElements.monthlySubscription).click();
        cy.get(signUpPageElements.corePack1).click();
        cy.get(signUpPageElements.btnNextFirst).click();
        cy.get(signUpPageElements.btnNextSecond).click();
        cy.contains('Subscription Plan Summary').should('be.visible');
        cy.get(signUpPageElements.btnNextSecond).click();

        cy.get(signUpPageElements.btnPayByCreditCard).click();
        cy.get(signUpPageElements.btnNextSecond).click();

        cy.wait('@service-licenses-order').its('response.statusCode').should('eq', 201);
        cy.wait('@services').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', selectServicesLink);
        cy.contains(signUpPageData.services.edp).should('be.visible');
        cy.contains(signUpPageData.services.mail).should('be.visible');
        cy.contains(signUpPageData.services.cloudStorage).should('be.visible');
        cy.get(signUpPageElements.highPolicyRadioBtn).click();
        cy.get(signUpPageElements.btnApply).click();

        cy.wait('@service-licenses-policies').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-status').its('response.statusCode').should('eq', 200);
        cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPageElements.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

    });

});