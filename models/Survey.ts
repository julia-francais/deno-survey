import { prepare } from "https://deno.land/x/plugin_prepare@v0.8.0/mod.ts";
import { surveysCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";

export default class Survey extends BaseModel {
  public id: string = "";

  constructor(
    public userId: string,
    public name: string,
    public description: string
  ) {
    super();
  }

  static async findAll(): Promise<Survey[]> {
    const surveys = await surveysCollection.find();
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  static async findByUser(userId: string): Promise<Survey[]> {
    const surveys = await surveysCollection.find({ userId });
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  static async findById(id: string): Promise<Survey | null> {
    console.log("id", await surveysCollection.findOne({ _id: { $oid: id } }));

    const survey = await surveysCollection.findOne({ _id: { $oid: id } });
    if (!survey) {
      return null;
    }
    return Survey.prepare(survey);
  }

  async create() {
    delete this.id;
    const { $oid } = await surveysCollection.insertOne(this);
    this.id = $oid;
    return this;
  }

  async update({ name, description }: { name: string; description: string }) {
    await surveysCollection.updateOne(
      { _id: { $oid: this.id } },
      { $set: { name, description } }
    );
    this.name = name;
    this.description = this.description;
    return this;
  }

  delete() {
    return surveysCollection.deleteOne({ _id: { $oid: this.id } });
  }

  static prepare(data: any): Survey {
    data = BaseModel.prepare(data);
    console.log("data", data);

    const survey = new Survey(data.userId, data.name, data.description);
    survey.id = data.id;
    return survey;
  }
}
