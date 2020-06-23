// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  game_settings: {
    num_rounds: 5
  },
  firebase: {
    apiKey: "AIzaSyCPztcmS_wYHJRdFpYGBi0Z0qHQxClMmwg",
    authDomain: "big-toe-game.firebaseapp.com",
    databaseURL: "https://big-toe-game.firebaseio.com",
    projectId: "big-toe-game",
    storageBucket: "big-toe-game.appspot.com",
    messagingSenderId: "183267650933",
    appId: "1:183267650933:web:97f0543045af6c67e0373c",
    measurementId: "G-9JWHK79L9P"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
