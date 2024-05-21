import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { createUserProfile } from "./graphql/mutations";
import { type Schema } from "../../data/resource";

//----------------------------------------------------

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: "iam",
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

//----------------------------------------------------
const client = new CognitoIdentityProviderClient();
const client2 = generateClient<Schema>({
  authMode: "iam",
});

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {

  console.log('### Handler(Add Group to EVERYONE) START');
  const command = new AdminAddUserToGroupCommand({
    GroupName: env.GROUP_NAME,
    Username: event.userName,
    UserPoolId: event.userPoolId
  });
  const response = await client.send(command);
  console.log('### Handler(Add Group to EVERYONE) processed', response.$metadata.requestId);

  //----------------------------------------------
  console.log('### Handler2(Add Data to TBL) Start');
  await client2.graphql({
    query: createUserProfile,
    variables: {
      input: {
        email: event.request.userAttributes.email,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
      },
    },
  });
  console.log('### Handler2(Add Data to TBL) End');

  return event;
};
