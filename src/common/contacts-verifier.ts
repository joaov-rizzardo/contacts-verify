import { BaileysAPI } from "../configs/baileys-api";
import { RepositoryProvider } from "../configs/repository-provider";
import { WorkspaceRepository } from "../repositories/abstract/workspace-repository";
import { ContactRepository } from "../repositories/abstract/contact-repository";
import { Workspace } from "../entities/workspace";
import { ContactNotFoundError } from "./errors/contact-not-found-error";
import { BaileysCommunicationError } from "./errors/baileys-communication-error";
import { CommonVerifyError } from "./errors/common-verify-error";
import { TerminalLogger } from "./terminal-logger";

export class ContactsVerifier {
  private contactIds: string[];
  private workspaceId: string;
  private baileys: BaileysAPI;

  constructor(workspaceId: string, contactIds: string[]) {
    this.workspaceId = workspaceId;
    this.contactIds = contactIds;
    this.baileys = BaileysAPI.getInstance();
  }

  async verify() {
    const workspace = await this.getWorkspace();
    if (!workspace) {
      TerminalLogger.log("Workspace não encontrado", "warn", {
        Workspace: this.workspaceId,
      });
      return;
    }
    if (!(await this.checkInstance(workspace))) {
      TerminalLogger.log("Workspace não está conectado", "warn", {
        Workspace: workspace.getName(),
      });
      return;
    }
    while (this.contactIds.length > 0) {
      const id = this.contactIds.pop();
      if (!id) continue;
      await this.verifyContact(id, workspace);
    }
  }

  private async verifyContact(id: string, workspace: Workspace) {
    const contactRepo =
      RepositoryProvider.getRepositoryInstance(ContactRepository);
    try {
      const contact = await contactRepo.findById(id);
      if (!contact) {
        throw new ContactNotFoundError({
          contactId: id,
          workspaceId: this.workspaceId,
          workspaceName: workspace.getName(),
        });
      }
      const whatsappData = await this.baileys.findContact(
        workspace.getInstance() as string,
        contact.getPhoneNumber()
      );
      if (!whatsappData) {
        throw new BaileysCommunicationError({
          contactId: id,
          workspaceId: this.workspaceId,
          workspaceName: workspace.getName(),
          contactName: contact.getName(),
        });
      }
      await contactRepo.updateWppInfo(id, {
        jid: whatsappData.jid,
        profilePicture: whatsappData.picture,
        phoneNumber: whatsappData.jid
          ? whatsappData.jid.split("@")[0]
          : undefined,
        onWhatsapp: whatsappData.exists,
      });
      TerminalLogger.log("Contato validado com sucesso", "info", {
        Workspace: workspace.getName(),
        Contato: contact.getName(),
      });
    } catch (error) {
      await contactRepo.incrementAttempts(id);
      if (error instanceof CommonVerifyError) {
        TerminalLogger.log(error.message, "error", {
          Workspace: error.getWorkspace(),
          Contato: error.getContact(),
        });
        return;
      }
      if (error instanceof Error) {
        TerminalLogger.log(error.message, "error", {
          Workspace: this.workspaceId,
          Contato: id,
        });
      }
    }
  }

  private async getWorkspace(): Promise<Workspace | null> {
    const workspaceRepo =
      RepositoryProvider.getRepositoryInstance(WorkspaceRepository);
    const workspace = await workspaceRepo.findById(this.workspaceId);
    return workspace;
  }

  private async checkInstance(workspace: Workspace): Promise<boolean> {
    const instance = workspace.getInstance();
    if (!instance) return false;
    return await this.baileys.checkInstance(instance);
  }
}
