import { MongoClient } from "./deps.ts";

const client = new MongoClient();
client.connectWithUri(Deno.env.get("MONGODB_URI")!);

const db = client.database("deno_survey");

export const usersCollection = db.collection("users");
