import {signInPageElements} from '../../pages/sign-in.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

describe('Restore Password', function() {

    const signInLink = Cypress.env('urls').signIn;
    const forgotPasswordLink = Cypress.env('urls').restorePassword;
    const email = Cypress.env('users').sixth.email;
    const password = Cypress.env('users').sixth.password;
    const newPassword = 'C_' + getRandomCharLength(3) + getRandomNumberLength(3);
    const currentTime = getCurrentTimeISO();
 
    it('should restore password, check email & login with new password', function() {

        cy.intercept(requests['auth-cognito']).as('auth-cognito');
        cy.intercept(requests['sign-in']).as('sign-in');
        cy.intercept(requests['user-password-reset']).as('user-password-reset');
        cy.intercept(requests['user-password-change']).as('user-password-change');

        cy.visit(signInLink);
        cy.url().should('eq', signInLink);
        cy.get('.forgot-btn').click();
        cy.url().should('eq', forgotPasswordLink);
        cy.get('#email').type(email);
        cy.contains('button', 'Restore Password').click();

        cy.wait('@user-password-reset').then($value => {
            expect($value.request.body).to.equal('{"siteUrl":"fortress-mssp","email":"physical-solar@u9eitg8h.mailosaur.net","verificationCode":"787970","newPassword":"WA_12aszx"}')
        })
        
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
            cy.log('Confirmation code is', confirmationCode);
            cy.get('#confirmEmail').should('have.value', email);
            cy.get('#confirmCode').type(confirmationCode);
            cy.get('#newPassword').type(newPassword);
            cy.get('#confirmPassword').type(newPassword);
            cy.contains('button', 'Confirm').click();

            cy.signIn(email, password);
            cy.wait('@auth-cognito').its('response.statusCode').should('eq', 200);
        });
    });
 
 });