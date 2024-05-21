import type { Schema } from "../resource"
import { env } from '$amplify/env/create-user';
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider"


type Handler = Schema["createUser"]["functionHandler"]
const client = new CognitoIdentityProviderClient()


export const handler: Handler = async (event) => {
  const { email } = event.arguments
  const command = new AdminCreateUserCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: email,
  })
  const response = await client.send(command)
  console.log('####processed');

  return response
}