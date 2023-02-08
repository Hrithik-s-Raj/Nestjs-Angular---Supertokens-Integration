import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import * as SuperTokensConfig from '../../config';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { MongoClient } from 'mongodb';
import ThirdParty from 'supertokens-node/recipe/thirdparty';

@Injectable()
export class SupertokensService {
  private readonly url = 'mongodb+srv://ktern:ktern@cluster0.iik3p.mongodb.net';
  private client: MongoClient;
  private db;
  public collection: any;
  public token: any;
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    this.client = new MongoClient(this.url, {});
    this.client.connect();
    this.db = this.client.db('test');

    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
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

            {
              id: 'custom',
              get: (redirectURI, authCodeFromRequest) => {
                return {
                  accessTokenAPI: {
                    // this contains info about the token endpoint which exchanges the auth code with the access token and profile info.
                    url: 'https://app.ktern.com/auth/login',
                    params: {
                      // example post params
                      client_id: 'fa12dd4a-c1bb-47c9-b0bd-0386b318f026',
                      client_secret: '<CLIENT SECRET>',
                      grant_type: 'authorization_code',
                      redirect_uri: 'https://app.ktern.com/auth/login',
                      code: authCodeFromRequest || '',

                      //...
                    },
                  },
                  authorisationRedirect: {
                    // this contains info about forming the authorisation redirect URL without the state params and without the redirect_uri param
                    url: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
                    params: {
                      client_id: 'fa12dd4a-c1bb-47c9-b0bd-0386b318f026',
                      scope: 'user.read',
                      response_type: 'id_token',
                      redirectURI: 'https://app.ktern.com/auth/login',
                      //...
                    },
                  },
                  getClientId: () => {
                    return 'fa12dd4a-c1bb-47c9-b0bd-0386b318f026';
                  },
                  getProfileInfo: async (accessTokenAPIResponse) => {
                    console.log(
                      'ascjknajbscjasbc;bas;cnask;cn;klascn;kask;cna;sk',
                      accessTokenAPIResponse,
                    );
                    /* accessTokenAPIResponse is the JSON response from the accessTokenAPI POST call. Using this, you need to return an object of the following type:
                                {
                                    id: string, // user ID as provided by the third party provider
                                    email?: { // optional 
                                        id: string, // emailID
                                        isVerified: boolean // true if the email is verified already
                                    }
                                }
                                */
                    return {
                      id: '...',
                    };
                  },
                };
              },
            },

            // ThirdPartyEmailPassword.Github({
            //   clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
            //   clientId: '467101b197249757c71f',
            // }),

            // ThirdPartyEmailPassword.Apple({
            //   clientId: '4398792-io.supertokens.example.service',
            //   clientSecret: {
            //     keyId: '7M48Y4RYDL',
            //     privateKey:
            //       '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
            //     teamId: 'YWQCXGJRJL',
            //   },
            // }),
          ],
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,

                // we override the thirdparty sign in / up API
                thirdPartySignInUpPOST: async function (input: any) {
                  if (
                    originalImplementation.thirdPartySignInUpPOST === undefined
                  )
                    throw Error('Should never come here');

                  const response =
                    await originalImplementation.thirdPartySignInUpPOST(input);
                  if (response.status === 'OK') {
                    console.log('as;lmaslcmlasmclasml', response);
                    const accessToken = response.authCodeResponse.id_token;
                    this.token = JSON.parse(atob(accessToken.split('.')[1]));

                    const createUserData = {
                      ...this.token,
                      Loggedon: new Date(),
                      superTokenId: response.user.id,
                    };

                    this.client = new MongoClient(
                      'mongodb+srv://ktern:ktern@cluster0.iik3p.mongodb.net',
                    );
                    await this.client.connect();

                    this.collection = this.client
                      .db('test')
                      .collection('users-2');
                    const signedIn = await this.collection.findOne({
                      email: this.token.email,
                    });

                    if (signedIn) {
                      console.log('If Works');
                      await this.collection.updateOne(
                        { email: this.token.email },
                        { $set: { ['Loggedon']: new Date() } },
                      );
                    } else {
                      console.log('else Works');
                      await this.collection.insertOne(createUserData);
                    }
                  }
                  return response;
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
      ],
    });
  }

  async Override() {
    return 'a';
  }
}
