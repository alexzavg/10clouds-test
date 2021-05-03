import {signInPageElements} from '../../pages/sign-in.js';
import {dashboardPageElements} from '../../pages/dashboard.js';
import {usersPageElements, usersPageData} from '../../pages/users.js';
import {navbarElements} from '../../pages/navbar.js';
import {requests} from '../../support/requests.js';
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Add & Delete New User', function() {

    const signInLink = Cypress.env('urls').signIn;
    const usersLink = Cypress.env('urls').users;
    const adminLogin = Cypress.env('users').second.email;
    const adminPassword = Cypress.env('users').second.password;
    const adminFormattedKey = Cypress.env('users').second.formattedKey;
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');

    const newUserFirstName = 'cypress' + getRandomCharLength(8);
    const newUserEmail = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const newUserPhoneNumber = '+38093' + getRandomNumberLength(7);
    const role = 'Organization Admin';
    const newUserPassword = getRandomCharLength(4) + getRandomNumberLength(4);

    const currentTime = getCurrentTimeISO();

    let usersAmountBefore, usersAmountAfter, usersAmountFinal;
    let adminFormattedToken, adminFormattedTokenSecond, newUserFormattedToken;
    let temporaryPassword;

    it('should add new user, setup MFA, login and remove him', function() {

        cy.intercept(requests['role-search']).as('role-search');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['user-search']).as('user-search');

        cy.visit(signInLink);

        adminFormattedToken = generateToken(adminFormattedKey);
        cy.log('Admin User Google OTP is:', adminFormattedToken);
        let array = Array.from(adminFormattedToken);

        cy.url().should('eq', signInLink);
        cy.get(signInPageElements.loginField).type(adminLogin);
        cy.get(signInPageElements.passwordField).type(adminPassword);
        cy.get(signInPageElements.btnSignInFirst).click();
        
        cy.get(signInPageElements.otpInput).eq(0).type(array[0]);
        cy.get(signInPageElements.otpInput).eq(1).type(array[1]);
        cy.get(signInPageElements.otpInput).eq(2).type(array[2]);
        cy.get(signInPageElements.otpInput).eq(3).type(array[3]);
        cy.get(signInPageElements.otpInput).eq(4).type(array[4]);
        cy.get(signInPageElements.otpInput).eq(5).type(array[5]);
        cy.get(signInPageElements.btnSignInSecond).click();

        cy.get(dashboardPageElements.scoreValue).should('be.visible');

        // menu categories text isn't displayed when navbarElements is expanded, workaround:
        cy.get(navbarElements.fortressLogoTop).click();
        cy.wait(2000);

        cy.get(navbarElements.settings).click();
        cy.get(navbarElements.adminConfiguration).click();
        cy.get(navbarElements.users).click();

        cy.wait('@role-search').its('response.statusCode').should('eq', 200);
        cy.wait('@user-search').its('response.statusCode').should('eq', 200);
        cy.wait('@device-search').its('response.statusCode').should('eq', 200);

        cy.url().should('eq', usersLink);
        cy.get(usersPageElements.spinner).should('be.visible');
        cy.get(usersPageElements.spinner).should('not.exist');
        cy.get(usersPageElements.amount).its('length').should('be.gt', 0);

        const checkNumberOfUsers = () => {
            cy.get(usersPageElements.amount).text().then((value) => {
                if(+value > 0){
                    cy.log(+value);
                    return
                }
                checkNumberOfUsers();
            });
        };
        checkNumberOfUsers();

        cy.get(usersPageElements.amount).text().then((value) => {
            usersAmountBefore = +value;
            cy.log('Amount of users before:', usersAmountBefore);

            cy.get(usersPageElements.btnAddUser).click();
            cy.get(usersPageElements.firstNameField).type(newUserFirstName);
            cy.get(usersPageElements.lastNameField).type(newUserFirstName);
            cy.get(usersPageElements.emailfield).type(newUserEmail);
            cy.get(usersPageElements.phoneField).type(newUserPhoneNumber);
            cy.get(usersPageElements.roleDropdown).select(role);
            cy.get(usersPageElements.btnAdd).click();

            cy.get(usersPageElements.spinner).should('not.exist');
            cy.get(usersPageElements.amount).its('length').should('be.gt', 0);
            // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-241
            // usersAmountAfter = String(usersAmountBefore+1);
            // cy.get(usersPageElements.amount).should('contain.text', usersAmountAfter);

            cy.get(navbarElements.user).click();
            cy.get(navbarElements.logout).click();
    
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
                cy.get(signInPageElements.loginField).type(newUserEmail);
                cy.get(signInPageElements.passwordField).type(temporaryPassword);
                cy.get(signInPageElements.btnSignInFirst).click();

                cy.get(signInPageElements.newPasswordField).type(newUserPassword);
                cy.get(signInPageElements.confirmPasswordField).type(newUserPassword);
                cy.get(signInPageElements.btnConfirmNewPassword).click();

                cy.get(signInPageElements.loginField).should('have.value', newUserEmail);
                cy.get(signInPageElements.passwordField).clear().type(newUserPassword);
                cy.get(signInPageElements.btnSignInFirst).click();

                cy.get(signInPageElements.otpTokenBlock).text().then((value) => {
                    newUserFormattedToken = generateToken(value);
                    cy.log('New User Google OTP is:', newUserFormattedToken);
                    let array = Array.from(newUserFormattedToken);
                    cy.get(signInPageElements.btnNext).click();

                    cy.get(signInPageElements.otpInput).eq(0).type(array[0]);
                    cy.get(signInPageElements.otpInput).eq(1).type(array[1]);
                    cy.get(signInPageElements.otpInput).eq(2).type(array[2]);
                    cy.get(signInPageElements.otpInput).eq(3).type(array[3]);
                    cy.get(signInPageElements.otpInput).eq(4).type(array[4]);
                    cy.get(signInPageElements.otpInput).eq(5).type(array[5]);
                    cy.get(signInPageElements.btnSignInSecond).click();

                    cy.get(dashboardPageElements.scoreValue).should('be.visible');

                    cy.get(navbarElements.user).click();
                    cy.get(navbarElements.logout).click();
                });
                
            });

            adminFormattedTokenSecond = generateToken(adminFormattedKey);
            cy.log('Admin User Google OTP is:', adminFormattedTokenSecond);
            let array = Array.from(adminFormattedTokenSecond);

            cy.get(signInPageElements.loginField).type(adminLogin);
            cy.get(signInPageElements.passwordField).type(adminPassword);
            cy.get(signInPageElements.btnSignInFirst).click();

            cy.get(signInPageElements.otpInput).eq(0).type(array[0]);
            cy.get(signInPageElements.otpInput).eq(1).type(array[1]);
            cy.get(signInPageElements.otpInput).eq(2).type(array[2]);
            cy.get(signInPageElements.otpInput).eq(3).type(array[3]);
            cy.get(signInPageElements.otpInput).eq(4).type(array[4]);
            cy.get(signInPageElements.otpInput).eq(5).type(array[5]);
            cy.get(signInPageElements.btnSignInSecond).click();

            cy.get(dashboardPageElements.scoreValue).should('be.visible');

            cy.visit(usersLink);
            cy.get(usersPageElements.spinner).should('be.visible');
            cy.get(usersPageElements.spinner).should('not.exist');

            cy.get(usersPageElements.searchField).type(newUserFirstName+'{enter}');

            cy.contains('tr', newUserEmail).parent().within($tr => {
                cy.get(usersPageElements.kebabMenu).click();
            });
            cy.contains(usersPageElements.kebabMenuBtn, usersPageData.deleteUser).click();
            cy.contains(usersPageElements.popupMenu, usersPageData.ok).click();
            cy.contains('tr', newUserEmail).should('not.exist');

            // cy.get(usersPageElements.spinner).should('not.exist');
            // cy.get(usersPageElements.amount).its('length').should('be.gt', 0);
            // checkNumberOfUsers();

        });

    });

});