import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import ThirdParty from 'supertokens-node/recipe/thirdparty';
import Google from 'supertokens-node/lib/build/recipe/thirdparty/providers/google';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appinfo
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'https://try.supertokens.com';

export const recipeList = [
  // providers: [
  //   // We have provided you with development keys which you can use for testing.
  //   // IMPORTANT: Please replace them with your own OAuth keys for production use.
  //   ThirdPartyEmailPassword.Google({
  //     clientId:
  //       '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
  //     clientSecret: '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',
  //   }),
  //   ThirdPartyEmailPassword.Github({
  //     clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
  //     clientId: '467101b197249757c71f',
  //   }),
  //   ThirdPartyEmailPassword.Apple({
  //     clientId: '4398792-io.supertokens.example.service',
  //     clientSecret: {
  //       keyId: '7M48Y4RYDL',
  //       privateKey:
  //         '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
  //       teamId: 'YWQCXGJRJL',
  //     },
  //   }),
  // ],
  ThirdPartyEmailPassword.init({
    providers: [
      // We have provided you with development keys which you can use for testing.
      // IMPORTANT: Please replace them with your own OAuth keys for production use.
      ThirdPartyEmailPassword.Google({
        clientId:
          '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
        clientSecret: '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',
        scope: ['profile'],
      }),
    ],
    override: {
      apis: (originalImplementation) => {
        return {
          ...originalImplementation,

          // we override the thirdparty sign in / up API
          thirdPartySignInUpPOST: async function (input) {
            if (originalImplementation.thirdPartySignInUpPOST === undefined) {
              throw Error('Should never come here');
            }

            const response =
              await originalImplementation.thirdPartySignInUpPOST(input);

            let Token;
            // if sign in / up was successful...
            if (response.status === 'OK') {
              // In this example we are using Google as our provider
              const accessToken = response.authCodeResponse.id_token;

              Token = atob(accessToken.split('.')[1]);
            }

            return Token;
          },
        };
      },
    },
  }),

  // ThirdParty.init({
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
  //                           {
  //                               id: string, // user ID as provided by the third party provider
  //                               email?: { // optional
  //                                   id: string, // emailID
  //                                   isVerified: boolean // true if the email is verified already
  //                               }
  //                           }
  //                           */
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

  Session.init(),
  Dashboard.init({
    apiKey: 'supertokens_is_awesome',
  }),
];
