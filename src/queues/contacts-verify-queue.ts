import { Job, Queue, Worker } from "bullmq";
import { RedisProvider } from "../configs/redis-provider";
import { z } from "zod";
import { ContactsVerifier } from "../common/contacts-verifier";
import { TerminalLogger } from "../common/terminal-logger";

export const ContactVerifyPayloadSchema = z.object({
  workspaceId: z.string(),
  contactIds: z.array(z.string()),
});

export class ContactsVerifyQueue {
  static readonly queueName = "contacts_verify";

  static process() {
    new Worker(this.queueName, this.handleJob, {
      connection: RedisProvider.getRedisConnection(),
      concurrency: 1,
    });
    TerminalLogger.log("Worker escutando fila de verificação", "info");
  }

  private static async handleJob(job: Job<any, any, string>) {
    const validation = ContactVerifyPayloadSchema.safeParse(job.data);
    if (validation.error) throw new Error("Erro de schema");
    const { workspaceId, contactIds } = validation.data;
    const verifier = new ContactsVerifier(workspaceId, contactIds);
    await verifier.verify();
  }
}
