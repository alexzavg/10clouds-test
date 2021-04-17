import {URLs, creds} from '../support/app-data';

describe('Second test', function() {
 
    it('should login as a standard user', function() {
    
       cy.login(creds.username, creds.password);
 
       cy.url().should('contain', URLs.inventory);
 
    });
 
 });
 