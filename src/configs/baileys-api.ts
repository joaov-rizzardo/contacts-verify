import axios, { AxiosInstance } from "axios";
import { EnvironmentVariables } from "../configs/environment-variables";

export type FindContactResponse = {
  contact: {
    exists: boolean;
    jid?: string;
    profilePicture?: string;
  };
};

export class BaileysAPI {
  private api: AxiosInstance;
  private static instance?: BaileysAPI;

  constructor() {
    this.api = axios.create({
      baseURL: EnvironmentVariables.getEnvironmentVariable("BAILEYS_URL"),
      headers: {
        secret: EnvironmentVariables.getEnvironmentVariable("BAILEYS_SECRET"),
        "Content-Type": "application/json",
      },
    });
  }

  async checkInstance(instance: string) {
    try {
      const {
        data: { status },
      } = await this.api.get<{ status: boolean }>(
        `/sessions/${instance}/status`
      );
      return status;
    } catch {
      return false;
    }
  }

  async findContact(
    instance: string,
    number: string
  ): Promise<{ jid?: string; picture?: string; exists: boolean } | null> {
    try {
      const {
        data: { contact },
      } = await this.api.get<FindContactResponse>(
        `/${instance}/contacts/${number}`
      );
      return {
        jid: contact.jid,
        picture: contact.profilePicture,
        exists: contact.exists,
      };
    } catch {
      return null;
    }
  }

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new this();
    return this.instance;
  }
}
