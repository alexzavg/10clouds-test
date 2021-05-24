import {dashboardPageElements} from '../../pages/dashboard.js';
import {navbarElements, navbarData} from '../../pages/navbar.js';
import {signUpPageElements} from '../../pages/sign-up.js';
import {msspPageElements, msspPageData} from '../../pages/mssp.js';
import {requests} from '../../support/requests.js';
import {emailsData} from '../../support/emailsData.js';
import {getRandomCharLength, getRandomNumberLength, getCurrentTimeISO} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('MSSP', function() {

    const signInLink = Cypress.env('urls').signIn;
    const msspLink = Cypress.env('urls').mssp;
    const signUpLink = Cypress.env('urls').signUp; 
    const serverId = Cypress.env('MAILOSAUR_SERVER_ID');
    const userName = 'Autotest Autotest';
    const email = Cypress.env('users').fourth.email;
    const password = Cypress.env('users').fourth.password;
    const formattedKey = Cypress.env('users').fourth.formattedKey;
    const currentTime = getCurrentTimeISO();
    const customerEmailFirst = getRandomCharLength(15) + getRandomNumberLength(5) + '@' + serverId + '.mailosaur.net';
    
    let formattedToken;

    it('should login', function() {
        cy.visit(signInLink);
        cy.url().should('eq', signInLink);

        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);

        cy.signIn(email, password);
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

            cy.wait('@customer-invitations').its('response.statusCode').should('eq', 201);
        });

        cy.mailosaurGetMessage(serverId, {
            sentFrom: emailsData.emails.support,
            sentTo: customerEmailFirst,
            subject: emailsData.subjects.customerInvitation + userName
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
    });
 
 });