import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let bucket;

try {
  const serviceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString()
  );

  console.log("Project ID:", serviceAccount.project_id);

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  console.log("Using Storage Bucket:", storageBucket);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  bucket = admin.storage().bucket();
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export { bucket };
export default admin;
