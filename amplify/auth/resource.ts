import { defineAuth } from '@aws-amplify/backend';
import { addUserToGroup } from "../data/add-user-to-group/resource"
import { createUser } from "../data/create-user/resource"
import { deleteUser } from "../data/delete-user/resource"
import { postConfirmation } from "./post-confirmation/resource"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },

   groups: ["ADMINS","EVERYONE"],

   triggers: {
     postConfirmation,
   },
    
  access: (allow) => [
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
    allow.resource(createUser).to(["createUser"]),
    allow.resource(deleteUser).to(["deleteUser"]),
    allow.resource(postConfirmation).to(["addUserToGroup"])
  ],
});
