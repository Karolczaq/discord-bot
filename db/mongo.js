import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error(`Couldn't connect to MongoDB:${error}`);
    process.exit(1);
  }
}
