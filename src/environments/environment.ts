// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  site_title: "MyKart",
  API_URL: 'http://18.222.168.203:8080/mykartapp-api/',
  API_URL_LARAVEL:'http://18.222.168.203/api-mykart/api/',
  STRIPE_CALLBACK_URL: 'http://localhost:3000/vendor/web/authenticate',
  STRIPE_CLIENT_ID: 'ca_CaWZPQhtuxMmOUf1Y1uxMfYLkqbMNlct',
  STRIPE_PUB_KEY: 'pk_test_vFdnuRyWTSUwDwXF6hirECuT',
  STRIPE_SECRET_KEY: 'sk_test_vFdnuRyWTSUwDwXF6hirECuT',
  // STRIPE_PUB_KEY: 'pk_live_6XleqXYW09lUhl9DZChqCVqy',
  // STRIPE_SECRET_KEY: 'sk_live_uVflspgnvB4hcjYiQoT9fuio',
  GOOGLE_MAP_API_KEY: 'AIzaSyAzSRxKEVN3vp_xDtZhzmef-49M4T3tqs4',
  FACEBOOK_APP_ID: '1755050164615080',
  CONNECT_TO_STRIPE:'http://18.222.168.203/api-mykart/stripe/onboarding/start/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
