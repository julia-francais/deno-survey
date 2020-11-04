import { MongoClient } from "./deps.ts";

const client = new MongoClient();
client.connectWithUri(
  "mongodb+srv://jujuf67:Abdenour2020*@denosurvey.ogyoj.mongodb.net/<dbname>?retryWrites=true&w=majority"
);

const db = client.database("deno_survey");

export const usersCollection = db.collection("users");
