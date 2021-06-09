import {signInPageElements, signInPageData} from '../../components/sign-in.js';
import {signUpPageElements} from '../../components/sign-up.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getRandomSpecialCharLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

describe('Restore Password', function() {

    const signInLink = Cypress.env('urls').signIn;
    const forgotPasswordLink = Cypress.env('urls').restorePassword;
    const companyName = Cypress.env('customers').first.name;
    const email = Cypress.env('users').sixth.email;
    const invalidEmail = email.replace('@', '@@');
    const newPassword = getRandomCharLength(1).toUpperCase() + getRandomSpecialCharLength(1) + getRandomCharLength(3) + getRandomNumberLength(3);
    const currentTime = getCurrentTimeISO();
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    beforeEach(() => {
        cy.intercept(requests['auth-cognito']).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-password-reset']).as('user-password-reset');
        cy.intercept(requests['user-password-change']).as('user-password-change');
    });
 
    // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-418
    it.skip('Restore password, check email & login with new password', function() {

        cy.visit(signInLink);
        cy.url().should('eq', signInLink);
        cy.get(signInPageElements.forgotPasswordBtn).click();

        cy.url().should('eq', forgotPasswordLink);
        cy.get(signInPageElements.emailField).type(email);
        cy.contains(signInPageElements.btn, signInPageData.buttons.restorePassword).click();

        cy.wait('@user-password-reset').then((value) => {
            // Request
            expect(value.request.method).to.equal('POST');
            expect(value.request.body.email).to.equal(email);
            expect(value.request.body.siteUrl).to.equal(companyName);
            // Response
            expect(value.response.statusCode).to.equal(201);
            expect(value.response.body.email).to.equal(email);
            expect(value.response.body.siteUrl).to.equal(companyName);
        });
        
        cy.mailosaurGetMessage(serverId, {
            sentFrom: emailsData.emails.noReply,
            sentTo: email,
            subject: emailsData.subjects.emailVerification
        }, {
            receivedAfter: new Date(currentTime),
            timeout: 60000
        }).then(mail => {
            const body = mail.html.body;
            let confirmationCode = body.split('code: ')[1].slice(0,6); // get confirmation code from email

            cy.get(signInPageElements.confirmEmailField).should('have.value', email);
            cy.get(signInPageElements.confirmCodeField).type(confirmationCode);
            cy.get(signInPageElements.newPasswordField).type(newPassword);
            cy.get(signInPageElements.confirmPasswordField).type(newPassword);
            cy.contains(signInPageElements.btn, signInPageData.buttons.confirm).click();

            cy.wait('@user-password-change').then((value) => {
                // Request
                expect(value.request.method).to.equal('POST');
                expect(value.request.body.email).to.equal(email);
                expect(value.request.body.newPassword).to.equal(newPassword);
                expect(value.request.body.siteUrl).to.equal(companyName);
                expect(value.request.body.verificationCode).to.equal(confirmationCode);
                // Response
                expect(value.response.statusCode).to.equal(201);
                expect(value.response.body.email).to.equal(email);
                expect(value.response.body.siteUrl).to.equal(companyName);
            });

            cy.url().should('eq', signInLink);
            cy.signIn(email, newPassword);

            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.contains(signInPageData.verificationCode).should('be.visible');
                cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
            });
        });
    });

    it('Validate error for empty [Email] field', function() {
        cy.visit(forgotPasswordLink);
        cy.url().should('eq', forgotPasswordLink);
        cy.get(signInPageElements.emailField).click();
        cy.clickOutside();
        cy.contains(signInPageElements.error, signInPageData.errors.emailRequired).should('be.visible');
        cy.contains(signInPageElements.btnDisabled, signInPageData.buttons.restorePassword).should('be.visible');
    });

    it('Validate error for invalid email in [Email] field', function() {
        cy.visit(forgotPasswordLink);
        cy.url().should('eq', forgotPasswordLink);
        cy.get(signInPageElements.emailField).type(invalidEmail);
        cy.contains(signInPageElements.btn, signInPageData.buttons.restorePassword).click();
        cy.contains(signInPageElements.notificationDialogue, `Email ${invalidEmail} is not valid`);
        cy.url().should('eq', forgotPasswordLink);
        cy.wait('@user-password-reset').then((value) => {
            // Request
            expect(value.request.method).to.equal('POST');
            expect(value.request.body.email).to.equal(invalidEmail);
            expect(value.request.body.siteUrl).to.equal(companyName);
            // Response
            expect(value.response.statusCode).to.equal(400);
        });
    });
 
 });