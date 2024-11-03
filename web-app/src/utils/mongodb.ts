// /utils/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";  // Default to an empty string if not defined
if (!uri) {
   throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const client: MongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let dbInstance: Db | null = null;

export async function connectToDB(): Promise<Db> {
   if (!dbInstance) {
      await client.connect();
      dbInstance = client.db();  // The database name is already specified in the URI
   }
   return dbInstance;
}

