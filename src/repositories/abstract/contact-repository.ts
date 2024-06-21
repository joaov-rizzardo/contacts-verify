import { Contact } from "../../entities/contact";

export type UpdateWppInfoParams = {
  jid?: string;
  phoneNumber?: string;
  profilePicture?: string;
  onWhatsapp: boolean;
};

export type FindContactsToVerifyResponse = {
  id: string;
  workspaceId: string;
}[];

export abstract class ContactRepository {
  abstract findById(id: string): Promise<Contact | null> | Contact | null;
  abstract updateWppInfo(
    id: string,
    args: UpdateWppInfoParams
  ): void | Promise<void>;
  abstract incrementAttempts(id: string): Promise<void> | void;
  abstract findContactsToVerify(
    limit: number
  ): Promise<FindContactsToVerifyResponse> | FindContactsToVerifyResponse;
}
