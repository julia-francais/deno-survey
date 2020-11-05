import { MongoClient } from "./deps.ts";

const client = new MongoClient();
client.connectWithUri(
  "mongodb+srv://julia-francais:Abdenour2019*@deno-survey.y8uvj.mongodb.net/<dbname>?retryWrites=true&w=majority"
);

const db = client.database("deno_survey");

console.log("db", db);

export const usersCollection = db.collection("users");

export const surveysCollection = db.collection("surveys");
console.log("surveysCollection", surveysCollection.find());
