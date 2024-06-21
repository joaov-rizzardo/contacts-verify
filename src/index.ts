import cluster from "cluster";
import { ClusterInit } from "./clusters/cluster-init";
import { ClusterSetup } from "./clusters/cluster-setup";
import { ContactVerifyJob } from "./jobs/contact-verify-job";
import { EnvironmentVariables } from "./configs/environment-variables";
import { MongooseDatabaseConnection } from "./configs/mongoose-database-connection";

if (cluster.isPrimary) {
  EnvironmentVariables.loadEnvironmentVariables();
  MongooseDatabaseConnection.connect();
  ClusterInit.initClusters();
  ContactVerifyJob.init();
}

if (cluster.isWorker) {
  ClusterSetup.init();
}
