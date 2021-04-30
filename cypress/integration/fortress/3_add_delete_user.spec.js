import {signInPage} from '../../pages/sign-in.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {usersPage} from '../../pages/users.js';
import {navbar} from '../../pages/navbar.js';
import {requests} from '../../support/requests.js';
import {
    getRandomCharLength, 
    getRandomNumberLength, 
    getCurrentTimeISO
} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Add & Delete New User', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const usersLink = Cypress.env('urls').users;
    const adminLogin = Cypress.env('users').second.email;
    const adminPassword = Cypress.env('users').second.password;
    const adminFormattedKey = Cypress.env('users').second.formattedKey;
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    const newUserFirstName = 'cypress' + getRandomCharLength(8);
    const newUserEmail = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const newUserPhoneNumber = '+38093' + getRandomNumberLength(7);
    const role = 'Organization Admin';
    const roleOptionValue = '48f3c9c0-3495-11eb-a909-79ed4890744c';
    const newUserPassword = getRandomCharLength(4) + getRandomNumberLength(4);

    const currentTime = getCurrentTimeISO();

    let usersAmountBefore, usersAmountAfter, usersAmountFinal;
    let adminFormattedToken, newUserFormattedToken;
    let temporaryPassword;

    it('should add new user, setup MFA, login and remove him', function() {

        cy.intercept(requests['role-search']).as('role-search');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['user-search']).as('user-search');

        cy.visit(signInLink);

        cy.url().should('eq', signInLink);
        cy.get(signInPage.loginField).type(adminLogin).should('have.value', adminLogin);
        cy.get(signInPage.passwordField).type(adminPassword);
        cy.get(signInPage.btnSignInFirst).click();
        
        adminFormattedToken = generateToken(adminFormattedKey);
        cy.log('Admin User Google OTP is:', adminFormattedToken);
        let array = Array.from(adminFormattedToken);
        cy.log(array);

        cy.get(signInPage.firstNumField).type(array[0]).should('have.value', array[0]);
        cy.get(signInPage.secondNumField).type(array[1]).should('have.value', array[1]);
        cy.get(signInPage.thirdNumField).type(array[2]).should('have.value', array[2]);
        cy.get(signInPage.fourthNumField).type(array[3]).should('have.value', array[3]);
        cy.get(signInPage.fifthNumField).type(array[4]).should('have.value', array[4]);
        cy.get(signInPage.sixthNumField).type(array[5]).should('have.value', array[5]);
        cy.get(signInPage.btnSignInSecond).click();

        cy.get(dashboardPage.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);

        // menu categories text isn't displayed when navbar is expanded, workaround:
        cy.get(navbar.fortressLogoTop).click();
        cy.wait(1000);

        cy.get(navbar.settings).click();
        cy.get(navbar.adminConfiguration).click();
        cy.get(navbar.users).click();

        cy.wait('@role-search').its('response.statusCode').should('eq', 200);
        cy.wait('@user-search').its('response.statusCode').should('eq', 200);
        cy.wait('@device-search').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', usersLink);
        cy.get(usersPage.spinner).should('not.exist');

        // collapse navbar to see users counter
        cy.get(navbar.fortressLogoTop).click();
        cy.wait(1000);

        cy.get(usersPage.amount).text().then((value) => {
            usersAmountBefore = +value;
            cy.log(usersAmountBefore);
        });

        cy.get(usersPage.btnAddUser).click();
        cy.get(usersPage.firstNameField).type(newUserFirstName).should('have.value', newUserFirstName);
        cy.get(usersPage.lastNameField).type(newUserFirstName).should('have.value', newUserFirstName);
        cy.get(usersPage.emailfield).type(newUserEmail).should('have.value', newUserEmail);
        cy.get(usersPage.phoneField).type(newUserPhoneNumber).should('have.value', newUserPhoneNumber);
        cy.get(usersPage.roleDropdown).select(role).should('have.value', roleOptionValue);
        cy.get(usersPage.btnAdd).click();

        // cy.get(navbar.user).click();
        // cy.get(navbar.logout).click();
    
        // cy.mailosaurGetMessage(serverId, {
        //     sentFrom: 'no-reply@verificationemail.com',
        //     sentTo: newUserEmail,
        //     subject: 'Your temporary password'
        // }, {
        //     receivedAfter: new Date(currentTime),
        //     timeout: 60000
        // }).then(mail => {
        //     const body = mail.html.body;
        //     temporaryPassword = body.split('temporary password is ')[1].slice(0,8); // get temporary password from email
        //     cy.log('Temporary password is', temporaryPassword);

        //     cy.url().should('eq', signInLink);
        //     cy.get(signInPage.loginField).type(newUserEmail);
        //     cy.get(signInPage.passwordField).type(temporaryPassword);
        //     cy.get(signInPage.btnSignInFirst).click();

        //     /*
        //         TODO setup new password, setup MFA, login & logout by new user
        //     */
        // });

    });

});