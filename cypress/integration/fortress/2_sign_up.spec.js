import {signUpPage} from '../../pages/sign-up.js';
import {dashboardPage} from '../../pages/dashboard.js';
import {requests} from '../../support/requests.js';
import {getRandomCharLength, getRandomNumberLength} from '../../support/dataGenerator.js';

const {generateToken} = require('authenticator');
let imaps = require('imap-simple');

describe('Sign Up New Customer', function() {

    const signUpLink = Cypress.env('urls').signUp;
    const signInLink = Cypress.env('urls').signIn;
    const dashboardLink = Cypress.env('urls').dashboard;

    const firstName = 'test' + getRandomCharLength(8);
    const lastName = firstName;
    const email = 'zavgorodniialexander16+' + getRandomCharLength(10) + '@gmail.com';
    const phoneNumber = '+38067' + getRandomNumberLength(7);
    const personalUrl = 'test' + getRandomCharLength(15);
    const companyName = personalUrl;
    const taxNumber = getRandomNumberLength(6);
    const numberOfEmployees = getRandomNumberLength(1);
    const companyWebAddress = 'https://' + getRandomCharLength(20) + '.com';
    const country = 'Ukraine';
    const state = 'Poltavs\'ka Oblast\'';
    const city = 'Poltava';
    const zip = getRandomNumberLength(6);
    const password = getRandomCharLength(4) + getRandomNumberLength(4);

    const mailSubject = 'Fortress - Email verification';
    const mailBody = 'Please verify your email by providing the following code';

    let fetchOptions = {
        bodies: ['TEXT'],
        markSeen: false
    };

    let config = {
        imap: {
            user: 'zavgorodniialexander16@gmail.com',
            password: 'WA12aszx34',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { "servername": "imap.gmail.com" },
            markSeen: true,
            authTimeout: 120000
        }
    };

    let messageSince, confirmationCode;
    let formattedKey, formattedToken;

    it('should sign up as new customer', function() {
        
        cy.visit(signUpLink);

        cy.get(signUpPage.firstNameField).type(firstName);

    });

});