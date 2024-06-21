import { Job, Queue, Worker } from "bullmq";
import { RedisProvider } from "../configs/redis-provider";
import { RepositoryProvider } from "../configs/repository-provider";
import { ContactRepository } from "../repositories/abstract/contact-repository";
import {
  ContactVerifyPayloadSchema,
  ContactsVerifyQueue,
} from "../queues/contacts-verify-queue";
import { TerminalLogger } from "../common/terminal-logger";
import { z } from "zod";
import chalk from "chalk";

export class ContactVerifyJob {
  static readonly queueName = "contact-verify-job";
  static init() {
    this.initQueue();
    this.initWorker();
  }

  private static async initQueue() {
    const queue = new Queue(this.queueName, {
      connection: RedisProvider.getRedisConnection(),
    });
    const jobs = await queue.getRepeatableJobs();
    jobs.forEach((job) => queue.removeRepeatableByKey(job.key));
    queue.add(
      "contact-verify",
      {},
      {
        repeat: {
          every: 60 * 1000 * 60,
        },
      }
    );
  }

  private static initWorker() {
    new Worker(this.queueName, this.handleJob, {
      connection: RedisProvider.getRedisConnection(),
    });
  }

  private static async handleJob(_: Job<any, any, string>) {
    TerminalLogger.log("Iniciando job de verificação de contatos", "info");
    const contactsRepo =
      RepositoryProvider.getRepositoryInstance(ContactRepository);
    const contacts = await contactsRepo.findContactsToVerify(1000);
    const groupedByWorkspace: Record<string, string[]> = {};
    contacts.forEach((contact) => {
      if (groupedByWorkspace[contact.workspaceId]) {
        groupedByWorkspace[contact.workspaceId].push(contact.id);
      } else {
        groupedByWorkspace[contact.workspaceId] = [contact.id];
      }
    });
    Object.entries(groupedByWorkspace).forEach(([workspaceId, contactIds]) => {
      this.addToQueue({
        workspaceId,
        contactIds,
      });
    });
  }

  private static addToQueue(data: z.infer<typeof ContactVerifyPayloadSchema>) {
    new Queue(ContactsVerifyQueue.queueName, {
      connection: RedisProvider.getRedisConnection(),
    }).add(data.workspaceId, data);
  }
}
