import cluster from "cluster";
import os from "os";
import { ClusterMap } from "./cluster-map";

export class ClusterInit {
  static initClusters() {
    const NUM_CPUS = os.cpus().length;
    Array.from({ length: NUM_CPUS }).forEach(() => {
      const worker = cluster.fork();
      ClusterMap.add(worker);
    });
  }
}
