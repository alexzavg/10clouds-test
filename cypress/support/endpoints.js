export const sections = {
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
    'remove': '/user/remove'
  }
}