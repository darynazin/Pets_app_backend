import { bucket } from "../config/firebase-config.js";

async function testBucketConnection() {
  try {
    const [exists] = await bucket.exists();
    console.log("Bucket status:", exists ? "Connected" : "Not Found");
    console.log("Bucket name:", bucket.name);

    if (!exists) {
      console.error("Bucket does not exist. Please check Firebase Console.");
    }
  } catch (error) {
    console.error("Connection test failed:", error.message);
  }
}

testBucketConnection();
