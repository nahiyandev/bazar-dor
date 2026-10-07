import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
  } else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // বিল্ড টাইমে এরর যাতে না ছোঁড়ে
  clientPromise = Promise.reject(new Error("MONGODB_URI পরিবেশ ভেরিয়েবল সেট করা নেই"));
}

export { clientPromise };
export default clientPromise;