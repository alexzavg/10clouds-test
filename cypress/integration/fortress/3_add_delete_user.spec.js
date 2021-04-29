import {signInPage} from '../../pages/sign-in.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {navbar} from '../../pages/navbar.js';
import {requests} from '../../support/requests.js';
import {
    getRandomCharLength, 
    getRandomNumberLength, 
    getCurrentTimeISO
} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe.only('Add & Delete New User', function() {

    const signInLink = Cypress.env('urls').signIn;
    const adminLogin = Cypress.env('users').second.email;
    const adminPassword = Cypress.env('users').second.password;
    const adminFormattedKey = Cypress.env('users').second.formattedKey;
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    const newUserFirstName = 'cypress' + getRandomCharLength(8);
    const newUserEmail = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const newUserPhoneNumber = '+38093' + getRandomNumberLength(7);
    const newUserPassword = getRandomCharLength(4) + getRandomNumberLength(4);

    const currentTime = getCurrentTimeISO();

    let adminFormattedToken, newUserFormattedToken;
    let temporaryPassword;

    it('should add new user, setup MFA, login and remove him', function() {

        cy.visit(signInLink);

        cy.url().should('eq', signInLink);
        cy.get(signInPage.loginField).type(adminLogin);
        cy.get(signInPage.passwordField).type(adminPassword);
        cy.get(signInPage.btnSignInFirst).click();
        
        adminFormattedToken = generateToken(adminFormattedKey);
        cy.log('Admin User Google OTP is:', adminFormattedToken);
        let array = Array.from(adminFormattedToken);
        cy.log(array);

        cy.get(signInPage.firstNumField).type(array[0]);
        cy.get(signInPage.secondNumField).type(array[1]);
        cy.get(signInPage.thirdNumField).type(array[2]);
        cy.get(signInPage.fourthNumField).type(array[3]);
        cy.get(signInPage.fifthNumField).type(array[4]);
        cy.get(signInPage.sixthNumField).type(array[5]);
        cy.get(signInPage.btnSignInSecond).click();

        cy.get(dashboardPage.scoreValue).should('be.visible');

        /*
            TODO go to users page & add user
        */

        cy.get(navbar.user).click();
        cy.get(navbar.logout).click();
    
        cy.mailosaurGetMessage(serverId, {
            sentFrom: 'no-reply@verificationemail.com',
            sentTo: newUserEmail,
            subject: 'Your temporary password'
        }, {
            receivedAfter: new Date(currentTime),
            timeout: 60000
        }).then(mail => {
            const body = mail.html.body;
            temporaryPassword = body.split('temporary password is ')[1].slice(0,8); // get temporary password from email
            cy.log('Temporary password is', temporaryPassword);

            cy.url().should('eq', signInLink);
            cy.get(signInPage.loginField).type(newUserEmail);
            cy.get(signInPage.passwordField).type(temporaryPassword);
            cy.get(signInPage.btnSignInFirst).click();

            /*
                TODO setup new password, setup MFA, login & logout by new user
            */
        });

    });

});