import {dashboardPageElements, dashboardPageData} from '../../pages/dashboard.js';
import {signUpPageElements} from '../../pages/sign-up.js';
import {alertsPageElements} from '../../pages/alerts.js';
import {requests} from '../../support/requests.js';
import {ValidInDays, ValidInWeeks, PostExtractTimes, ValidInHours} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');

describe('Dashboard functionality', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const alertsLink = Cypress.env('urls').alerts;
    const email = Cypress.env('users').third.email;
    const password = Cypress.env('users').third.password; 
    const formattedKey = Cypress.env('users').third.formattedKey;

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
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.get(dashboardPageElements.scoreValue).should('be.visible');
    });

    it('should check Top Right Dropdown - [Last 1 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1Hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
    });
    
    it('should check Top Right Dropdown - [Last 6 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last6hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true);
            cy.wait(250);
        });
    });

    it('should check Top Right Dropdown - [Last 12 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last12hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true);
            cy.wait(250);
        });
    });

    it('should check Top Right Dropdown - [Last 24 hour]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last24hour).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true);
            cy.wait(250);
        });
    });

    it('should check Top Right Dropdown - [Last 1 week] ', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1week).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        });   
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true);
            cy.wait(250);
        }); 
    });

    // ! disabled due to bug https://qfortress.atlassian.net/browse/FORT-454
    it.skip('should check Top Right Dropdown - [Last 3 month]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');

        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.Last3month).click();
        cy.get(signUpPageElements.spinner).should('not.exist');
        // ! Need dev fix, difference is now in days, should be 3 calendar months
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
            cy.wait(250);
        });
        cy.wait('@customer-top-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
            cy.wait(250);
        });  
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = PostExtractTimes(interception);
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true);
            cy.wait(250);
        });  
    });

    it('should open & close [Right Menu] - [Regulation]', function() {
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
    });

    it('should open & close [Right Menu] - [Top News]', function() {
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
    });

    it('should open & check redirect to [Alerts] page from [Right Menu] - [Top Endpoints]', function() {
        cy.intercept(requests['customer-top-statistics']).as('customer-top-statistics');
        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['service-statistics']).as('service-statistics');
        cy.intercept(requests['device-search']).as('device-search');
        cy.intercept(requests['alert-search']).as('alert-search');

        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topEndpoints).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible').then(() => {
            cy.get(dashboardPageElements.rightMenuCategoryOpen).within((value) => {
                let items = value.find(dashboardPageElements.rightMenuItem);
                cy.wrap(items).as('items');
            });
            cy.get('@items').then((items) => {
                if (items.length > 0) {
                    cy.get(dashboardPageElements.rightMenuCategoryOpen).find(dashboardPageElements.rightMenuItem).first().click();
                    cy.url().should('eq', alertsLink);
                    cy.get(signUpPageElements.spinner).should('not.exist');
    
                    cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                    cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                    cy.wait('@customer-top-statistics').its('response.statusCode').should('eq', 200);
                    cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
                    cy.wait('@service-statistics').its('response.statusCode').should('eq', 200);
                    cy.wait('@service-statistics').its('response.statusCode').should('eq', 200);
                    cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                    cy.wait('@device-search').its('response.statusCode').should('eq', 200);
                    cy.wait('@alert-search').its('response.statusCode').should('eq', 200);
    
                    cy.get(alertsPageElements.filtersBtn).click();
                }
                else {
                    cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).click();
                    cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('not.exist');
                    cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
                }
            });
        });
    });

        // // Open & close [Right Menu] - [Top Alerts]
        // cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topAlerts).click();
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('be.visible');
        // cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).click();
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('not.exist');
        // cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');

        // // Open & close [Right Menu] - [Top Users]
        // cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topUsers).click();
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('be.visible');
        // cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).click();
        // cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('not.exist');
        // cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
        
        // // Open & close [Top Menu]
        // cy.get(dashboardPageElements.topMenuOpenBtn).click();
        // cy.get(dashboardPageElements.topMenuBlockOpen).should('be.visible');
        // cy.get(dashboardPageElements.topMenuOpenBtn).click();
        // cy.get(dashboardPageElements.topMenuBlockOpen).should('not.exist');
});