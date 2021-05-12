import {dashboardPageElements, dashboardPageData} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {ValidInDays, ValidInWeeks, ExtractTimes, ValidInHours} from '../../support/dataGenerator.js';


const {generateToken} = require('authenticator');

describe('Dashboard functionality', function() {

    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;
    const alerts = Cypress.env('urls').alerts;
    const email = Cypress.env('users').third.email;
    const password = Cypress.env('users').third.password; 
    const formattedKey = Cypress.env('users').third.formattedKey;

    let formattedToken;
 
    it('should cover all the functionality in dashboard', function() {

        cy.intercept(requests['protection-scores']).as('protection-scores');
        cy.intercept(requests['aggregate-alerts']).as('aggregate-alerts');
        cy.intercept(requests['aggregate-users']).as('aggregate-users');
        cy.intercept(requests['aggregate-endpoints']).as('aggregate-endpoints');
        cy.intercept(requests['customer-statistics']).as('customer-statistics');
        cy.intercept(requests['alerts-statistics']).as('alerts-statistics');
        cy.intercept(requests['device-search']).as('device-search');

        cy.visit(signInLink);
        cy.url().should('eq', signInLink);

        formattedToken = generateToken(formattedKey);
        cy.log('Google OTP is:', formattedToken);
        let array = Array.from(formattedToken);
        cy.log(array);

        cy.signIn(email, password);
        cy.fillOtp(array[0], array[1], array[2], array[3], array[4], array[5]);

        // ! aggregate-alerts, users and endpoints requests are deprecated
        // ! there's only 1 request now - customer-top-statistics
        // ! it has aggregated param in it's payload (endpoints, users, alerts)
        // ! need to adjust the test according to the new request
        cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);
        cy.wait('@customer-statistics').its('response.statusCode').should('eq', 200);

        cy.get(dashboardPageElements.scoreValue).should('be.visible');
        cy.url().should('eq', dashboardLink);
  
        // Check Top Right Dropdown - [Last 1 hour]
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1Hour).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });

        // Check Top Right Dropdown - [Last 6 hour]
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last6hour).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 6).should('eq', true)
        });

        // Top Right Dropdown - [Last 12 hour]
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last12hour).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 12).should('eq', true)
        });

        // Top Right Dropdown - [Last 24 hour]        
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last24hour).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
        });
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInHours}).invoke('valid', geturl.start_date, geturl.end_date, 24).should('eq', true)
        });

        // Top Right Dropdown - [Last 1 week]          
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.last1week).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        });   
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInWeeks}).invoke('valid', geturl.start_date, geturl.end_date, 1).should('eq', true)
        }); 

        // Top Right Dropdown - [Last 3 month] 
        // Need fix, difference is now in days, should be 3 calendar months
        cy.get(dashboardPageElements.dropdownSnapshot).click();
        cy.contains(dashboardPageElements.dropdownSnapshotOption, dashboardPageData.Last3month).click();
        cy.wait('@aggregate-users').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
        });
        cy.wait('@aggregate-endpoints').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
        });
        cy.wait('@aggregate-alerts').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
        });  
        cy.wait('@customer-statistics').then((interception) => {
            const geturl = ExtractTimes(interception)
            cy.wrap({'valid': ValidInDays}).invoke('valid', geturl.start_date, geturl.end_date, 84).should('eq', true)
        });   
        
        // Open & close [Right Menu] - [Regulation]
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.regulation).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');

        // Open & close [Right Menu] - [Top Endpoints]
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topEndpoints).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topEndpoints).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');

        // TODO - Open and check redirect to [Alerts] page with relevant filter 
        // cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topEndpoints).click();
        // cy.get(':nth-child(1) > right-menu-endpoint-item > .card-item__row').click(); // TODO
        // cy.url().should('eq', alerts);
        // cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);
        // cy.wait('@device-search').its('response.statusCode').should('eq', 200);
        // cy.wait('@alerts-statistics').its('response.statusCode').should('eq', 200);
        // TODO Check relevant filters
        // cy.get('.filters').click();
        // Back to [Dashboard] page
        // cy.visit(dashboardLink);
        // cy.url().should('eq', dashboardLink);

        // Open & close [Right Menu] - [Top Alerts]
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topAlerts).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topAlerts).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');

        // TODO - Open and check redirect to [Alerts] page with relevant filter 
        // cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topAlerts).click();
        // cy.get(':nth-child(1) > right-menu-alert-item > .card-item__head > .card-item__col').click(); // TODO
        // cy.url().should('eq', alerts);
        // cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);
        // cy.wait('@device-search').its('response.statusCode').should('eq', 200);
        // cy.wait('@alerts-statistics').its('response.statusCode').should('eq', 200);
        // TODO Check relevant filters
        // cy.get('.filters').click();
        // Back to [Dashboard] page
        // cy.visit(dashboardLink);
        // cy.url().should('eq', dashboardLink);

        // Open & close [Right Menu] - [Top Users]
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topUsers).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topUsers).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');

        // TODO - Open and check redirect to [Alerts] page with relevant filter
        // cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topUsers).click();
        // cy.get(':nth-child(1) > right-menu-user-item > .card-item__row').click(); // TODO
        // cy.url().should('eq', alerts);
        // cy.wait('@protection-scores').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-alerts').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-users').its('response.statusCode').should('eq', 200);
        // cy.wait('@aggregate-endpoints').its('response.statusCode').should('eq', 200);
        // cy.wait('@device-search').its('response.statusCode').should('eq', 200);
        // cy.wait('@alerts-statistics').its('response.statusCode').should('eq', 200);
        // TODO Check relevant filters
        // cy.get('.filters').click();
        // Back to [Dashboard] page
        // cy.visit(dashboardLink);
        // cy.url().should('eq', dashboardLink);

        // Open & close [Right Menu] - [Top News]
        cy.contains(dashboardPageElements.rightMenuCategory, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('be.visible');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('be.visible');
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).click();
        cy.contains(dashboardPageElements.rightMenuCategoryTitleOpen, dashboardPageData.topNews).should('not.exist');
        cy.get(dashboardPageElements.rightMenuCategoryOpen).should('not.exist');
        
        // Open & close [Top Menu]
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.topMenuBlockOpen).should('be.visible');
        cy.get(dashboardPageElements.topMenuOpenBtn).click();
        cy.get(dashboardPageElements.topMenuBlockOpen).should('not.exist');

    });

});