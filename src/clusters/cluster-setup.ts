import { EnvironmentVariables } from "../configs/environment-variables";
import { MongooseDatabaseConnection } from "../configs/mongoose-database-connection";
import { ContactsVerifyQueue } from "../queues/contacts-verify-queue";

export class ClusterSetup {
  static async init() {
    EnvironmentVariables.loadEnvironmentVariables();
    MongooseDatabaseConnection.connect();
    ContactsVerifyQueue.process();
  }
}
