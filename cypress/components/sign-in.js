export const signInPageElements = {
    'loginField': '#login',
    'passwordField': '#password',
    'btn': 'button',
    'otpInput': '[type="number"]',
    'newPasswordField': '#newPassword',
    'confirmPasswordField': '#confirmPassword',
    'btnConfirmNewPassword': ':nth-child(2) > .mat-focus-indicator',
    'otpTokenBlock': '[class="code text-left"]',
    'btnNext': '[type="submit"]',
    'forgotPasswordBtn': '.forgot-btn',
    'emailField': '#email',
    'confirmEmailField': '#confirmEmail',
    'confirmCodeField': '#confirmCode',
    'newPasswordField': '#newPassword',
    'confirmPasswordField': '#confirmPassword',
    'error': 'mat-error',
    'btnDisabled': '.mat-button-disabled',
    'notificationDialogue': 'fortress-dialog'
}

export const signInPageData = {
    'buttons': {
        'signIn': 'Sign in',
        'verify': 'Verify',
        'confirm': 'Confirm',
        'next': 'Next',
        'restorePassword': 'Restore Password'
    },
    'verificationCode': 'Authenticator Verification Code',
    'errors': {
        'emailRequired': 'Email is required.',
        'passwordRequired': 'Password is required.',
        'invalidCredentials': 'Incorrect login email or password',
        'unableToAuthorize': 'Unable to authorize user'
    }
}