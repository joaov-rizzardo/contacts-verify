import ioredis from "ioredis";
import { EnvironmentVariables } from "./environment-variables";

export class RedisProvider {
  static instance?: ioredis;

  static getRedisConnection() {
    if (!this.instance) {
      this.instance = new ioredis({
        host: EnvironmentVariables.getEnvironmentVariable("REDIS_URL"),
        port: parseInt(
          EnvironmentVariables.getEnvironmentVariable("REDIS_PORT")
        ),
        maxRetriesPerRequest: null,
      });
    }
    return this.instance;
  }
}
