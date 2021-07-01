export const requestTypes = {
  'get': 'GET',
  'post': 'POST',
  'put': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE'
}

export const swaggerSections = {
  'auth': '/api/#/auth',
  'role': '/api/#/role',
  'user': '/api/#/user',
  'alert': '/api/#/alert',
  'alert-events': '/api/#/alert-events',
  'services': '/api/#/services',
  'service-licenses': '/api/#/service-licenses',
  'service-accounts': '/api/#/service-accounts',
  'services-statistics': '/api/#/services-statistics',
  'protection-scores': '/api/#/protection-scores',
  'customer': '/api/#/customer',
  'customer-invitations': '/api/#/Customer%20Invitations',
  'pricing-configuration': '/api/#/pricing-configuration',
  'device': '/api/#/device',
  'payments': '/api/#/payments',
  'exchange-rate': '/api/#/exchange-rate',
}

export const swaggerLinks = {
  'refresh-tokens': '/api/#/auth/refreshTokens',
  'cognito-pool-settings':'/api/#/auth/getCognitoPoolSettings',
  'sign-up': '/api/#/auth/signUp',
  'sign-in': '/api/#/auth/signIn',
  'sign-out': '/api/#/auth/signOut',
  'role-create': '/api/#/role/createRole',
  'role-update': '/api/#/role/updateRole',
  'role-get': '/api/#/role/getRole',
  'role-search': '/api/#/role/searchForRoles',
  'user-me': '/api/#/user/getMe',
  'get-user-by-id': '/api/#/user/getUserById',
  'update-user': '/api/#/user/updateUser',
  'find-users': '/api/#/user/findUsers',
  'user-change-password': '/api/#/user/userChangePassword',
  'user-reset-password': '/api/#/user/userResetPassword',
  'reset-user-mfa': '/api/#/user/resetUserMFA',
  'remove-user': '/api/#/user/removeUser',
  'search-customer-alerts': '/api/#/alert/searchCustomerAlerts',
  'alert-action': '/api/#/alert/alertsAction'
}

export const endpoints = {
  'auth': {
    'refresh-tokens':'/auth/refresh-tokens',
    'cognito-pool-settings':'/auth/cognito-pool-settings',
    'sign-up':'/auth/sign-up',
    'sign-in': '/auth/sign-in',
    'sign-out': '/auth/sign-out'
  },
  'role': {
    'role': '/role',
    'role-search': '/role/search'
  },
  'user': {
    'user-me': '/user/me',
    'user': '/user',
    'user-search': '/user/search',
    'user-password-change': '/user/password/change',
    'user-password-reset': '/user/password/reset',
    'user-mfa-reset': '/user/mfa/reset',
    'user-remove': '/user/remove'
  },
  'alert': {
    'alert-search': '/alert/search',
    'alert-action': '/alert/action'
  }
}