import { Worker } from "cluster";

export class ClusterMap {
  static clusters: Map<number, Worker> = new Map();

  static add(cluster: Worker) {
    this.clusters.set(cluster.id, cluster);
  }

  static remove(id: number) {
    this.clusters.delete(id);
  }

  static get(id: number) {
    return this.clusters.get(id);
  }

  static getAll() {
    return Array.from(this.clusters.values());
  }
}
