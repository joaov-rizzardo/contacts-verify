import { z } from "zod";
import * as dotenv from "dotenv";
import { exit } from "process";

const DotenvSchema = z.object({
  BAILEYS_URL: z.string(),
  BAILEYS_SECRET: z.string(),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  REDIS_PORT: z.string(),
  ENABLE_TERMINAL_LOGS: z.string().optional(),
});

type DotenvSchemaType = z.infer<typeof DotenvSchema>;

export class EnvironmentVariables {
  private static variables: DotenvSchemaType;

  static loadEnvironmentVariables() {
    try {
      dotenv.config();
      this.variables = DotenvSchema.parse(process.env);
    } catch {
      console.log(
        "Cannot read environment variables, please check if they are valid"
      );
      exit(1);
    }
  }

  static getEnvironmentVariable<T extends keyof DotenvSchemaType>(key: T) {
    return this.variables[key];
  }
}
