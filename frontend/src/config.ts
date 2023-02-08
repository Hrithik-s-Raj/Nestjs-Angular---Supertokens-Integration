import * as ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import {
  Github,
  Google,
  Apple,
} from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import SessionReact from 'supertokens-auth-react/recipe/session';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-auth-react/recipe/thirdparty';

export const SuperTokensReactConfig = {
  appInfo: {
    appName: 'SuperTokens Demo App',
    apiDomain: 'http://localhost:3001',
    websiteDomain: 'http://localhost:3000',
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [
    ThirdPartyEmailPasswordReact.init({
      signInAndUpFeature: {
        providers: [
          Google.init(),
          {
            id: 'custom',
            name: 'Outlook', // Will display "Continue with X"
          },
        ],
      },
    }),
    // ThirdParty.init({
    //   signInAndUpFeature: {
    //     providers: [c],
    //   },
    // }),

    //   signInAndUpFeature: {
    //     providers: [
    //       {
    //         id: 'custom',
    //         get: (redirectURI, authCodeFromRequest) => {
    //           return {
    //             accessTokenAPI: {
    //               // this contains info about the token endpoint which exchanges the auth code with the access token and profile info.
    //               url: 'https://oauth.example.com/token',
    //               params: {
    //                 // example post params
    //                 client_id: 'aaa',
    //                 client_secret: 'aaaa',
    //                 grant_type: 'aaa',
    //                 redirect_uri: redirectURI || '',
    //                 code: authCodeFromRequest || '',
    //                 //...
    //               },
    //             },
    //             authorisationRedirect: {
    //               // this contains info about forming the authorisation redirect URL without the state params and without the redirect_uri param
    //               url: 'https://oauth.example.com',
    //               params: {
    //                 client_id: '<CLIENT ID>',
    //                 scope: '<SCOPES>',
    //                 response_type: 'code',
    //                 //...
    //               },
    //             },
    //             getClientId: () => {
    //               return '<CLIENT ID>';
    //             },
    //             getProfileInfo: async (accessTokenAPIResponse) => {
    //               /* accessTokenAPIResponse is the JSON response from the accessTokenAPI POST call. Using this, you need to return an object of the following type:
    //                             {
    //                                 id: string, // user ID as provided by the third party provider
    //                                 email?: { // optional
    //                                     id: string, // emailID
    //                                     isVerified: boolean // true if the email is verified already
    //                                 }
    //                             }
    //                             */
    //               return {
    //                 id: '...',
    //               };
    //             },
    //           };
    //         },
    //       },
    //     ],
    //   },
    // }),
    SessionReact.init(),
  ],
};

export const SuperTokensWebJSConfig = {
  appInfo: {
    appName: 'SuperTokens Demo',
    apiDomain: 'http://localhost:3001',
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [Session.init()],
};
