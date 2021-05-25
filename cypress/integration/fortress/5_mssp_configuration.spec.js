import {dashboardPageElements} from '../../pages/dashboard.js';
import {navbarElements, navbarData} from '../../pages/navbar.js';
import {signUpPageElements} from '../../pages/sign-up.js';
import {msspPageElements, msspPageData} from '../../pages/mssp.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('MSSP Configuration', function() {

    const signInLink = Cypress.env('urls').signIn;
    const msspLink = Cypress.env('urls').mssp;
    const signUpLink = Cypress.env('urls').signUp; 
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');
    const userNameFirst = 'Autotest Autotest';
    const emailFirst = Cypress.env('users').fourth.email;
    const passwordFirst = Cypress.env('users').fourth.password;
    const formattedKeyFirst = Cypress.env('users').fourth.formattedKey;
    const userNameSecond = 'Autotests Autotests';
    const emailSecond = Cypress.env('users').fifth.email;
    const passwordSecond = Cypress.env('users').fifth.password;
    const formattedKeySecond = Cypress.env('users').fifth.formattedKey;
    const currentTime = getCurrentTimeISO();
    const customerEmailFirst = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const customerEmailSecond = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    const companyName = Cypress.env('customers').second.name;
    const companyEmail = Cypress.env('customers').second.email;
    
    afterEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    describe('Invite [Regular] company', function() {

        it('should login', function() {
            cy.visit(signInLink);
            cy.url().should('eq', signInLink);
    
            let formattedToken = generateToken(formattedKeyFirst);
            cy.log('Google OTP is:', formattedToken);
            let array = Array.from(formattedToken);
            cy.log(array);
    
            cy.signIn(emailFirst, passwordFirst);
            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        });
    
        it('should invite [REGULAR] company & check invitation link from mail', function() {
            cy.intercept(requests['customer-search']).as('customer-search');
            cy.intercept(requests['customer-invitations']).as('customer-invitations');
            
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
    
                // ! menu categories text isn't displayed when navbar is expanded, workaround:
                cy.get(navbarElements.fortressLogoTop).click();
                cy.wait(2000);
                cy.contains(navbarElements.category, navbarData.settings).click();
                cy.contains(navbarElements.category, navbarData.msspConfiguration).click();
            });
    
            cy.url().should('eq', msspLink);
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
                cy.get(msspPageElements.inviteCompanyBtn).click();
                cy.get(msspPageElements.customerTypeDropdown).select(msspPageData.customerType.regular);
                cy.get(msspPageElements.emailField).type(customerEmailFirst);
                cy.get(msspPageElements.inviteBtn).click();
                cy.wait('@customer-invitations').then((value) => {
                    expect(value.response.statusCode).to.equal(201);
                    expect(value.request.body.customerType).to.equal(msspPageData.customerType.regular.toUpperCase());
                    expect(value.request.body.email).to.equal(customerEmailFirst);
                });
            });
    
            cy.mailosaurGetMessage(serverId, {
                sentFrom: emailsData.emails.support,
                sentTo: customerEmailFirst,
                subject: emailsData.subjects.customerInvitation + userNameFirst
            }, {
                receivedAfter: new Date(currentTime),
                timeout: 60000
            }).then(mail => {
                const invitationLink = mail.html.links[0].href;
                cy.log('Invitation link:', invitationLink);
                cy.visit(invitationLink);
                cy.url().should('contain', signUpLink);
                cy.get(signUpPageElements.emailField).should('have.value', customerEmailFirst);
            });

            cy.clearCookies();
            cy.clearLocalStorage();
        });
    });

    describe('Invite [MSSP] company', function() {

        it('should login', function() {
            cy.visit(signInLink);
            cy.url().should('eq', signInLink);
    
            let formattedToken = generateToken(formattedKeySecond);
            cy.log('Google OTP is:', formattedToken);
            let array = Array.from(formattedToken);
            cy.log(array);
    
            cy.signIn(emailSecond, passwordSecond);
            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        });
    
        it('should invite [MSSP] company & check invitation link from mail', function() {
            cy.intercept(requests['customer-search']).as('customer-search');
            cy.intercept(requests['customer-invitations']).as('customer-invitations');
            
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
    
                // ! menu categories text isn't displayed when navbar is expanded, workaround:
                cy.get(navbarElements.fortressLogoTop).click();
                cy.wait(2000);
                cy.contains(navbarElements.category, navbarData.settings).click();
                cy.contains(navbarElements.category, navbarData.msspConfiguration).click();
            });
    
            cy.url().should('eq', msspLink);
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
                cy.get(msspPageElements.inviteCompanyBtn).click();
                cy.get(msspPageElements.customerTypeDropdown).select(msspPageData.customerType.mssp);
                cy.get(msspPageElements.emailField).type(customerEmailSecond);
                cy.get(msspPageElements.inviteBtn).click();
                cy.wait('@customer-invitations').then((value) => {
                    expect(value.response.statusCode).to.equal(201);
                    expect(value.request.body.customerType).to.equal(msspPageData.customerType.mssp);
                    expect(value.request.body.email).to.equal(customerEmailSecond);
                });
            });
    
            cy.mailosaurGetMessage(serverId, {
                sentFrom: emailsData.emails.support,
                sentTo: customerEmailSecond,
                subject: emailsData.subjects.customerInvitation + userNameSecond
            }, {
                receivedAfter: new Date(currentTime),
                timeout: 60000
            }).then(mail => {
                const invitationLink = mail.html.links[0].href;
                cy.log('Invitation link:', invitationLink);
                cy.visit(invitationLink);
                cy.url().should('contain', signUpLink);
                cy.get(signUpPageElements.emailField).should('have.value', customerEmailSecond);
            });

            cy.clearCookies();
            cy.clearLocalStorage();
        });
    });

    describe('Search company by [Customer] param, check expanded info', function() {

        it('should login', function() {
            cy.visit(signInLink);
            cy.url().should('eq', signInLink);
    
            let formattedToken = generateToken(formattedKeyFirst);
            cy.log('Google OTP is:', formattedToken);
            let array = Array.from(formattedToken);
            cy.log(array);
    
            cy.signIn(emailFirst, passwordFirst);
            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        });
    
        it('should search company by [Customer] param, check expanded info', function() {
            cy.intercept(requests['customer-search']).as('customer-search');
            cy.intercept(requests['services-statistics']).as('services-statistics');
            
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
            });

            cy.visit(msspLink);
            cy.url().should('eq', msspLink);
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
            });

            cy.get(msspPageElements.searchField).type(companyName+'{enter}').then(() => {
                cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                    cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
                    cy.contains('tr', companyName).click();
                    cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                        cy.get(msspPageElements.companyExpandedInfoBlock).should('be.visible');
                        cy.wait('@services-statistics').its('response.statusCode').should('eq', 200);
                    });
                    cy.contains('tr', companyName).click();
                    cy.get(msspPageElements.companyExpandedInfoBlock).should('not.exist');
                });
            });
        });
    });

    describe('Search company by [Customer] param, check expanded info', function() {

        it('should login', function() {
            cy.visit(signInLink);
            cy.url().should('eq', signInLink);
    
            let formattedToken = generateToken(formattedKeySecond);
            cy.log('Google OTP is:', formattedToken);
            let array = Array.from(formattedToken);
            cy.log(array);
    
            cy.signIn(emailSecond, passwordSecond);
            cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);
        });
    
        it('should search company by [Email] param & switch context to this company', function() {
            cy.intercept(requests['customer-search']).as('customer-search');
            cy.intercept(requests['services-statistics']).as('services-statistics');
            
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
            });

            cy.visit(msspLink);
            cy.url().should('eq', msspLink);
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
            });

            cy.get(msspPageElements.searchField).type(companyEmail+'{enter}').then(() => {
                cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                    cy.wait('@customer-search').its('response.statusCode').should('eq', 200);
                    cy.contains('tr', companyEmail).parent().within(() => {
                        cy.get(msspPageElements.switchContextBtn).click();
                    });
                });
            });
            cy.get(signUpPageElements.spinner).should('not.exist').then(() => {
                cy.get(dashboardPageElements.scoreValue).should('be.visible');
                cy.contains(msspPageElements.breadcrumbs, companyName).should('be.visible');
            });
        });
    });

});