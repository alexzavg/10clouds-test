import {signInPageData, signInPageElements} from '../../components/sign-in.js';
import {signUpPageElements} from '../../components/sign-up.js';
import {dashboardPageElements} from '../../components/dashboard.js';
import {usersPageElements, usersPageData} from '../../components/users.js';
import {navbarElements, navbarData} from '../../components/navbar.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getRandomSpecialCharLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Users', function() {

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
    const newUserPassword = getRandomCharLength(1).toUpperCase() + getRandomSpecialCharLength(1) + getRandomCharLength(3) + getRandomNumberLength(3);
    const currentTime = getCurrentTimeISO();

    let adminOtp, adminOtpNew, newUserOtp;
    let temporaryPassword;

    beforeEach(() => {
        cy.intercept(requests['role-search']).as('role-search');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['user-search']).as('user-search');
        cy.intercept(requests['user-remove']).as('user-remove');
    });

    describe('Add & Delete new user', function() {

        it('Add new user, setup MFA & sign in', function() {
            cy.visit(signInLink);
    
            adminOtp = generateToken(adminFormattedKey);
            cy.log('Admin User Google OTP is:', adminOtp);
            let array = Array.from(adminOtp);
    
            cy.url().should('eq', signInLink);
            cy.signIn(adminLogin, adminPassword);
            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
    
            cy.get(dashboardPageElements.scoreValue).should('be.visible');
    
            // ! menu categories text isn't displayed when navbar is expanded, workaround:
            cy.get(navbarElements.fortressLogoTop).click();
            cy.wait(2000);
            cy.contains(navbarElements.category, navbarData.settings).click();
            cy.contains(navbarElements.category, navbarData.adminConfiguration).click();
            cy.contains(navbarElements.category, navbarData.users).click();
    
            cy.url().should('eq', usersLink);
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@role-search').its('response.statusCode').should('eq', 200);
                cy.wait('@user-search').its('response.statusCode').should('eq', 200);
                cy.wait('@device-search').its('response.statusCode').should('eq', 200);
    
                cy.get(usersPageElements.btnAddUser).click();
                cy.get(usersPageElements.firstNameField).type(newUserFirstName);
                cy.get(usersPageElements.lastNameField).type(newUserFirstName);
                cy.get(usersPageElements.emailfield).type(newUserEmail);
                cy.get(usersPageElements.phoneField).type(newUserPhoneNumber);
                cy.get(usersPageElements.roleDropdown).select(role);
                cy.get(usersPageElements.btnAdd).click();
            });
    
            cy.clearCookies();
            cy.clearLocalStorage();
        
            // get verification code from email
            cy.mailosaurGetMessage(serverId, {
                sentFrom: emailsData.emails.support,
                sentTo: newUserEmail,
                subject: emailsData.subjects.userInvitation
            }, {
                receivedAfter: new Date(currentTime),
                timeout: 60000
            }).then(mail => {
                const body = mail.html.body;
                temporaryPassword = body.split('verification code: <b>')[1].slice(0,8);
                cy.log('Temporary password is', temporaryPassword);
    
                cy.visit(signInLink);
                cy.url().should('eq', signInLink);
    
                cy.signIn(newUserEmail, temporaryPassword);
    
                cy.get(signInPageElements.newPasswordField).type(newUserPassword);
                cy.get(signInPageElements.confirmPasswordField).type(newUserPassword);
                cy.contains(signInPageElements.btn, signInPageData.buttons.confirm).click();
    
                cy.signIn(newUserEmail, newUserPassword);
    
                cy.get(signInPageElements.otpTokenBlock).text().then((value) => {
                    newUserOtp = generateToken(value);
                    cy.log('New User Google OTP is:', newUserOtp);
                    let array = Array.from(newUserOtp);
    
                    cy.contains(signInPageElements.btn, signInPageData.buttons.next).click();
                    cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
                    cy.get(dashboardPageElements.scoreValue).should('be.visible');
    
                    cy.clearCookies();
                    cy.clearLocalStorage();
                });    
            });
        });

        it('Remove new user', function() {
            cy.visit(signInLink);
            cy.url().should('eq', signInLink);
    
            cy.signIn(adminLogin, adminPassword);
    
            // due to test failing sometimes because I'm trying to login as admin the second time in less than 30 seconds 
            // (OTP is not yet changed & you can't login with the same OTP twice)
            cy.wait(30000).then(() => {
                adminOtpNew = generateToken(adminFormattedKey);
                cy.log('Admin User Google OTP is:', adminOtpNew);
                expect(adminOtpNew).to.not.equal(adminOtp);
                let arrayNew = Array.from(adminOtpNew);
                
                cy.fillOtp(arrayNew[0], arrayNew[1], arrayNew[2], arrayNew[3], arrayNew[4], arrayNew[5]);
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
    
                cy.visit(usersLink);
                cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                    cy.wait('@role-search').its('response.statusCode').should('eq', 200);
                    cy.wait('@user-search').its('response.statusCode').should('eq', 200);
                    cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                });
    
                cy.get(usersPageElements.searchField).type(newUserFirstName+'{enter}').then(() => {
                    cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                        cy.contains('tr', newUserEmail).parent().within(() => {
                            cy.get(usersPageElements.kebabMenu).click();
                        });
                    });
                });
                cy.contains(usersPageElements.btn, usersPageData.deleteUser).click();
                cy.contains(usersPageElements.popupMenu, usersPageData.ok).click();
                cy.contains('tr', newUserEmail).should('not.exist');
    
                // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-523
                // cy.wait('@user-remove').its('response.statusCode').should('eq', 201);
                
                cy.contains(usersPageElements.amount, '0');
            });
        });
    });
});