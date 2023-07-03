/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as logger from "firebase-functions/logger";
import {
  HttpsError,
  beforeUserCreated,
} from "firebase-functions/v2/identity";

import * as admin from "firebase-admin";
admin.initializeApp();

export const beforecreated = beforeUserCreated(async (event) => {
  const db = admin.database();
  const whitelisted = await db.ref("users/whitelisted").get();

  const user = event.data;
  if (!user?.email ||
      !whitelisted.val().includes(user.email)) {
    logger.error(`User ${user.email} is not whitelisted ${whitelisted.val()}}`);
    throw new HttpsError("permission-denied", "Unauthorized email");
  }
});
