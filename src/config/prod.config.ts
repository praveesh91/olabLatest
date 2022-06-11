const VERSION_YEAR = '2022.';
export const prodConfig = {
  "serverAddress": "https://inventory-api.sumtracker.com/",
  ENVIRONMENT: 'production',
  VERSION_NUMBER :  VERSION_YEAR + '3',
  VERSION_INTEGER: '1',
  VERSION_INTEGER_KEY :'inventory_app',
  COOKIE_OPTIONS : {
    path: '/',
    secure: true
  },
  ROLLBAR_ENVIRONMENT: 'production',
  ROLLBAR_TOKEN: 'ac87c10190d04547b34cc44950ff0c38',
  RECAPTCHA_SITEKEY: "6Lf4IOUUAAAAAO6HvkHrYFkw5pGvf6jmANKmHhjo",
  ANGULAR_APP_URL:"https://inventory.sumtracker.com/"
};

export default prodConfig