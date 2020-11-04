import { usersCollection } from "../mongo.ts";

export default class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;

  constructor({ id = "", name = "", email = "", password = "" }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  static async findOne(params: object) {
    const user: any = await usersCollection.findOne(params);
    user.id = user?._id.$oid;
    delete user._id;
    return new User(user);
  }

  async save() {
    delete this.id;
    const { $oid } = await usersCollection.insertOne(this);
    console.log($oid);
    this.id = $oid;
    return this;
  }
}
