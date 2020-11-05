export default class BaseModel {
  protected static prepare(data: any) {
    if (data) {
      console.log("data", data);

      data.id = data?._id.$oid;
      delete data?._id;
      return data;
    }
  }
}
