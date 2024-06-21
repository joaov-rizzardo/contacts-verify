import { mongoose } from "mongoose-models";
import { EnvironmentVariables } from "./environment-variables";

export class MongooseDatabaseConnection {
  static connect() {
    mongoose.set("strictQuery", true);
    mongoose.connect(EnvironmentVariables.getEnvironmentVariable("MONGO_URI"));
  }
}
